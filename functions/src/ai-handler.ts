import { GeminiAIPayload } from '../../src/services/aiService';
import type { TransportationType } from '../../src/types/weather';

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

export async function handleAISuggestion(
	request: Request,
	env: { GEMINI_API_KEY: string },
	corsHeaders: Record<string, string>,
): Promise<Response> {
	try {
		const aiRequest: GeminiAIPayload = await request.json();

		if (!aiRequest.weatherData || !aiRequest.userSchedule || !aiRequest.calculation) {
			return new Response('Missing required parameters: weatherData, userSchedule, and calculation', {
				status: 400,
				headers: corsHeaders,
			});
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
- 濕度

用戶行程：
- 出門時間：${userSchedule.goOutTime} (溫度約${goOutTemp}°C)
- 回家時間：${userSchedule.goHomeTime} (溫度約${goHomeTemp}°C)
- 交通方式：${transportationMap[userSchedule.transportation]}

請提供實用的穿搭建議，包括：
1. 衣物搭配
2. 外套需求（考慮溫差和交通方式）
3. 配件建議（雨具、手套等）
4. 針對交通方式的提醒

格式要求：
1. 重要的衣物名稱和關鍵建議請用 **重點內容** 包圍，例如：**短袖上衣**、**防曬外套**，其餘內容皆不使用'*'
2. 如果交通方式為 cycling，請統一使用「騎車」一詞，儘管cycling可能是摩托車或腳踏車。
3. 保持簡潔實用、簡短，重點關注實用性
4. 在配件建議以及針對交通方式的提醒上，最多提供兩個細項

回答請用繁體中文，重點關注舒適度和天氣適應性。`;
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
							parts: [
								{
									text: prompt,
								},
							],
						},
					],
				}),
			},
		);

		if (!geminiResponse.ok) {
			const errorText = await geminiResponse.text();
			console.error('Gemini API Error:', errorText);
			throw new Error(`Gemini API returned ${geminiResponse.status}: ${errorText}`);
		}

		const geminiData: GeminiResponse = await geminiResponse.json();
		const suggestion = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to generate clothing suggestion';

		return new Response(
			JSON.stringify({
				suggestion,
			}),
			{
				headers: {
					'Content-Type': 'application/json',
					...corsHeaders,
				},
			},
		);
	} catch (error) {
		console.error('AI Suggestion Error:', error);
		return new Response(
			JSON.stringify({
				error: 'Failed to generate AI suggestion',
				details: error instanceof Error ? error.message : 'Unknown error',
			}),
			{
				status: 500,
				headers: {
					'Content-Type': 'application/json',
					...corsHeaders,
				},
			},
		);
	}
}
