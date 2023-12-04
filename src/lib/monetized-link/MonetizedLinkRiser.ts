import { DEFAULT_ORIGIN } from '$lib/api.js';
import { createCustomElement } from '$lib/utils/custom-element.js';
import MonetizedLinkRiserSvelte from './MonetizedLinkRiser.svelte';

export const MonetizedLinkRiser = createCustomElement(
	{
		'page-id': {
			getter: (val) => (val ? { pageId: val || '' } : null),
			default: () => '',
		},
		'page-url': {
			getter: (val) => (val ? { pageUrl: val } : null),
			default: () => window.location.href,
		},
		origin: {
			getter: (val) => (val ? { origin: val } : null),
			default: () => DEFAULT_ORIGIN,
		},
		strict: {
			getter: (val, el) => ({ strict: el.hasAttribute('strict') }),
			default: () => false,
		},
	},
	MonetizedLinkRiserSvelte,
);
