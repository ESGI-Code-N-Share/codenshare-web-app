<script lang="ts" setup>

import ProgramCard from "@/components/programs/ProgramCard.vue";
import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import {Program} from "@/models";
import {CodeNShareProgramApi} from "@/api/codenshare";

const router = useRouter();

const programs = ref<Program[]>([]);

onMounted(async () => {
  await fetchPrograms();
})

const onCreateNewProgram = async () => {
  try {
    const programId = await CodeNShareProgramApi.create();
    await router.push({name: 'program', params: {program: programId as string}});
  } catch (e) {
    console.error(e);
  }
}


const fetchPrograms = async () => {
  try {
    programs.value = await CodeNShareProgramApi.listByUser();
    console.log(programs.value)
  } catch (e) {
    console.error(e);
  }
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
    <div v-if="programs.length > 0" class="grid">
      <ProgramCard
          v-for="program in programs" :key="program.programId"
          :program="program"
          class="col-12 sm:col-6 xl:col-4"
          @on-deleted="fetchPrograms()"
      />
    </div>
    <div v-else class="surface-card p-4 border-round-xl">
      Vous n'avez pas encore de programme.
    </div>

  </div>
</template>

<style scoped>

</style>