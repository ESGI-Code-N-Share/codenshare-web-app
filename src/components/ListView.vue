<script lang="ts" setup>

import DataView from "primevue/dataview";

const props = withDefaults(defineProps<{ items: any[], paginator?: number }>(), {
  paginator: 10
});
const emit = defineEmits();

</script>

<template>
  <DataView :paginator="!!paginator"
            :pt="{content: 'border-round-xl overflow-hidden', root: 'border-round-xl overflow-hidden'}"
            :rows="paginator" :value="items" data-key="id" layout="list">
    <template #list="slotProps">
      <div
          v-for="(item, index) in slotProps.items"
          :key="index"
          :class="{ 'border-top-1 surface-border': index !== 0 }"
          class="flex flex-column sm:flex-row sm:align-items-center gap-3 mx-2"
      >
        <slot :item="item" name="default"></slot>
      </div>
    </template>
  </DataView>
</template>

<style scoped>

</style>