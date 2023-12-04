import { withOrigin } from '../api.js';
import memoizeOne from 'async-memoize-one';
import type { PageInfo, PageQuery, TokenPayload } from '../api.js';

export type State =
	| { type: 'unknown' /* checking status */ }
	| { type: 'ok'; userId: string; pageId: string; iat: Date; exp: Date }
	| { type: 'error'; message: string; code: string; page?: PageInfo | null }
	| { type: 'no-access'; page: PageInfo };

export type OnFail = (
	code: string,
	details?: { message?: string; code?: string },
) => void;

export async function _check(
	arg: {
		token: string | null;
		strict: boolean;
		audience: string;
		origin: string;
		publication?: string;
		setState: (state: State) => void;
	} & ({ pageId: string } | { pageUrl: string }),
) {
	console.count('check');
	const { token, strict, audience, origin, publication } = arg;
	const setState = arg.setState;

	let query: PageQuery | undefined;
	if ('pageId' in arg && arg.pageId) {
		query = { type: 'id' as const, id: arg.pageId };
	} else if ('pageUrl' in arg && arg.pageUrl) {
		query = { type: 'url' as const, url: arg.pageUrl };
	}
	if (!query) {
		throw new Error('Either pageId or pageUrl must be provided');
	}

	setState({ type: 'unknown' });

	const { findPage, getPage, verifyToken, verifyTokenStrict } =
		withOrigin(origin);

	if (token) {
		if (strict) {
			try {
				const payload = await verifyTokenStrict({
					token,
					audience,
					query,
				});
				return setState(payloadToOkState(payload));
			} catch (error) {
				return setErrorState(error as Error, query);
			}
		} else {
			try {
				const payload = await verifyToken({ token, audience });
				return setState(payloadToOkState(payload));
			} catch (error) {
				return setErrorState(error as Error, query);
			}
		}
	} else {
		let page: PageInfo;
		try {
			const pageInfo =
				query.type === 'id'
					? await getPage(query.id)
					: await findPage({ url: query.url, publication });
			if (!pageInfo) {
				return setState({
					type: 'error',
					message: 'Page not found for given query',
					code: 'page:not-found/query',
				});
			}
			page = pageInfo;
		} catch (err) {
			return setState({
				type: 'error',
				message: (err as Error).message,
				code: 'page:fetch-failed',
			});
		}

		return setState({
			type: 'no-access',
			page,
		});
	}

	async function setErrorState(error: Error, query: PageQuery) {
		const state = errorToErrorState(error);
		if (state.code.startsWith('token:')) {
			state.page =
				query.type === 'id'
					? await getPage(query.id)
					: await findPage({ url: query.url, publication });
		}
		return setState(state);
	}
}
export const check = memoizeOne(_check);

function payloadToOkState(
	payload: TokenPayload,
): Extract<State, { type: 'ok' }> {
	const entitledPageId = payload.scope
		.find((e) => e.startsWith('content:'))
		?.replace('content:', '');
	return {
		type: 'ok',
		userId: payload.sub,
		pageId: entitledPageId || '',
		iat: new Date(payload.iat * 1000),
		exp: new Date(payload.exp * 1000),
	};
}

function errorToErrorState(error: Error): Extract<State, { type: 'error' }> {
	console.error(error);
	if (error.message.startsWith('page:') || error.message.startsWith('token:')) {
		let message = error.message;
		if (message === 'page:not-found/query') {
			message = 'Page not found for given query';
		} else if (message === 'page:not-found/publication') {
			message = 'Page not found for given publication';
		} else if (message === 'token:invalid') {
			message = 'Invalid token for given page';
		}
		return {
			type: 'error',
			message: message,
			code: error.message,
		};
	}

	if (/\bexp\b/i.test(error.message)) {
		return {
			type: 'error',
			message: error.message,
			code: 'token:expired',
		};
	}

	return {
		type: 'error',
		message: error.message,
		code: 'token:failed',
	};
}
