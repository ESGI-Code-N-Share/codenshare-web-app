<script lang="ts" setup>

import ProgramListItem from "@/components/programs/ProgramListItem.vue";
</script>

<template>
  <div class="flex gap-3 w-full h-full">
    <!-- Content -->
    <div class="col md:surface-card border-round-xl p-2 sm:p-4 h-full">
      <h2 class="text-xl ml-2 mt-0">Playground</h2>
      <div class="flex flex-column align-items-stretch gap-3 p-2">
        <!--        <InputFile class="h-5rem w-full"/>-->
        <div class="border-2 border-dashed border-gray-500 border-round text-center p-4 text-color-secondary"
             style="background-color: #121212;">
          <i class="pi pi-download text-5xl mb-2"/>
          <div>Drag and drop a file</div>
        </div>

        <div class="text-center">
          <i class="pi pi-chevron-down text-3xl gradient-text-primary"/>
        </div>

        <ProgramListItem/>
        <Button
            v-tooltip.bottom="'Unavailable for now'"
            class="text-color-secondary"
            icon="pi pi-plus"
            icon-pos="right"
            label="Ajouter un autre programme"
            severity="secondary"
        />
        <!--        <ProgramListItemEmpty />-->


        <div class="text-center">
          <i class="pi pi-equals text-3xl gradient-text-primary"/>
        </div>

        <div class="border-2 border-dashed border-gray-500 border-round text-center p-4 text-color-secondary"
             style="background-color: #121212;">
          <i class="pi pi-image text-6xl"/>
        </div>

        <Button
            class="text-center justify-content-center mt-2"
            severity="secondary"
            style="color: #49DE80; background: linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%), #27272A;"
        >
          <div>Exécuter</div>
          <i class="pi pi-play px-2"></i>
        </Button>
      </div>
    </div>


    <!-- Right Content -->
    <div class="hidden lg:block lg:col-5 xl:col-4 surface-card border-round-xl p-4">
      <h3 class="text-lg ml-2 mt-0">Programme populaire</h3>

      <div class="flex flex-column gap-2">
        <div v-for="i in 5" class="flex justify-content-between align-items-center p-2 border-round-lg"
             style="background-color: #121212;">
          <div class="flex align-items-center">
            <Avatar :image="'https://randomuser.me/api/portraits/men/9.jpg'" shape="circle" size="large"/>
            <div class="ml-2">
              <div>Program cool</div>
              <div class="text-color-secondary text-sm">@ D. Elena</div>
            </div>
          </div>
          <Button aria-label="add-friend" icon="pi pi-download" severity="secondary"/>
        </div>
      </div>

      <Divider class="my-4"/>

    </div>
  </div>
</template>

<style scoped>

</style>