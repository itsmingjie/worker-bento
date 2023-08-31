export interface Env {
	BASE_URL: string;
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const requestUrl = new URL(request.url);
		let someHost = 'https://bento.me';
		const path = requestUrl.pathname;

		if (path.includes('v1')) {
			someHost = 'https://api.bento.me';
		}

		let url = someHost + requestUrl.pathname;
		if (url === 'https://bento.me/') {
			url = 'https://bento.me/itsmingjie';
		} else if (url === 'https://bento.me/login') {
			return Response.redirect('https://bento.me/login', 302);
		} else if (url === 'https://bento.me/signup') {
			return Response.redirect('https://bento.me/signup', 302);
		} else if (url === 'https://bento.me/undefined') {
			return Response.redirect('https://bento.me', 302);
		}

		const init = {
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
				'content-type': 'text/plain;charset=UTF-8',
			},
		};

		async function gatherResponse(response: Response, contentType: string) {
			if (contentType.includes('application/json')) {
				return JSON.stringify(await response.json());
			} else if (contentType.includes('application/text')) {
				return response.text();
			} else if (contentType.includes('text/html')) {
				return response.text();
			} else {
				return response.text();
			}
		}

		const response = await fetch(url, init);
		const contentType = response.headers.get('content-type')!;
		let results = await gatherResponse(response, contentType);
		results = results.replaceAll('https://api.bento.me', env.BASE_URL);

		init.headers['content-type'] = contentType;
		return new Response(results, init);
	},
};
