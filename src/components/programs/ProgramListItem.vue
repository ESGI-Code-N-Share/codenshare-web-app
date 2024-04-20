<script lang="ts" setup>

interface ProgramListItemProps {
}

defineProps<ProgramListItemProps>();

</script>

<template>
  <div class="flex justify-content-between surface-card align-items-center border-round-2xl" style="padding: .75em;">
    <div class="flex align-items-center">
      <Avatar :image="'https://randomuser.me/api/portraits/men/9.jpg'"
              :pt="{image: {class: 'border-round-xl', style: 'object-fit: cover; min-height: 60px; min-width: 60px'}}" size="xlarge"/>
      <div class="ml-3">
        <h4 class="m-0">Un programme trop cool</h4>
        <div class="text-color-secondary text-sm mt-2">@ L. Corentin</div>
      </div>
    </div>
    <Button icon="pi pi-trash" severity="danger" text/>
  </div>
</template>

<style scoped>

</style>