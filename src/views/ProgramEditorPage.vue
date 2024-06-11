<script lang="ts" setup>

import {onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {VAceEditor} from 'vue3-ace-editor';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';
import OutputFile from "@/components/files/OutputFile.vue";
import InputFile from "@/components/files/InputFile.vue";
import {Program, ProgramId, ProgramLanguages} from "@/models";
import {CodeNShareProgramApi} from "@/api/codenshare";
import {ToastService} from "@/services/toast.service";
import {useToast} from "primevue/usetoast";

const route = useRoute();
const router = useRouter();
const toastNotifications = new ToastService(useToast());

const program = ref<Program>();
const language = ref();
const version = ref();
const output = ref('');

const sidebarProgramEditor = ref(false);
const sidebarProgramTest = ref(false);

const languages = ref<{ label: string, value: ProgramLanguages }[]>([
  {label: 'Javascript', value: 'javascript'},
  {label: 'Java', value: 'java'},
  {label: 'C', value: 'c'},
]);
const versions = ref<{ label: string, value: string }[]>([
  {label: 'Java 8', value: '8'},
  {label: 'Java 11', value: '11'},
  {label: 'Java 15', value: '15'},
]);


onMounted(async () => {
  const programId = route.params.program as string;
  if (!programId) {
    return router.push({name: 'programs'});
  }

  await fetchProgram(programId);
})

const fetchProgram = async (programId: ProgramId) => {
  try {
    program.value = await CodeNShareProgramApi.get(programId);
    if (!program.value) {
      return await router.push({name: 'programs'});
    }
    language.value = languages.value.find(l => l.value === program.value?.language);
    version.value = versions.value.find(v => v.value === program.value?.version);
  } catch (e) {
    console.error(e);
    toastNotifications.showError("Une erreur s'est produite lors du chargement du programme");
    await router.push({name: 'programs'});
  }
}

const onSaveProgram = async () => {
  if (program.value) {
    try {
      await CodeNShareProgramApi.update(program.value);
      toastNotifications.showSuccess("Modifications enregistrées");
    } catch (e) {
      console.error(e);
      toastNotifications.showError("Une erreur s'est produite lors de la sauvegarde du programme");
    }
  }
}

const onRunProgram = async () => {
  if (program.value) {
    try {
      //todo mélissa
      const result = await CodeNShareProgramApi.execute(program.value.programId);
      output.value = 'Hello World';
      toastNotifications.showSuccess("Programme exécuté");
    } catch (e) {
      console.error(e);
      toastNotifications.showError("Une erreur s'est produite lors de l'exécution du programme");
    }
  }
}

</script>

<template>
  <div class="col flex flex-column gap-4 p-2">
    <div class="flex justify-content-between align-items-center">
      <Button icon="pi pi-arrow-left" severity="secondary" @click="router.back()"/>
      <h2 class="p-0 m-0">{{ $t('global.pages.editor') }}</h2>
      <div class="flex gap-2">
        <Button severity="secondary" style="color: #49DE80;" @click="sidebarProgramTest = true">
          <span class="hidden sm:block mr-2">{{ $t('program.buttons.test') }}</span>
          <svg height="14" viewBox="0 0 384 512" width="10.5" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"
                fill="#49de80"/>
          </svg>
        </Button>
        <Button icon="pi pi-pencil" severity="secondary" style="" @click="sidebarProgramEditor = true"/>
      </div>
    </div>
    <div v-if="!program" class="flex justify-content-center align-items-center h-full">
      <ProgressSpinner/>
    </div>

    <div v-if="program" class="h-full">
      <VAceEditor
          v-model:value="program.code"
          lang="javascript"
          style="height: 10em; min-height: 100%;"
          theme="monokai"/>
    </div>

    <!-- Sidebar Program   -->
    <SideBar
        v-if="program"
        v-model:visible="sidebarProgramEditor"
        :pt="{header: 'border-bottom-1 border-gray-700', content: 'pt-4'}"
        blockScroll
        class="border-0 "
        :header="$t('program.configure')"
        modal
        position="right"
        style="min-width: 350px;"
    >
      <div class="flex flex-column gap-3">
        <div>{{ $t('global.drop_a_file.label') }}</div>
        <InputFile v-model:file-url="program.imageURL" accept="image/*"
                   @onFileSelected="program.imageURL = $event.fileUrl"/>

        <InputText v-model="program.name" :placeholder="$t('program.forms.name.placeholder')"/>
        <Textarea v-model="program.description" :placeholder="$t('program.forms.description.placeholder')" class="h-5rem w-full text-sm"
                  cols="30"
                  rows="5"/>

        <Dropdown
            v-model="language"
            :options="languages"
            data-key="value"
            option-label="label"
            :placeholder="$t('program.forms.language.placeholder')"
            @change="program.language = $event.value.value"
        />
        <Dropdown
            v-if="program.language === 'java' && program.version !== undefined"
            v-model="version"
            :options="versions"
            option-label="label"
            :placeholder="$t('program.forms.version.placeholder')"
            @change="program.version = $event.value.value"
        />

        <Button :label="$t('program.buttons.save')" icon="pi pi-save" icon-pos="right" severity="success"
                @click="onSaveProgram()"/>
      </div>
    </SideBar>

    <!-- Sidebar Test   -->
    <SideBar
        v-if="program"
        v-model:visible="sidebarProgramTest"
        :pt="{header: 'border-bottom-1 border-gray-700', content: 'pt-4'}"
        blockScroll
        :header="$t('program.test')"
        class="border-0 md:w-30rem"
        modal
        position="right"
        style="min-width: 350px;"
    >
      <div class="flex flex-column align-items-stretch gap-3">
        <InputFile accept="image/*" @onFileSelected="program.imageURL = $event.fileUrl"/>

        <div class="text-center">
          <i class="pi pi-chevron-down text-3xl gradient-text-primary"/>
        </div>

        <!--        <ProgramListItem />-->
        <Button
            v-tooltip.bottom="'Unavailable for now'"
            class="text-color-secondary"
            icon="pi pi-plus"
            icon-pos="right"
            :label="$t('program.forms.nextProgram.placeholder')"
            severity="secondary"
        />

        <div class="text-center">
          <i class="pi pi-equals text-3xl gradient-text-primary"/>
        </div>

        <OutputFile/>

        <Button
            class="text-center justify-content-center mt-2"
            severity="secondary"
            style="color: #49DE80; background: linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%), #27272A;"
            @click="onRunProgram()"
        >
          <div>{{ $t('program.buttons.execute') }}</div>
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
        <code>{{ output }}</code>
      </div>

    </SideBar>
  </div>

</template>

<style scoped>
</style>