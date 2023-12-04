<script lang="ts">
	import HiddenOnScroll from '$lib/utils/HiddenOnScroll.svelte';
	import RiserBase from './RiserBase.svelte';

	import type { OnFail, State } from '$lib/monetized-link/check.js';

	export let state: State;
	export let onFail: OnFail;

	$: if (state.type === 'no-access' || state.type === 'error') {
		if (!state.page) {
			let details;
			if (state.type === 'error') {
				details = { code: state.code, message: state.message };
			}
			onFail('fatal', details);
		}
	}
</script>

{#if state.type === 'no-access' || state.type === 'error'}
	{#if state.page}
		<HiddenOnScroll>
			<RiserBase page={state.page} />
		</HiddenOnScroll>
	{:else}
		<!-- no access and no away to get access?! -->
	{/if}
{/if}
