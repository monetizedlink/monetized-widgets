import IdTokenVerifier from 'idtoken-verifier';

export const DEFAULT_ORIGIN = 'https://www.monetized.link';

/**
 * Check whether given token is a valid a token or not.
 */
export async function verifyToken(
	{ token, audience }: { token: string; audience: string },
	origin = DEFAULT_ORIGIN,
) {
	try {
		return await verify({ token, audience, issuer: origin });
	} catch (error) {
		console.warn(error);
		return await verify({ token, audience: 'bearer', issuer: origin });
	}
}

export type PageQuery =
	| { type: 'url'; url: string }
	| { type: 'id'; id: string };
/**
 * Check whether given token is a valid a token or not, while also ensuring that it belongs to the given URL/pageId.
 */
export async function verifyTokenStrict(
	params: {
		token: string;
		audience: string;
		publication?: string;
		query: PageQuery;
	},
	origin = DEFAULT_ORIGIN,
) {
	const { token, publication, query } = params;
	let page: PageInfo | null = null;
	if (query.type === 'url') {
		page = await findPage({ url: query.url, publication }, origin);
	} else if (query.type === 'id') {
		page = await getPage(query.id, origin);
	}

	if (!page) {
		throw new Error('page:not-found/query');
	}
	if (publication && page.publication !== publication) {
		throw new Error('page:not-found/publication');
	}

	const audience = page.id.startsWith('r') ? params.audience : 'bearer';
	const payload = await verify({ token, audience, issuer: origin });
	if (payload.scope.includes(`content:${page.id}`)) {
		return payload;
	}
	throw new Error('token:invalid');
}

export type TokenPayload = {
	scope: string[];
	sub: string;
	iat: number;
	exp: number;
};
export function verify(params: {
	token: string;
	audience: string;
	issuer: string;
}) {
	const { token, audience, issuer } = params;
	// @ts-expect-error todo
	const verifier = new IdTokenVerifier({ issuer, audience });
	return new Promise<TokenPayload>((resolve, reject) => {
		verifier.verify(token, (error: Error, payload: TokenPayload) => {
			if (error) {
				reject(error);
				return;
			}
			resolve(payload);
		});
	});
}

/**
 * Find the monetized page for given URL.
 */
export async function findPage(
	args: { url: string; publication?: string },
	origin = DEFAULT_ORIGIN,
): Promise<null | PageInfo> {
	const url = new URL('/api/content/find', origin);
	url.searchParams.set('q', args.url);
	if (args.publication) {
		url.searchParams.set('publication', args.publication);
	}
	const res = await fetch(url);
	if (!res.ok) {
		return null;
	}
	const json = (await res.json()) as { items: PageInfo[] };

	if (!json.items.length) return null;
	return json.items[0]; // what if there's more matches?
}

export async function getPage(pageId: string, origin = DEFAULT_ORIGIN) {
	const url = new URL(`/api/content/info/${pageId}`, origin);
	const res = await fetch(url);
	if (!res.ok) return null;
	const page = (await res.json()) as PageInfo;
	return page;
}

export type PageInfo = {
	id: string;
	title: string;
	url: string;
	created: string;
	updated: string;
	image: {
		url: string;
	};
	publication: string | null;
};

export function withOrigin(origin = DEFAULT_ORIGIN) {
	const _getPage = (params: Parameters<typeof getPage>[0]) =>
		getPage(params, origin);
	const _findPage = (params: Parameters<typeof findPage>[0]) =>
		findPage(params, origin);
	const _verifyToken = (params: Parameters<typeof verifyToken>[0]) =>
		verifyToken(params, origin);
	const _verifyTokenStrict = (
		params: Parameters<typeof verifyTokenStrict>[0],
	) => verifyTokenStrict(params, origin);

	return {
		getPage: _getPage,
		findPage: _findPage,
		verifyToken: _verifyToken,
		verifyTokenStrict: _verifyTokenStrict,
	};
}
