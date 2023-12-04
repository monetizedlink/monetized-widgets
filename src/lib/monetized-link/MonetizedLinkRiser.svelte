<script lang="ts">
	import MonetizedLinkBase from './MonetizedLinkBase.svelte';
	import Riser from '$lib/components/Riser.svelte';

	import { DEFAULT_ORIGIN } from '$lib/api.js';

	import type { State } from './check.js';

	export let pageId = '';
	export let pageUrl = '';
	export let publication = '';
	export let tokenParam = 'monetized_token';
	export let origin = DEFAULT_ORIGIN;
	export let strict = false;
	export let onStateChange = (state: State) => {};
	export let onFail = console.warn;
	export const getState = () => base.getState();
	let base: MonetizedLinkBase;
</script>

<MonetizedLinkBase
	bind:this={base}
	{pageId}
	{pageUrl}
	{publication}
	{tokenParam}
	{origin}
	{strict}
	{onStateChange}
	let:state
>
	<Riser {state} {onFail}></Riser>
</MonetizedLinkBase>
