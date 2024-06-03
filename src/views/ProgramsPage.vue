<script lang="ts" setup>

import ProgramCard from "@/components/programs/ProgramCard.vue";
import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import {Program} from "@/models";
import {CodeNShareProgramApi} from "@/api/codenshare";

const router = useRouter();

const programs = ref<Program[]>([]);
const loading = ref({create: false, fetch: false})

onMounted(async () => {
  await fetchPrograms();
})

const onCreateNewProgram = async () => {
  try {
    loading.value.create = true;
    const programId = await CodeNShareProgramApi.create();
    await router.push({name: 'program', params: {program: programId as string}});
  } catch (e) {
    console.error(e);
  } finally {
    loading.value.create = false;
  }
}


const fetchPrograms = async () => {
  try {
    loading.value.fetch = true;
    programs.value = await CodeNShareProgramApi.listByUser();
    console.log(programs.value)
  } catch (e) {
    console.error(e);
  } finally {
    loading.value.fetch = false;
  }
}

</script>

<template>
  <div class="col flex flex-column gap-4 p-2">
    <div class="flex justify-content-between align-items-center">
      <h2 class="p-0 m-0">Mes programmes</h2>
      <Button
          :loading="loading.create"
          class="hidden md:flex"
          icon="pi pi-plus"
          icon-pos="right"
          label="Nouveau"
          severity="success"
          @click="onCreateNewProgram"
      />
      <Button
          :loading="loading.create"
          class="flex md:hidden"
          icon="pi pi-plus"
          icon-pos="right"
          severity="success"
          @click="onCreateNewProgram"
      />
    </div>

    <!-- Content   -->
    <div v-if="loading.fetch" class="flex justify-content-center align-items-center h-full">
      <ProgressSpinner/>
    </div>
    <div v-else-if="programs.length > 0" class="grid">
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