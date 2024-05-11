<script lang="ts" setup>

import {onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import Sidebar from "primevue/sidebar";
import ProgramListItem from "@/components/programs/ProgramListItem.vue";
import {VAceEditor} from 'vue3-ace-editor';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';
import InputFile from "@/components/files/InputFile.vue";
import OutputFile from "@/components/files/OutputFile.vue";
import {CodeNShareApi} from "@/api/codenshare.api";

interface MenuItem {
  /**
   * Property name or getter function to use as the label of an item.
   */
  label?: string | ((...args: any) => string) | undefined;
  /**
   * Icon of the item.
   */
  icon?: string | undefined;
  /**
   * Callback to execute when item is clicked.
   * @param {MenuItemCommandEvent} event - Custom command event.
   * @todo next release should be able to change
   */
  command?: (event: Event) => void;
  /**
   * External link to navigate when item is clicked.
   */
  url?: string | undefined;
  /**
   *  An array of children menuitems.
   */
  items?: MenuItem[] | undefined;
  /**
   * A boolean or a function to return a boolean to specify if the item is disabled.
   * @defaultValue false
   */
  disabled?: boolean | ((...args: any) => boolean) | undefined;
  /**
   * A boolean or a function to return a boolean to specify if the item is visible.
   * @defaultValue true
   */
  visible?: boolean | ((...args: any) => boolean) | undefined;
  /**
   * Specifies where to open the linked document.
   */
  target?: string | undefined;
  /**
   * Defines the item as a separator.
   * @defaultValue false
   */
  separator?: boolean | undefined;
  /**
   * Inline style of the menuitem.
   */
  style?: any;
  /**
   * Style class of the menuitem.
   */
  class?: any;
  /**
   * Unique identifier of an item.
   */
  key?: string | undefined;

  /**
   * Optional
   */
  [key: string]: any;
}

const route = useRoute();
const router = useRouter();

const programApi = new CodeNShareApi().program;
const loading = ref({update: false, find: true, delete: false});
const iconSaveProgram = ref('pi pi-save');
const severityButton = ref('success');

const program = ref({
  programId: "1",
  language: {},
  name: '',
  description: '',
  share: false,
  code: '',
  image: '',
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

onMounted(async () => {
  const programId = route.params.program as string;
  if (!programId) {
    return router.push({name: 'programs'});
  }

  try {
    const response = await programApi.find(programId);
    console.log(response.program)
    program.value.programId = response.program.programId;
    program.value.language = languages.value.find(l => l.value === response.program.language || '')!;
    program.value.name = response.program.name || '';
    program.value.description = response.program.description || '';
    program.value.share = response.program.visibility === 'public';
    program.value.code = response.program.code || '';
    program.value.image = response.program.image || '';
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === 'Service unavailable') {
        return router.push({name: 'ServiceUnavailable'});
      }
      if (e.message === 'Program not found') {
        return router.push({name: 'programs'});
      }
    }
    console.error(e);
  } finally {
    loading.value.find = false;
  }


})

const runProgram = async () => {
  const instructions = {};
  const files = [program.value.image]
  await programApi.run(program.value.programId, instructions, files, 'debug');
}


const updateProgram = async () => {
  loading.value.update = true;
  try {
    await programApi.update(program.value.programId, program.value);
  } catch (e) {
    console.error(e);
    iconSaveProgram.value = 'pi pi-exclamation-circle';
    severityButton.value = 'danger';
    loading.value.update = false;
    setTimeout(() => {
      iconSaveProgram.value = 'pi pi-save';
      severityButton.value = 'success';
    }, 2000);
  } finally {
    loading.value.update = false;
  }
}

const deleteProgram = async () => {
  loading.value.delete = true;
  try {
    await programApi.delete(program.value.programId);
    await router.push({name: 'programs'});
  } catch (e) {
    console.error(e);
    loading.value.delete = false;
  }
}

</script>

<template>
  <div class="w-full h-full">
    <!-- Content -->
    <div class="flex flex-column gap-3 md:surface-card p-2 sm:p-4 h-full border-round-xl">
      <div class="flex justify-content-between align-items-center pt-2">
        <div class="flex justify-content-start align-items-center gap-2">
          <Button icon="pi pi-arrow-left" severity="secondary" text @click="router.back()"/>
          <h2 class="text-xl my-0">Edition</h2>
        </div>
        <div class="flex gap-2">
          <Button severity="secondary" style="color: #49DE80;" @click="sidebarProgramTest = true">
            <span class="hidden sm:block mr-2">Tester</span>
            <svg height="14" viewBox="0 0 384 512" width="10.5" xmlns="http://www.w3.org/2000/svg">
              <!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
              <path
                  d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"
                  fill="#49de80"/>
            </svg>
          </Button>
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

        <Button :icon="iconSaveProgram" :loading="loading.update" :severity="severityButton" icon-pos="right"
                label="Sauvegarder"
                @click="updateProgram()"/>
        <Button :loading="loading.delete" icon="pi pi-trash" icon-pos="right" label="Supprimer" severity="danger"
                @click="deleteProgram()"/>
        <!-- todo faire les boutons en mode menu       -->
      </div>
    </Sidebar>

    <!-- Sidebar Test   -->
    <Sidebar
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
            @click="runProgram()"
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