<script lang="ts">
	import { fly } from '$lib/utils/transitions-fix.js';

	import type { PageInfo } from '$lib/check.js';

	export let page: PageInfo;
	export let url = page.url;

	let text = '';
	let ctaText = '';
</script>

<div class="main" transition:fly={{ x: 500, duration: 300 }}>
	<div class="top-bar" />
	<div class="wrapper">
		<div class="top">
			<h2>
				<span>Get access via Monetized</span>
				<span>{page.title}</span>
			</h2>
		</div>
		<div class="bottom">
			<div>
				<p class="text">{text}</p>
				<a href={url} class="get-access">Get access <span aria-hidden="true">&rarr;</span></a>
			</div>
			<div class="right">
				<span class="blob"></span>
				<span class="cta">{ctaText}</span>
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
	@tailwind base;

	:host {
		font-family: var(
			--font-family,
			"Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"
		);
		--bar-background: theme('colors.LAVENDER');
		--main-background: theme('colors.white');
		--text-1: theme('colors.gray.900');
		--text-2: theme('colors.BLUE.50');
		--blob-background: var(--text-2);
	}

	.main {
		@apply fixed bottom-2 left-2 right-2 p-4 w-full mx-auto;
		max-width: 90vw;
		max-width: min(95vw, 800px);
	}

	.top-bar {
		@apply bg-LAVENDER h-6 rounded-t-3xl;
		background-color: var(--bar-background);
		width: 95%;
	}
	.wrapper {
		@apply bg-white w-full relative cursor-pointer;
		@apply py-6 pl-6 md:py-10 md:pl-20;
		@apply rounded-3xl rounded-tl-none;
		@apply shadow-xl hover:shadow-2xl focus-within:shadow-2xl;
		background-color: var(--main-background);
	}
	.top {
		@apply pr-3;
	}
	.bottom {
		@apply w-full box-border flex gap-6 mt-2 justify-between;
	}
	.right {
		@apply self-stretch md:self-center flex-shrink-0;
		@apply max-w-max flex flex-col md:flex-row md:gap-3 items-center justify-center;
		@apply p-3 pl-6 md:p-5 xl:p-6;
		@apply text-white bg-BLUE-50;
		background-color: var(--blob-background);
		@apply rounded-l-3xl md:drop-shadow-lg md:-translate-y-1/2;
	}

	.top h2 {
		@apply font-extrabold xl:text-3xl md:text-2xl text-xl tracking-tight m-0 mb-1;
	}
	.top h2 span {
		@apply block leading-tight;
	}
	.top h2 span:nth-child(1) {
		@apply mb-0.5 text-gray-900;
		color: var(--text-1);
	}
	.top h2 span:nth-child(2) {
		@apply line-clamp-1 text-BLUE-50;
		color: var(--text-2);
	}

	.text {
		@apply max-w-prose m-0 line-clamp-3 sm:line-clamp-none;
		@apply text-gray-500 text-sm md:text-base lg:text-lg !leading-tight;
	}

	.get-access {
		@apply inline-block mt-1;
		@apply text-gray-900 text-sm md:text-base font-semibold underline;
		@apply after:absolute after:inset-0;
	}

	.right .blob {
		@apply h-6 md:h-8 bg-BLUE-50 block;
		background-color: var(--blob-background);
	}
	.right .cta {
		@apply max-w-xs text-xs md:text-sm xl:text-base;
	}
</style>
