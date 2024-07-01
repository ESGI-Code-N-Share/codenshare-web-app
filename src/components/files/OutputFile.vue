<script lang="ts" setup>


import {ref, watch} from "vue";

const props = defineProps<{ file?: File | null }>();

const url = ref('')

//watch the file
watch(() => props.file, (file) => {
  if (file) {
    url.value = URL.createObjectURL(file);
  }
})

const downloadFile = () => {
  // todo download file
}

</script>

<template>
  <div
      class="drop-zone border-gray-500 border-round p-3 text-center text-color-secondary cursor-pointer h-auto"
      style="background-color: var(--gray-800);"
  >
    <img v-if="url" :class="`max-h-15rem`" :src="url" alt="image"
         class="w-full h-full"
         style="object-fit: contain"/>
    <div v-else-if="!file" class="flex flex-column gap-1 justify-content-center align-items-center">
      <i class="pi pi-image text-6xl"/>
      <small class="text-color-secondary">{{ $t('program.output_files.title') }}</small>
    </div>
    <div v-else class="flex justify-content-between">
      <div class="flex gap-1 md:gap-3 align-items-center">
        <i class="pi pi-image text-6xl"/>
        <div>{{ $t('program.output_files.download') }}</div>
      </div>
      <Button v-if="file" icon="pi pi-download" severity="secondary" size="large" @click="downloadFile()"/>
    </div>
  </div>
</template>

<style scoped>

</style>