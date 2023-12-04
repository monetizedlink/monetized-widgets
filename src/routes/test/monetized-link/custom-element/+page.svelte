<script lang="ts">
	import { onMount } from 'svelte';

	import type { State } from '$lib/monetized-link/check.js';

	let state: State;
	const onStateChange = (newState: State): void => {
		console.log('from addEventListener', state, newState);
		state = newState;
	};

	let elem: HTMLElement;
	onMount(() => {
		import('$lib/monetized-link/monetized-link-riser.js');
		customElements.whenDefined('monetized-link-riser').then(() => {
			elem.addEventListener('statechange', (event: CustomEvent<State>) => {
				onStateChange(event.detail as State);
			});
			elem.addEventListener('fail', (ev: CustomEvent<any>) => {
				console.table(ev.detail[1]);
			});
		});
	});
</script>

{#if state?.type === 'ok'}
	got access
{:else if state?.type && state.type !== 'unknown'}
	need access
{/if}
<pre style:overflow="auto">{JSON.stringify({ state }, null, 2)}</pre>

<div style="height: 200vh; background-color: antiquewhite;"></div>

<monetized-link-riser
	bind:this={elem}
	page-url="http://localhost:5173/test/monetized-link/component"
	origin="https://www.monetizedlink.local"
></monetized-link-riser>
