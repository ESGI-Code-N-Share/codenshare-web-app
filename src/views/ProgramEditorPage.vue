<script lang="ts" setup>

import {onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {VAceEditor} from 'vue3-ace-editor';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';
import ProgramListItem from "@/components/programs/ProgramListItem.vue";
import OutputFile from "@/components/files/OutputFile.vue";
import InputFile from "@/components/files/InputFile.vue";

const route = useRoute();
const router = useRouter();

const program = ref({
  id: "1",
  language: 'java',
  name: '',
  description: '',
  share: false,
  code: '',
  image: '',
  version: '',
});
const version = ref('');

const sidebarProgramEditor = ref(false);
const sidebarProgramTest = ref(false);

const languages = ref([
  {label: 'Javascript', value: 'javascript'},
  {label: 'Python', value: 'python'},
]);
const versions = ref<{ label: string, value: string }[]>([
  {label: 'Java 8', value: '8'},
  {label: 'Java 11', value: '11'},
  {label: 'Java 15', value: '15'},
]);

const editProgramOptions = ref<any[]>([
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
  <div class="col flex flex-column gap-4 p-2">
    <div class="flex justify-content-between align-items-center">
      <Button icon="pi pi-arrow-left" severity="secondary" @click="router.back()"/>
      <h2 class="p-0 m-0">Edition</h2>
      <div class="flex gap-2">
        <Button severity="secondary" style="color: #49DE80;" @click="sidebarProgramTest = true">
          <span class="hidden sm:block mr-2">Tester</span>
          <svg height="14" viewBox="0 0 384 512" width="10.5" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"
                fill="#49de80"/>
          </svg>
        </Button>
        <Button icon="pi pi-pencil" severity="secondary" style="" @click="sidebarProgramEditor = true"/>
      </div>
    </div>

    <div class="h-full">
      <VAceEditor
          v-model:value="program.code"
          lang="javascript"
          style="height: 10em; min-height: 100%;"
          theme="monokai"/>
    </div>

    <!-- Sidebar Program   -->
    <SideBar
        v-model:visible="sidebarProgramEditor"
        :pt="{header: 'border-bottom-1 border-gray-700', content: 'pt-4'}"
        blockScroll
        class="border-0 "
        header="Configuration" modal position="right"
        style="min-width: 350px;"
    >
      <div class="flex flex-column gap-3">
        <div>Image</div>
        <InputFile accept="image/*" @onFileSelected="program.image = $event.fileUrl"/>

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
    </SideBar>

    <!-- Sidebar Test   -->
    <SideBar
        v-model:visible="sidebarProgramTest"
        :pt="{header: 'border-bottom-1 border-gray-700', content: 'pt-4'}"
        blockScroll
        class="border-0 md:w-30rem" header="Test" modal position="right"
        style="min-width: 350px;"
    >
      <div class="flex flex-column align-items-stretch gap-3">
        <InputFile accept="image/*" @onFileSelected="program.image = $event.fileUrl"/>

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

        <OutputFile/>

        <Button
            class="text-center justify-content-center mt-2"
            severity="secondary"
            style="color: #49DE80; background: linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%), #27272A;"
        >
          <div>Exécuter</div>
          <i class="pi pi-play px-2"></i>
        </Button>
      </div>

      <!-- Divider     -->
      <div class="flex justify-content-center py-4">
        <Divider class="m-0" style="width: 75%;" type="dashed"/>
      </div>

      <!-- Console     -->
      <div class="flex flex-column gap-2">
        <h3 class="text-lg m-0 p-0">Console</h3>
        <code>Error: Cannot convert undefined or null to object</code>
      </div>

    </SideBar>
  </div>

</template>

<style scoped>
</style>