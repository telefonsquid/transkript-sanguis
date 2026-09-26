import type { OnNavigate } from '$app/navigation';
import { flushSync } from 'svelte';
import { flip as baseFlip, type FlipParams } from 'svelte/animate';
import type { Attachment } from 'svelte/attachments';
import { backOut, cubicOut } from 'svelte/easing';
import { prefersReducedMotion } from 'svelte/motion';
import { fade as baseFade, fly as baseFly, slide as baseSlide, type FadeParams, type FlyParams, type SlideParams, type TransitionConfig } from 'svelte/transition';
import { prefs } from './prefs.svelte';

/** Animations play unless the system or the app setting asks for less motion */
export const motion = {
	get reduced() {
		return prefs.reduceMotion || prefersReducedMotion.current;
	}
};

const still = { duration: 0 };

// Svelte transitions run as web animations, so the CSS switch in layout.css cannot stop them
export const fade = (node: Element, p?: FadeParams): TransitionConfig => (motion.reduced ? still : baseFade(node, { duration: 140, ...p }));
export const fly = (node: Element, p?: FlyParams): TransitionConfig => (motion.reduced ? still : baseFly(node, { duration: 260, easing: cubicOut, ...p }));
export const slide = (node: Element, p?: SlideParams): TransitionConfig => (motion.reduced ? still : baseSlide(node, { duration: 220, easing: cubicOut, ...p }));
export const flip = (node: Element, move: { from: DOMRect; to: DOMRect }, p?: FlipParams) =>
	motion.reduced ? still : baseFlip(node, move, { duration: 320, easing: cubicOut, ...p });

/** Menus and dialogs grow out of where they are anchored, with a little overshoot */
export function pop(_node: Element, { y = -6, from = 0.95, duration = 200 } = {}): TransitionConfig {
	if (motion.reduced) return still;
	return {
		duration,
		easing: backOut,
		css: (t, u) => `opacity: ${Math.min(1, t * 1.8)}; transform: translateY(${u * y}px) scale(${from + (1 - from) * t})`
	};
}

let running: ViewTransition | null = null;

/** Runs a change as a view transition, kind picks its animation in layout.css */
function transition(kind: string, update: () => void | Promise<void>): ViewTransition | null {
	if (motion.reduced || !document.startViewTransition) {
		update();
		return null;
	}
	const root = document.documentElement;
	root.dataset.vt = kind;
	const vt = document.startViewTransition(update);
	running = vt;
	const end = () => {
		if (running !== vt) return;
		delete root.dataset.vt;
		running = null;
	};
	vt.finished.then(end, end);
	return vt;
}

/** Cross fades the page content while state changes, for view tabs and profile switches */
export function morph(update: () => void) {
	transition('page', () => flushSync(update));
}

/** Whole page changes at once, the theme spreads out from where it was picked */
export function repaint(update: () => void, kind: 'theme' | 'lang', from?: { x: number; y: number }) {
	const root = document.documentElement;
	root.style.setProperty('--vt-x', `${from?.x ?? innerWidth / 2}px`);
	root.style.setProperty('--vt-y', `${from?.y ?? 0}px`);
	transition(kind, () => flushSync(update));
}

const hero = (id: string) => document.querySelector<HTMLElement>(`[data-hero="${CSS.escape(id)}"]`);

/** Page navigation as a view transition, a card and the focus chart of the same value morph into each other */
export function navigate(nav: OnNavigate) {
	if (motion.reduced || !document.startViewTransition || !nav.to || nav.from?.url.pathname === nav.to.url.pathname) return;
	const id = nav.to.route.id === '/analyte/[id]' ? nav.to.params?.id : nav.from?.params?.id;

	// The old snapshot is taken before the update runs, so the old element is named up front
	const old = id ? hero(id) : null;
	old?.style.setProperty('view-transition-name', 'hero');

	return new Promise<void>((ready) => {
		const vt = transition('page', async () => {
			ready();
			await nav.complete;
			old?.style.removeProperty('view-transition-name');
			if (old && id) hero(id)?.style.setProperty('view-transition-name', 'hero');
		});
		const clear = () => id && hero(id)?.style.removeProperty('view-transition-name');
		vt?.finished.then(clear, clear);
	});
}

/** Slides a pill under whichever child matches the selector, for tabs and segmented controls */
export function glide(selector: string): Attachment<HTMLElement> {
	return (box) => {
		const pill = box.querySelector<HTMLElement>(':scope > [data-pill]');
		if (!pill) return;

		const place = () => {
			const on = box.querySelector<HTMLElement>(selector);
			pill.style.opacity = on ? '1' : '0';
			if (!on) return;
			pill.style.width = `${on.offsetWidth}px`;
			pill.style.transform = `translateX(${on.offsetLeft}px)`;
		};

		// First placement jumps, later ones glide
		place();
		const ready = requestAnimationFrame(() => (pill.dataset.ready = ''));

		const watch = new MutationObserver(place);
		watch.observe(box, { subtree: true, attributes: true, attributeFilter: ['aria-checked', 'aria-current'], childList: true });
		const resize = new ResizeObserver(place);
		resize.observe(box);
		return () => {
			cancelAnimationFrame(ready);
			watch.disconnect();
			resize.disconnect();
		};
	};
}
