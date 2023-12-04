// This should be imported only in browser env

import { MonetizedLinkRiser } from './MonetizedLinkRiser.js';

if (!customElements.get('monetized-link-riser')) {
	customElements.whenDefined('monetized-link-riser').then(() => {
		console.log('monetized-link-riser defined');
	});
	customElements.define('monetized-link-riser', MonetizedLinkRiser);
}
