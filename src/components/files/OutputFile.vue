<script lang="ts" setup>


defineProps<{ file?: { id: string } }>();


const downloadFile = () => {
  // todo download file
}

</script>

<template>
  <div
      class="drop-zone border-dashed border-gray-500 border-round p-3 text-center text-color-secondary cursor-pointer h-auto"
      style="background-color: var(--gray-800);"
  >
    <div v-if="!file" class="flex flex-column gap-1 justify-content-center align-items-center">
      <i class="pi pi-image text-6xl"/>
      <small class="text-color-secondary">Votre fichier s'affichera ici</small>
    </div>
    <div v-else class="flex justify-content-between">
      <div class="flex gap-1 md:gap-3 align-items-center">
        <i class="pi pi-image text-6xl"/>
        <div>Télécharger le fichier</div>
      </div>
      <Button v-if="file?.id" icon="pi pi-download" severity="secondary" size="large" @click="downloadFile()"/>
    </div>
  </div>
</template>

<style scoped>

</style>