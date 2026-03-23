import { type } from 'arktype';
import { GeminiAIPayload } from '../../src/services/aiService';
import type { TransportationType } from '../../src/types/weather';
import { AISuggestionSchema, AI_SUGGESTION_JSON_SCHEMA, type AISuggestionResponse, type AISuggestion } from '../../src/types/ai-suggestion';

const transportationMap: Record<TransportationType, string> = {
	walking: '步行',
	cycling: '騎車',
	driving: '開車',
	public: '搭乘大眾交通工具',
};

interface GeminiResponse {
	candidates: Array<{
		content: {
			parts: Array<{
				text: string;
			}>;
		};
	}>;
}

type ErrorCode = 'VALIDATION_ERROR' | 'GEMINI_API_ERROR' | 'UNKNOWN_ERROR';

const createErrorResponse = (code: ErrorCode, message: string, corsHeaders: Record<string, string>, details?: string): Response => {
	const response: AISuggestionResponse = {
		success: false,
		error: { code, message, details },
	};
	return new Response(JSON.stringify(response), {
		status: code === 'VALIDATION_ERROR' ? 422 : 500,
		headers: {
			'Content-Type': 'application/json',
			...corsHeaders,
		},
	});
};

const createSuccessResponse = (data: AISuggestion, corsHeaders: Record<string, string>): Response => {
	const response: AISuggestionResponse = {
		success: true,
		data,
	};
	return new Response(JSON.stringify(response), {
		headers: {
			'Content-Type': 'application/json',
			...corsHeaders,
		},
	});
};

export async function handleAISuggestion(
	request: Request,
	env: { GEMINI_API_KEY: string },
	corsHeaders: Record<string, string>,
): Promise<Response> {
	try {
		const aiRequest: GeminiAIPayload = await request.json();

		if (!aiRequest.weatherData || !aiRequest.userSchedule || !aiRequest.calculation) {
			return createErrorResponse('VALIDATION_ERROR', '缺少必要參數：weatherData、userSchedule 或 calculation', corsHeaders);
		}

		const { weatherData, userSchedule, calculation } = aiRequest;

		// 找出出門和回家時間的溫度
		const parseTime = (timeStr: string) => parseInt(timeStr.split(':')[0]);
		const goOutHour = parseTime(userSchedule.goOutTime);
		const goHomeHour = parseTime(userSchedule.goHomeTime);

		const goOutTemp = weatherData.timePoints.find((point) => point.hour === goOutHour)?.temperature || calculation.averageTemperature;
		const goHomeTemp = weatherData.timePoints.find((point) => point.hour === goHomeHour)?.temperature || calculation.averageTemperature;

		const prompt = `請根據以下詳細天氣資訊和用戶行程，提供個人化的穿搭建議：

天氣資訊：
- 地點：${weatherData.locationName}
- 平均溫度：${calculation.averageTemperature}°C
- 最高溫度：${calculation.maxTemperature}°C
- 最低溫度：${calculation.minTemperature}°C
- 溫差：${calculation.temperatureDifference}°C
- 平均降雨機率：${calculation.averageRainProbability}%

用戶行程：
- 出門時間：${userSchedule.goOutTime} (溫度約${goOutTemp}°C)
- 回家時間：${userSchedule.goHomeTime} (溫度約${goHomeTemp}°C)
- 交通方式：${transportationMap[userSchedule.transportation]}

請提供實用的穿搭建議，要求：
1. outfit 陣列：包含 2-4 件衣物，每件標明 type（top=上衣/bottom=下身/outerwear=外套）
2. accessories 陣列：0-2 件配件（如雨傘、帽子、手套），若無需配件則為空陣列
3. transportTips 陣列：針對「${transportationMap[userSchedule.transportation]}」的 1-2 個提醒
4. warnings 陣列：天氣相關注意事項 0-2 項，若無則為空陣列

注意：
- 如果交通方式為 cycling，統一使用「騎車」一詞
- 保持簡潔實用
- 回答請用繁體中文`;

		const geminiResponse = await fetch(
			`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.GEMINI_API_KEY}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					contents: [
						{
							parts: [{ text: prompt }],
						},
					],
					generationConfig: {
						responseMimeType: 'application/json',
						responseSchema: AI_SUGGESTION_JSON_SCHEMA,
					},
				}),
			},
		);

		if (!geminiResponse.ok) {
			const errorText = await geminiResponse.text();
			console.error('Gemini API Error:', errorText);
			return createErrorResponse('GEMINI_API_ERROR', 'Gemini API 請求失敗', corsHeaders, `Status: ${geminiResponse.status}`);
		}

		const geminiData: GeminiResponse = await geminiResponse.json();
		const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

		if (!rawText) {
			return createErrorResponse('GEMINI_API_ERROR', '無法取得 AI 回應', corsHeaders);
		}

		// 解析 JSON
		let parsedData: unknown;
		try {
			parsedData = JSON.parse(rawText);
		} catch {
			console.error('JSON parse error, raw text:', rawText);
			return createErrorResponse('VALIDATION_ERROR', 'AI 回應格式錯誤，無法解析 JSON', corsHeaders);
		}

		// ArkType 驗證
		const validationResult = AISuggestionSchema(parsedData);

		if (validationResult instanceof type.errors) {
			console.error('Validation failed:', validationResult.summary);
			return createErrorResponse('VALIDATION_ERROR', '穿搭建議格式驗證失敗', corsHeaders, validationResult.summary);
		}

		return createSuccessResponse(validationResult, corsHeaders);
	} catch (error) {
		console.error('AI Suggestion Error:', error);
		return createErrorResponse(
			'UNKNOWN_ERROR',
			'處理 AI 建議時發生未預期的錯誤',
			corsHeaders,
			error instanceof Error ? error.message : 'Unknown error',
		);
	}
}
