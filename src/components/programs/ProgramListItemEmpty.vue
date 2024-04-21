<script lang="ts" setup>

</script>

<template>
  <div class="flex justify-content-between align-items-center border-round-2xl"
       style="background: #121212; padding: .75em;">
    <div class="flex align-items-center">
      <Avatar :pt="{image: 'border-round-xl'}" icon="pi pi-image" size="xlarge"/>
      <div class="ml-3">
        <h3 class="m-0">Sélectionner un programme</h3>
        <div class="text-color-secondary text-sm mt-2">@ ..</div>
      </div>
    </div>
    <Button icon="pi pi-plus" severity="secondary" text/>
  </div>
</template>

<style scoped>

</style>