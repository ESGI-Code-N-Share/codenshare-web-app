<script lang="ts" setup>


const url = defineModel('url', {type: String as () => string | null, required: false})

const downloadFile = () => {
  // todo download file
}

</script>

<template>
  <div
      class="drop-zone border-gray-500 border-round p-3 text-center text-color-secondary h-auto"
      style="background-color: var(--gray-800);"
  >
    <img
        v-if="url"
        :class="`max-h-15rem`"
        :src="url"
        alt="image"
        class="w-full h-full cursor-pointer"
        style="object-fit: contain"/>
    <div v-else class="flex flex-column gap-1 justify-content-center align-items-center">
      <i class="pi pi-image text-6xl"/>
      <small class="text-color-secondary">{{ $t('program.output_files.title') }}</small>
    </div>
  </div>
</template>

<style scoped>

</style>