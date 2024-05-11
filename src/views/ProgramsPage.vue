<script lang="ts" setup>

import ProgramCard from "@/components/programs/ProgramCard.vue";
import {useRouter} from "vue-router";
import {CodeNShareApi} from "@/api/codenshare.api";
import {onMounted, ref} from "vue";

const router = useRouter();
const programApi = new CodeNShareApi().program;

const loading = ref({create: false, list: true});

const programs = ref<{ programId: string }[]>([]);

onMounted(async () => {
  const response = await programApi.list();
  programs.value = response.data;
  loading.value.list = false;
})


async function onCreateNewProgram() {
  loading.value.create = true;
  const program = await programApi.create();
  await router.push({name: 'program', params: {program: program.programId}})
}
</script>

<template>
  <div class="w-full h-full">
    <!-- Content -->
    <div class="col md:surface-card border-round-xl p-2 sm:p-4 h-full">
      <div class="flex justify-content-between align-items-center pb-3 pt-2">
        <h2 class="text-xl ml-2 my-0">Mes programmes</h2>
        <Button
            :loading="loading.create"
            icon="pi pi-plus"
            icon-pos="right"
            label="Nouveau"
            severity="success"
            @click="onCreateNewProgram"
        />
      </div>

      <!-- Loading    -->
      <div v-if="loading.list" class="grid">
        <div v-for="i in 12" class="col-12 sm:col-6 xl:col-4 p-2" style="background-color: #121212">
          <!-- Replace image with Skeleton -->
          <Skeleton class="border-round-xl" height="125px" width="100%"/>

          <div class="flex justify-content-between align-items-center mt-2">
            <!-- Replace small label with Skeleton -->
            <Skeleton height="1em" width="70px"/>
            <Button
                aria-controls="overlay_edit_program"
                aria-haspopup="true"
                disabled
                icon="pi pi-ellipsis-v"
                iconPos="right"
                severity="contrast"
                text
            />
          </div>

          <!-- Replace headings and text with Skeletons -->
          <Skeleton height="1.5em" width="60%"/>
          <Skeleton height="1em" width="90%"/>
        </div>
      </div>

      <div v-if="programs.length > 0" class="grid">
        <ProgramCard v-for="program in programs" :key="program.programId" :program
                     class="col-12 sm:col-6 xl:col-4 p-2"
                     @on-deleted="programs = programs.filter(p => p.programId !== program.programId)"/>
      </div>
      <div v-else>
        <div class="flex justify-content-center align-items-center h-full">
          <p class="text-center">Vous n'avez pas de programme</p>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>

</style>