## `@monetized/widgets`

A set of custom elements to prompt your users to buy the premium content at Monetized, and for validating their entitlement tokens.

### `<monetized-link-riser>`

Adds a pop-under to:

1. Check if there's an entitlement token available set in page URL.
2. If it's set, ensure it's a valid token.
3. If token is invalid or doesn't exist, find the corresponding page at https://www.monetized.link and prompt user to get access there.

#### Usage

```html
<!doctype html>
<html lang="en">
	<head>
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<!-- You can use npm CDNs like unpkg to import the custom element -->
		<script
			type="module"
			src="https://unpkg.com/@monetized/widgets/monetized-link-riser.js"
		></script>
		<!-- Or, self-host it -->
		<script type="module" src="monetized-link-riser.js"></script>
	</head>
	<body>
		<p>Some content on your website</p>

		<!-- Add the riser widget  -->
		<monetized-link-riser></monetized-link-riser>
	</body>
</html>
```

#### Advanced Usage

You can use a custom name for this component too.

```html
<script type="module">
	import { MonetizedLinkRiser } from 'https://unpkg.com/@monetized/widgets/monetized-link-riser.js';
	customElements.define('some-custom-name', MonetizedLinkRiser);
</script>

<some-custom-name></some-custom-name>
```

Pass the `strict` attribute for strict checking - ensures the token corresponds to only the page monetized at https://www.monetized.link

```html
<monetized-link-riser strict></monetized-link-riser>
<!-- Note that this attribute doesn't expect any value. To unset, remove the attribute. -->
```

## `@monetized/api`

Use [Monetized](https://www.monetized.link/)'s public API to validate entitlement of tokens, and directing users to correct pages where they can buy your link.

```bash
npm install @monetized/api
```

### Available methods

```js
import {
	getPage,
	findPage,
	verifyToken,
	verifyTokenStrict,
} from '@monetized/api';
```

#### `getPage`

Get a page by page ID

```http
GET https://www.monetized.link/api/content/info/:pageId
```

#### `findPage`

Find a page by monetized URL

```http
GET https://www.monetized.link/api/content/find?q={monetizedPageUrl}&publication={optional-publication-id}
```

#### `verifyToken`

Check whether given token is valid. Validates corresponds to public key at [`.well-known/jwks.json`](https://www.monetized.link/.well-known/jwks.json).

#### `verifyTokenStrict`

Same as above, but also ensures the token corresponds to given URL/page-id.
