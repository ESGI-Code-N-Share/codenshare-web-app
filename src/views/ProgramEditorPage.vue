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
import {SocketListener} from "@/listener/socket-listener";
import ProgramPipelineGraph from "@/components/programs/ProgramPipelineGraph.vue";

const route = useRoute();
const router = useRouter();
const toastNotifications = new ToastService(useToast());

const loading = ref(false);
const programItemOptions = ref([
  {
    label: 'Edit',
    icon: 'pi pi-pencil',
    command: () => sidebarProgramEditor.value = true
  },
  {
    label: 'Pipeline',
    icon: 'pi pi-bolt',
    command: () => openPipelineGraph.value = true
  },
  {
    label: 'Test',
    icon: 'pi pi-play',
    command: () => sidebarProgramTest.value = true
  },
]);
const consoleExpanded = ref(false);

const program = ref<Program>();
const language = ref();
const version = ref();
const output = ref('')

const sidebarProgramEditor = ref(false);
const sidebarProgramTest = ref(false);
const openPipelineGraph = ref(false)

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

    //todo remove the instruction below
    program.value!.instructions = {
      inputs: [
        {name: 'input1', type: 'image'},
        {name: 'input2', type: 'image'},
      ],
      outputs: [
        {name: 'output1', type: 'image'},
        {name: 'output2', type: 'image'},
      ]
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
      loading.value = true;
      await CodeNShareProgramApi.update(program.value);
      const task = await CodeNShareProgramApi.run(program.value.programId);

      await SocketListener.getResult(task, (data: string) => {
        output.value = data
        loading.value = false;
      }, (e: string) => {
        console.error(e);
        loading.value = false;
        toastNotifications.showError("Une erreur s'est produite lors de l'exécution du programme");
      });


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
        <SplitButton
            :label="$t('program.buttons.save')"
            :model="programItemOptions"
            :pt="{button: {label: {style: 'color: #49DE80;'}}}"
            class="text-blue-100"
            severity="secondary"
            @click="onSaveProgram()"
        />
      </div>
    </div>
    <div v-if="!program" class="flex justify-content-center align-items-center h-full">
      <ProgressSpinner/>
    </div>

    <div v-if="program" class="h-full relative">
      <VAceEditor
          v-model:value="program.code"
          lang="javascript"
          style="height: 10em; min-height: 100%;"
          theme="monokai"/>
      <div class="w-full absolute bottom-0 z-5 bg-black-alpha-90 p-2">
        <div :class="{'w-full': consoleExpanded}" class="bg-black-alpha-90">
          <Button
              :label="$t('program.buttons.console')"
              class="hover:bg-gray-800 text-sm"
              severity="secondary"
              text
              @click="consoleExpanded = !consoleExpanded"
          />
          <div v-if="consoleExpanded" class="pl-3 bg-gray-900 p-2 mt-2 border-round">
            <pre><code>{{ output }}</code></pre>
          </div>
        </div>
      </div>
    </div>

    <!-- Sidebar Program   -->
    <SideBar
        v-if="program"
        v-model:visible="sidebarProgramEditor"
        :header="$t('program.configure')"
        :pt="{header: 'border-bottom-1 border-gray-700', content: 'pt-4'}"
        blockScroll
        class="border-0 "
        modal
        position="right"
        style="min-width: 350px;"
    >
      <div class="flex flex-column gap-3">
        <div>{{ $t('global.drop_a_file.label') }}</div>
        <InputFile v-model:file-url="program.imageURL" accept="image/*"
                   @onFileSelected="program.imageURL = $event.fileUrl"/>

        <InputText v-model="program.name" :placeholder="$t('program.forms.name.placeholder')"/>
        <Textarea v-model="program.description" :placeholder="$t('program.forms.description.placeholder')"
                  class="h-5rem w-full text-sm"
                  cols="30"
                  rows="5"/>

        <Dropdown
            v-model="language"
            :options="languages"
            :placeholder="$t('program.forms.language.placeholder')"
            data-key="value"
            option-label="label"
            @change="program.language = $event.value.value"
        />
        <Dropdown
            v-if="program.language === 'java' && program.version !== undefined"
            v-model="version"
            :options="versions"
            :placeholder="$t('program.forms.version.placeholder')"
            option-label="label"
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
        :header="$t('program.test')"
        :pt="{header: 'border-bottom-1 border-gray-700', content: 'pt-4'}"
        blockScroll
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
            :label="$t('program.forms.nextProgram.placeholder')"
            class="text-color-secondary"
            icon="pi pi-plus"
            icon-pos="right"
            severity="secondary"
        />

        <div class="text-center">
          <i class="pi pi-equals text-3xl gradient-text-primary"/>
        </div>

        <OutputFile/>

        <Button
            :label="$t('program.buttons.execute')"
            :loading="loading"
            class="text-center justify-content-center mt-2"
            icon-pos="right"
            severity="secondary"
            style="color: #49DE80; background: linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%), #27272A;"
            @click="onRunProgram()"
        />
      </div>

      <!-- Divider     -->
      <div class="flex justify-content-center py-4">
        <Divider class="m-0" style="width: 75%;" type="dashed"/>
      </div>

      <!-- Console     -->
      <div class="flex flex-column gap-2">
        <h3 class="text-lg m-0 p-0">Console</h3>
        <pre><code>{{ output }}</code></pre>
      </div>

    </SideBar>

    <!-- Modal Pipeline Graph   -->
    <Dialog v-model:visible="openPipelineGraph" :header="$t('program.pipeline')" modal>
      <ProgramPipelineGraph v-if="program" :program="program"/>
    </Dialog>
  </div>

</template>

<style scoped>
</style>