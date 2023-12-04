<script lang="ts">
	import MonetizedLinkRiser from '$lib/monetized-link/MonetizedLinkRiser.svelte';
	import type { State } from '$lib/monetized-link/check.js';

	let state: State;
	const onStateChange: MonetizedLinkRiser['$$prop_def']['onStateChange'] = (newState) => {
		console.log(state, newState);
		state = newState;
	};
</script>

{#if state?.type === 'ok'}
	got access
{:else if state?.type && state.type !== 'unknown'}
	need access
{/if}
<pre class="overflow-auto">{JSON.stringify({ state }, null, 2)}</pre>

<div style="height: 200vh; background-color: antiquewhite;"></div>

<MonetizedLinkRiser
	origin="https://www.monetizedlink.local"
	pageUrl="http://localhost:5173/test/monetized-link/component"
	strict
	{onStateChange}
></MonetizedLinkRiser>
