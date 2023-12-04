<script lang="ts">
	import { onMount, beforeUpdate } from 'svelte';
	import { DEFAULT_ORIGIN } from '$lib/api.js';
	import { check, type State } from './check.js';

	export let pageId = '';
	export let pageUrl = '';
	export let publication = '';
	export let tokenParam = 'monetized_token';
	export let origin = DEFAULT_ORIGIN;
	export let strict = false;
	export let onStateChange = (state: State) => {};

	let state: State;
	setState({ type: 'unknown' });

	export function getState() {
		return structuredClone(state);
	}

	function setState(newState: State) {
		state = newState;
		onStateChange(newState);
	}

	onMount(() => {
		handle();
	});

	beforeUpdate(() => {
		handle();
	});

	async function handle() {
		if (typeof location === 'undefined') return;

		const url = new URL(location.href);
		const audience = url.hostname;
		const token = url.searchParams.get(tokenParam);

		await check({
			token,
			audience,
			pageId,
			pageUrl,
			publication,
			origin,
			strict,
			setState,
		});
	}
</script>

<slot {state} />
