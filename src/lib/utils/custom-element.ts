import type { OnFail, State } from '$lib/monetized-link/check.js';
import type { SvelteComponent } from 'svelte';

export type PropGetter = (
	value: string,
	el: HTMLElement,
) => { [prop: string]: unknown } | null;
export type PropMap = Record<
	string,
	{ getter: PropGetter; default: () => any }
>;

export function createCustomElement<T extends SvelteComponent>(
	propMap: PropMap,
	App: T,
) {
	// TODO: use a WeakMap
	let app: typeof App | null;
	let shadowRoot: ShadowRoot | null;
	const attributes = Object.keys(propMap);

	class MyComponent extends HTMLElement {
		static get observedAttributes() {
			return attributes;
		}

		constructor() {
			super();
			shadowRoot = this.attachShadow({ mode: 'closed' });
		}

		attributeChangedCallback(attr: string, oldValue: string, newValue: string) {
			if (!app) return;
			if (oldValue === newValue) return;

			const { getter, default: getDefault } = propMap[attr];
			const props = getter(newValue, this) ?? getter(getDefault(), this)!;
			app.$set(props);
		}

		connectedCallback() {
			const props = {};
			for (const attr of attributes) {
				const { getter, default: getDefault } = propMap[attr];
				if (this.hasAttribute(attr)) {
					const value = getter(this.getAttribute(attr)!, this);
					Object.assign(props, value ?? getter(getDefault(), this)!);
				} else {
					Object.assign(props, getter(getDefault(), this));
				}
			}
			Object.assign(props, {
				onStateChange: (state: State) => {
					this.dispatchEvent(
						new CustomEvent('statechange', { detail: state, bubbles: true }),
					);
				},
				onFail: (...args: Parameters<OnFail>) => {
					this.dispatchEvent(
						new CustomEvent('fail', { detail: args[1], bubbles: true }),
					);
				},
			});
			app = new App({ target: shadowRoot!, props });
		}

		disconnectedCallback() {
			app = null;
			shadowRoot = null;
		}

		get state() {
			return app!.getState() as State;
		}
	}

	return MyComponent;
}

export function ensureOneOf<T>(
	value: unknown,
	options: T[],
	elem: HTMLElement,
	attr: string,
	defaultValue: T,
): T {
	if (options.includes(value as T)) {
		return value as T;
	}

	const prefix = `<${elem.localName}>`;
	const opts = options.map((opt) => `"${opt}"`).join(', ');
	const msg = `Attribute "${attr}" must be one of: ${opts}.`;
	const info = `Defaulting to "${defaultValue}".`;
	console.warn(`${prefix}: ${msg} ${info}`);
	elem.setAttribute(attr, `${defaultValue}`);
	return defaultValue;
}
