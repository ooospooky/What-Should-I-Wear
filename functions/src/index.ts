export default {
	async fetch(request, env, ctx): Promise<Response> {
		const allowedOrigins = ['https://what-should-i-wear-bd38a.web.app', 'http://localhost:3000', 'http://localhost:3001'];

		const origin = request.headers.get('Origin');
		const isAllowedOrigin = allowedOrigins.includes(origin);

		const corsHeaders = {
			'Access-Control-Allow-Origin': isAllowedOrigin ? origin : 'null',
			'Access-Control-Allow-Methods': 'GET, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type',
		};

		if (request.method === 'OPTIONS') {
			return new Response(null, { headers: corsHeaders });
		}

		if (request.method !== 'GET') {
			return new Response('Method not allowed', { status: 405 });
		}

		const url = new URL(request.url);
		const locationId = url.searchParams.get('locationId');
		const locationName = url.searchParams.get('locationName');
		const dateRange = url.searchParams.get('dateRange') || '';

		if (!locationId || !locationName) {
			return new Response('Missing required parameters: locationId and locationName', {
				status: 400,
				headers: corsHeaders,
			});
		}

		try {
			// 對中文地名進行 URL 編碼
			const encodedLocationName = encodeURIComponent(locationName);

			// weatherService的URL格式
			const apiUrl = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/${locationId}?Authorization=${env.WEATHER_API_KEY}&&LocationName=${encodedLocationName}${dateRange}`;

			console.log('API URL:', apiUrl);

			const response = await fetch(apiUrl);

			console.log('Response status:', response.status);

			if (!response.ok) {
				const errorText = await response.text();
				console.error('API Error Response:', errorText);
				throw new Error(`Weather API returned ${response.status}: ${errorText}`);
			}

			const data = await response.json();

			return new Response(JSON.stringify(data), {
				headers: {
					'Content-Type': 'application/json',
					...corsHeaders,
				},
			});
		} catch (error) {
			console.error('Weather API Error:', error);
			return new Response(
				JSON.stringify({
					error: 'Failed to fetch weather data',
					details: error.message,
				}),
				{
					status: 500,
					headers: {
						'Content-Type': 'application/json',
						...corsHeaders,
					},
				}
			);
		}
	},
} satisfies ExportedHandler<Env>;
