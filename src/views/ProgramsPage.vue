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
  <div class="w-full h-full">
    <!-- Content -->
    <div class="col md:surface-card border-round-xl p-2 sm:p-4 h-full">
      <div class="flex justify-content-between align-items-center pb-3 pt-2">
        <h2 class="text-xl ml-2 my-0">Mes programmes</h2>
        <Button
            icon="pi pi-plus"
            icon-pos="right"
            label="Nouveau"
            severity="success"
            @click="onCreateNewProgram"
        />
      </div>

      <div class="grid">
        <ProgramCard v-for="i in 8" :key="i" :program="{id: i}" class="col-12 sm:col-6 xl:col-4 p-2"/>
      </div>
    </div>

  </div>
</template>

<style scoped>

</style>