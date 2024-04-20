<script lang="ts" setup>

import {onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import Sidebar from "primevue/sidebar";
import {MenuItem} from "primevue/menuitem";
import ProgramListItem from "@/components/programs/ProgramListItem.vue";
import {VAceEditor} from 'vue3-ace-editor';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';

const route = useRoute();
const router = useRouter();

const program = ref({
  id: "1",
  language: 'javascript',
  name: '',
  description: '',
  share: false,
  code: '',
});

const sidebarProgramEditor = ref(false);
const sidebarProgramTest = ref(false);

const languages = ref([
  {label: 'Javascript', value: 'javascript'},
  {label: 'Python', value: 'python'},
]);

const editProgramOptions = ref<MenuItem[]>([
  {
    label: 'Options',
    items: [
      {
        label: 'Sauvegarder',
        icon: 'pi pi-save',
      },
      {
        label: 'Supprimer',
        icon: 'pi pi-trash'
      }
    ]
  }
]);

onMounted(() => {
  const programId = route.params.program as string;
  if (!programId) {
    return router.push({name: 'programs'});
  }

  // todo call api to get program details
})

</script>

<template>
  <div class="w-full h-full">
    <!-- Content -->
    <div class="flex flex-column gap-3 md:surface-card p-2 sm:p-4 h-full border-round-xl">
      <div class="flex justify-content-between align-items-center">
        <h2 class="text-xl ml-2 my-0">Edition</h2>
        <div class="flex gap-2">
          <Button icon="pi pi-play" icon-pos="right" label="Tester" severity="secondary" style="color: #49DE80"
                  @click="sidebarProgramTest = true"/>
          <Button icon="pi pi-pencil" severity="secondary" style="" @click="sidebarProgramEditor = true"/>
          <Menu ref="panelProgram" :model="editProgramOptions" popup/>
        </div>
      </div>
      <div class="h-full w-full">
        <VAceEditor
            v-model:value="program.code"
            lang="javascript"
            style="height: 10em; min-height: 100%;"
            theme="monokai"/>
      </div>
    </div>

    <!-- Sidebar Program   -->
    <Sidebar
        v-model:visible="sidebarProgramEditor"
        :pt="{header: 'border-bottom-1', content: 'pt-4'}"
        class="border-0"
        header="Configuration" modal position="right"
        style="min-width: 350px;"
    >
      <div class="flex flex-column gap-3">
        <!--  <InputFile class="h-5rem w-full" />-->
        <div>Image</div>
        <div class="border-2 border-dashed border-gray-500 border-round text-center p-4 text-color-secondary"
             style="background-color: #121212;">
          <i class="pi pi-download text-5xl mb-2"/>
          <div>Drag and drop a file</div>
        </div>

        <InputText v-model="program.name" placeholder="Nom du programme"/>
        <Textarea v-model="program.description" class="h-5rem w-full text-sm" cols="30" placeholder="Description"
                  rows="5"/>

        <Dropdown
            v-model="program.language"
            :options="languages"
            option-label="label"
            placeholder="Langage"
        />

        <div class="flex align-items-center">
          <InputSwitch id="share" v-model="program.share" binary class="mr-2"/>
          <label class="text-sm" for="share">{{ program.share ? 'Public' : 'Privé' }}</label>
        </div>

        <Button icon="pi pi-save" icon-pos="right" label="Sauvegarder" severity="success"/>
      </div>
    </Sidebar>

    <!-- Sidebar Test   -->
    <Sidebar
        v-model:visible="sidebarProgramTest"
        :pt="{header: 'border-bottom-1', content: 'pt-4'}"
        class="border-0 md:w-30rem" header="Test" modal position="right"
        style="min-width: 350px;"
    >
      <div class="flex flex-column align-items-stretch gap-3">
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

    </Sidebar>
  </div>
</template>

<style scoped>
</style>