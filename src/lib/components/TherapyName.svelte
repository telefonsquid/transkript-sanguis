<script lang="ts" module>
	/** Flag pink and blue for the two kinds of HRT */
	export const TINT = { feminizing: 'text-fem-ink', masculinizing: 'text-masc-ink', none: '' };
</script>

<script lang="ts">
	import type { Therapy } from '../data/types';
	import { t } from '../i18n';

	let { therapy, short = false }: { therapy: Therapy; short?: boolean } = $props();
</script>

<span class={TINT[therapy]}>{(short ? t.profile.therapyShort : t.profile.therapies)[therapy]}</span>
