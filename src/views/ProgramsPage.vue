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
  <div class="w-full">
    <div class="flex justify-content-between align-items-center mt-2 mb-4">
      <h2 class="text-2xl m-0">Mes programmes</h2>
      <Button
          icon="pi pi-plus"
          icon-pos="right"
          label="Nouveau"
          severity="success"
          size="small"
          type="button"
          @click="onCreateNewProgram()"
      />
    </div>
    <div class="grid">
      <ProgramCard v-for="i in 10" :key="i" :program="{id: i}" class="col-12 sm:col-6 p-1"/>
    </div>
  </div>
</template>

<style scoped>

</style>