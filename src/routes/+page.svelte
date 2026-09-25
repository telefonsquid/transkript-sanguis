<script lang="ts">
	import Compare from '#lib/components/Compare.svelte';
	import DataTable from '#lib/components/DataTable.svelte';
	import Grid from '#lib/components/Grid.svelte';
	import Matrix from '#lib/components/Matrix.svelte';
	import { settings } from '#lib/state.svelte.js';
</script>

{#if settings.view === 'compare'}
	<Compare />
{:else if settings.view === 'matrix'}
	<Matrix />
{:else if settings.view === 'table'}
	<DataTable />
{:else}
	<Grid />
{/if}
