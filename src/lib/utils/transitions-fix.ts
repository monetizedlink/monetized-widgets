// fix webcomponents + svelte transitions
// https://github.com/sveltejs/svelte/issues/4735#issuecomment-703129877
import * as transitions from 'svelte/transition';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TransitionFn = (node: Element, params: any) => any;

export default function fix<T extends TransitionFn>(transition: T) {
	return (node: Parameters<T>[0], params: Parameters<T>[1]): ReturnType<T> => {
		if ('ownerDocument' in node && Object.hasOwn(node, 'ownerDocument')) {
			const root = node.getRootNode();
			const ownerDocument = root instanceof ShadowRoot ? { head: root } : root;
			Object.defineProperty(node, 'ownerDocument', { value: ownerDocument });
		}
		return transition(node, params);
	};
}

export const fade = fix(transitions.fade);
export const fly = fix(transitions.fly);
// add more as needed
