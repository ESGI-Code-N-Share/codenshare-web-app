<script lang="ts" setup>

import ProgramCard from "@/components/programs/ProgramCard.vue";
import {useRouter} from "vue-router";
import {computed, onMounted, ref} from "vue";
import {ProgramsRequest} from "@/models";
import {CodeNShareProgramApi} from "@/api/codenshare";
import {ToastService} from "@/services/toast.service";
import {useToast} from "primevue/usetoast";
import {useUserStore} from "@/stores/user.store";
import dayjs from "dayjs/esm/index.js";
import ProgramListItem from "@/components/programs/ProgramListItem.vue";

const userStore = useUserStore();
const currentUser = userStore.currentUser;
const router = useRouter();
const toastNotifications = new ToastService(useToast());

const programs = ref<ProgramsRequest[]>([]);
const loading = ref({create: false, fetch: false})

const view = ref<'grid' | 'list'>('list');
const viewOptions = [
  {id: 'grid', icon: 'pi pi-th-large'},
  {id: 'list', icon: 'pi pi-list'}
]

const programOwner = ref<'all' | 'mine'>('all');
const programOwners = [
  {id: 'all', name: 'Tous'}, //todo translate
  {id: 'mine', name: 'Les miens'}
]

const orderBy = ref<'desc' | 'asc'>('desc');
const search = ref('');
const languages = ref<string[]>(['java', 'javascript', 'unset']);

const programFiltered = computed(() => {
  console.log(orderBy.value, programOwner.value)
  const filterByOwner = (p: ProgramsRequest) => programOwner.value === 'all' || p.originalAuthorId === currentUser?.userId;
  const sortByCreatedAt = (a: ProgramsRequest, b: ProgramsRequest) => orderBy.value === 'desc' ? dayjs(b.createdAt).diff(a.createdAt) : dayjs(a.createdAt).diff(b.createdAt)
  const filterBySearch = (p: ProgramsRequest) => search.value === '' || p.name.toLowerCase().includes(search.value.toLowerCase());
  const filterByLanguage = (p: ProgramsRequest) => languages.value.includes(p.language) || (p.language === '' && languages.value.includes('unset'));

  return programs.value.slice()
      .filter(filterBySearch)
      .filter(filterByOwner)
      .filter(filterByLanguage)
      .sort(sortByCreatedAt);
})

onMounted(async () => {
  await fetchPrograms();
})

const onCreateNewProgram = async () => {
  try {
    loading.value.create = true;
    const programId = await CodeNShareProgramApi.create();
    toastNotifications.showSuccess("Programme créé avec succès");
    await router.push({name: 'program', params: {program: programId as string}});
  } catch (e) {
    console.error(e);
    toastNotifications.showError("Une erreur s'est produite lors de la création du programme");
  } finally {
    loading.value.create = false;
  }
}


const fetchPrograms = async () => {
  try {
    loading.value.fetch = true;
    programs.value = await CodeNShareProgramApi.listByUser();
  } catch (e) {
    console.error(e);
    toastNotifications.showError("Une erreur s'est produite lors du chargement des programmes");
  } finally {
    loading.value.fetch = false;
  }
}

const deleteProgram = async (program: ProgramsRequest) => {
  try {
    await CodeNShareProgramApi.delete(program.programId);
    toastNotifications.showSuccess('Programme supprimé');
    programs.value = programs.value.filter(p => p.programId !== program.programId);
  } catch (e) {
    console.error(e);
    toastNotifications.showError("Une erreur s'est produite lors de la suppression du programme");
  }
}

</script>

<template>
  <div class="col flex flex-column gap-3 p-2">
    <!-- Title and new   -->
    <div class="flex justify-content-between align-items-center">
      <h2 class="p-0 m-0">{{ $t('global.pages.programs') }}</h2>
      <Button
          :label="$t('program.buttons.new')"
          :loading="loading.create"
          class="hidden md:flex"
          icon="pi pi-plus"
          icon-pos="right"
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

    <!-- Filter owner and view   -->
    <div class="flex justify-content-between align-items-center gap-4">
      <Dropdown
          v-model="programOwner"
          :options="programOwners"
          option-label="name"
          option-value="id"
      />
      <SelectButton v-model="view" :options="viewOptions" option-value="id">
        <template #option="slotProps">
          <i :class="slotProps.option.icon"></i>
        </template>
      </SelectButton>
    </div>

    <!-- Filter by language and sort   -->
    <div class="flex justify-content-between align-items-center">
      <div class="flex gap-2">
        <Chip
            v-for="language in languages"
            :key="language"
            :label="$t(`program.languages.${language}`)"
            class="cursor-pointer capitalize"
            removable
            style="background: #09090B;"
            @remove="languages = languages.filter(l => l !== language)"
        />
        <Chip
            :class="languages.length >= 3 ? 'opacity-50' : 'cursor-pointer text-primary'"
            :label="$t('global.reset')"
            class=""
            style="background: #09090B;"
            @click="languages.length >= 3 ? '' : languages = ['java', 'javascript', 'unset']"
        />
      </div>
      <Chip
          :label="$t('global.sort')"
          class="cursor-pointer"
          icon="pi pi-sort"
          style="background: #09090B; justify-self: end"
          @click="orderBy = orderBy === 'desc' ? 'asc' : 'desc'"
      />
    </div>

    <!-- Content   -->
    <div v-if="loading.fetch" class="flex justify-content-center align-items-center h-full">
      <ProgressSpinner/>
    </div>
    <div v-else-if="programs.length === 0" class="surface-card p-4 border-round-xl">
      {{ $t('program.no_programs') }}
    </div>

    <!-- Views   -->
    <div v-if="view === 'grid' && programs.length > 0" class="grid">
      <ProgramCard
          v-for="program in programFiltered" :key="program.programId"
          :program="program"
          class="col-12 sm:col-6 xl:col-4"
          @on-deleted="fetchPrograms()"
      />
    </div>
    <div v-if="view === 'list' && programs.length > 0" class="flex flex-column border-round-xl overflow-hidden">
      <ProgramListItem
          v-for="(program, index) in programFiltered"
          :key="index"
          :class="{ 'border-bottom-1': program !== programFiltered[programFiltered.length - 1] }"
          :program="program"
          class="border-gray-800"
          clickable
          deletable
          noRound
          style="background: #09090B;"
          @on-click="$router.push({name: 'program', params: {program: program.programId}})"
          @on-delete="deleteProgram(program)"
      />
    </div>


  </div>
</template>

<style scoped>

</style>