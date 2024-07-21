<script lang="ts" setup>


import {ref} from "vue";

const url = defineModel('url', {type: String as () => string | null, required: false})
defineProps<{ type: string }>()
const emit = defineEmits(['onError', 'onDownload'])

const isError = ref(false)

function handleError() {
  isError.value = true
  emit('onError')
}
</script>

<template>
  <div
      :class="isError ? 'border-red-700 border-1' : 'border-gray-500 border-1'"
      class="drop-zone border-round p-2 text-center text-color-secondary h-auto"
      style="background-color: var(--gray-800);"
  >
    <div v-if="isError" class="flex flex-column gap-2 p-3">
      <i class="pi pi-exclamation-triangle text-6xl"/>
      <small class="text-color-secondary">{{ $t('program.output_files.error_image') }}</small>
    </div>
    <div v-else-if="type === 'text/plain' && url" class="flex flex-column gap-2 p-3">
      <i class="pi pi-upload text-6xl cursor-pointer" @click="$emit('onDownload')"/>
      <small class="text-color-secondary">{{ $t('program.output_files.download') }}</small>
    </div>
    <Image v-else-if="url" :src="url" alt="Image" preview width="250" @error="handleError()"/>
    <div v-else class="flex flex-column gap-1 p-2 justify-content-center align-items-center">
      <i class="pi pi-image text-6xl"/>
      <small class="text-color-secondary">{{ $t('program.output_files.title') }}</small>
    </div>
  </div>
</template>

<style scoped>

</style>