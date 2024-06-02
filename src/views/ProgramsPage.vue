<script lang="ts" setup>

import ProgramCard from "@/components/programs/ProgramCard.vue";
import {useRouter} from "vue-router";

const router = useRouter();


function onCreateNewProgram() {
  // call api to create new program and return id
  const id = Math.random().toString(36).substring(7);
  router.push({name: 'program', params: {program: id}})
}
</script>

<template>
  <div class="col flex flex-column gap-4 p-2">
    <div class="flex justify-content-between align-items-center">
      <h2 class="p-0 m-0">Mes programmes</h2>
      <Button
          class="hidden md:flex"
          icon="pi pi-plus"
          icon-pos="right"
          label="Nouveau"
          severity="success"
          @click="onCreateNewProgram"
      />
      <Button
          class="flex md:hidden"
          icon="pi pi-plus"
          icon-pos="right"
          severity="success"
          @click="onCreateNewProgram"
      />
    </div>

    <!-- Content   -->
    <div class="grid">
      <ProgramCard v-for="i in 8" :key="i" :program="{id: i}" class="col-12 sm:col-6 xl:col-4"/>
    </div>

  </div>
</template>

<style scoped>

</style>