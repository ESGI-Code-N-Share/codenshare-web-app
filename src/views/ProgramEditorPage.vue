<script lang="ts" setup>

import {onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {VAceEditor} from 'vue3-ace-editor';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';
import InputFile from "@/components/files/InputFile.vue";
import {Program, ProgramId, ProgramLanguages} from "@/models";
import {CodeNShareProgramApi} from "@/api/codenshare";
import {ToastService} from "@/services/toast.service";
import {StorageService} from "@/services/storage.service";
import {useToast} from "primevue/usetoast";
import {SocketListener} from "@/listener/socket-listener";
import ProgramPipelineGraph from "@/components/programs/ProgramPipelineGraph.vue";
import ProgramPipelineTest from "@/components/programs/ProgramPipelineTest.vue";
import ProgramCodeHistory from "@/components/programs/ProgramCodeHistory.vue";
import {IInput, IO, IOutput, isInput, isOutput} from "@/utils/dag.util";

const route = useRoute();
const router = useRouter();
const toastNotifications = new ToastService(useToast());
const storageService = new StorageService();

const loading = ref(false);
const loadingUpdateProgram = ref(false);
const programItemOptions = ref([
  {
    label: 'Pipeline',
    icon: 'pi pi-bolt',
    command: () => openPipelineGraph.value = true
  },
  {
    label: 'Historique',
    icon: 'pi pi-clock',
    command: () => openCodeHistory.value = true
  },
  {
    label: 'Configurer',
    icon: 'pi pi-cog',
    command: () => sidebarProgramEditor.value = true
  },
  {
    separator: true
  },
  {
    label: 'Supprimer',
    icon: 'pi pi-trash',
    command: async () => {
      try {
        if (program.value) {
          await CodeNShareProgramApi.delete(program.value.programId);
          await router.push({name: 'programs'});
        }
        toastNotifications.showSuccess("Programme supprimé");
      } catch (e) {
        console.error(e);
        toastNotifications.showError("Une erreur s'est produite lors de la suppression du programme");
      }
    }
  },
]);
const consoleExpanded = ref(false);
const testExpanded = ref(false);
const pipelineExpanded = ref(false);
const pipelineTest = ref<InstanceType<typeof ProgramPipelineTest>>();
const canExecute = ref(false);

const globalInstructions = ref<{
  programId: string,
  inputs: { filename: string, filetype: string, type: 'input' | 'output', file: File | null }[],
  outputs: { filename: string, filetype: string, type: 'input' | 'output', file: File | null }[],
}[]>([])
const initialInstructions = ref<{
  program: Program,
  inputs: IInput[],
  outputs: IOutput[],
  isProgramDone: boolean,
  isProgramError?: boolean,
  console?: string
}[]>([]);

const program = ref<Program>();
const visibility = ref();
const language = ref();
const version = ref();
const output = ref('');

const sidebarProgramEditor = ref(false);
const openCodeHistory = ref(false);
const openPipelineGraph = ref(false)
const resetTestExpanded = ref(false)

const visibilities = ref<{ label: string, value: string }[]>([
  {label: 'Public', value: 'public'},
  {label: 'Protégé', value: 'protected'},
  {label: 'Privé', value: 'private'},
]);
const languages = ref<{ label: string, value: ProgramLanguages }[]>([
  {label: 'Javascript', value: 'javascript'},
  {label: 'Java', value: 'java'},
]);
const versions = ref<{ label: string, value: string }[]>([
  {label: 'Java 11', value: '11'},
  {label: 'Java 17', value: '17'},
  {label: 'Java 21', value: '21'},
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

    visibility.value = visibilities.value.find(v => v.value === program.value?.visibility);
    language.value = languages.value.find(l => l.value === program.value?.language);
    version.value = versions.value.find(v => v.value === program.value?.version);

    if (program.value) {
      const programId = program.value.programId;
      const inputs = program.value.instructions.inputs;
      const outputs = program.value.instructions.outputs;
      if (!programId || !inputs || !outputs) {
        return;
      }
      globalInstructions.value.push({
        programId,
        inputs: inputs.map(i => ({filename: i.name, filetype: i.type, type: 'input', file: null})),
        outputs: outputs.map(i => ({filename: i.name, filetype: i.type, type: 'output', file: null})),
      })
    }

  } catch (e) {
    console.error(e);
    toastNotifications.showError("Une erreur s'est produite lors du chargement du programme");
    await router.push({name: 'programs'});
  }
}

const onSaveProgram = async () => {
  if (program.value) {
    try {
      loadingUpdateProgram.value = true;
      await CodeNShareProgramApi.update(program.value);
      toastNotifications.showSuccess("Modifications enregistrées");
    } catch (e) {
      console.error(e);
      toastNotifications.showError("Une erreur s'est produite lors de la sauvegarde du programme");
    } finally {
      loadingUpdateProgram.value = false;
    }
  }
}

const onRunProgram = async () => {
  const instructions = pipelineTest.value?.getInstructions() as {
    program: Program,
    inputs: IInput[],
    outputs: IOutput[],
    isProgramError: boolean
    isProgramDone: boolean
  }[];
  initialInstructions.value = JSON.parse(JSON.stringify(instructions));

  if (instructions && instructions.length > 0) {
    try {
      resetInstructions();
      console.log(instructions)
      pipelineTest.value!.isPipelineRunning = true;
      await runPipeline(instructions);
    } catch (e) {
      pipelineTest.value!.isPipelineRunning = false;
      toastNotifications.showError("Une erreur s'est produite lors l'execution du programme'");
    }
  } else {
    await runProgram()
  }
}

const runPipeline = async (instructions: {
  program: Program,
  inputs: IInput[],
  outputs: IOutput[],
  console?: string,
  isProgramDone: boolean
  isProgramError: boolean
}[]) => {
  // for each instruction
  for (const [index, instruction] of Object.entries(instructions)) {
    console.log("current instruction to execute " + instruction.program.name)

    // prepare program's input
    for (const [i, input] of Object.entries<IInput>(instruction.inputs)) {

      if (input.file) {
        try {
          await storageService.upload(input.file, instruction.program.programId)
          instruction.inputs[parseInt(i)].uploaded = true;
          pipelineTest.value!.setInstructions(instructions);
        } catch (e) {
          console.error(e);
        }
      } else {
        // if it's related, find it and upload it
        const idRelatedTo = input.relatedTo
        const targetIO: IO | undefined = instructions
            .flatMap(instruction => [...instruction.inputs, ...instruction.outputs])
            .find(file => file.id === idRelatedTo);

        if (!targetIO) {
          throw new Error("Missing input for program : " + instruction.program.programId)
        } else {
          let file: File;

          if (isInput(targetIO)) {
            if (targetIO.file) {
              file = targetIO.file;
            } else {
              throw new Error("File not found");
            }


          } else if (isOutput(targetIO)) {
            if (targetIO.url) {
              file = await storageService.getFileFromS3Url(targetIO.url);
            } else {
              throw new Error("Url not found");
            }
          } else {
            throw new Error("Files missing !!!")
          }

          console.log("found the file for " + input.filename)
          try {
            const [_, format] = input.filetype.split('/')
            await storageService.upload(file, instruction.program.programId, `${input.filename}.${format}`)
            input.file = file
            instruction.inputs[parseInt(i)].uploaded = true;
            pipelineTest.value!.setInstructions(instructions);
          } catch (e) {
            console.error(e);
          }
        }
      }
    }

    // run program
    if (instruction.program) {
      try {
        const console = await run(instruction.program);
        instructions.at(index as unknown as number)!.isProgramDone = true;
        instructions.at(index as unknown as number)!.console = console;
        pipelineTest.value!.setInstructions(instructions);
      } catch (e) {
        console.error(e);
        instructions.at(index as unknown as number)!.isProgramError = true;
        instructions.at(index as unknown as number)!.console = e as string;
        pipelineTest.value!.isPipelineError = true;
        break;
      }

    }

    // get output
    for (const output of instruction.outputs) {
      if (output && instruction.program) {
        const [_, format] = output.filetype.split('/')
        output.url = storageService.getFile(instruction.program.programId, `${output.filename}.${format}`);
        pipelineTest.value!.setInstructions(instructions);
      }
    }

  }

  pipelineTest.value!.setInstructions(instructions);
}


const run = async (program: Program) => {
  const task = await CodeNShareProgramApi.run(program.programId);
  return new Promise<string>(async (resolve, reject) => {
    await SocketListener.getResult(task, (data: string) => {
      output.value = data
      loading.value = false;
      resolve(data)
    }, (e: string) => {
      console.error(e);
      loading.value = false;
      toastNotifications.showError("Une erreur s'est produite lors de l'exécution du programme");
      reject()
    });
  })
}

const runProgram = async () => {
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

function resetInstructions() {
  pipelineTest.value!.isPipelineRunning = false;
  pipelineTest.value!.isPipelineError = false;
  pipelineTest.value!.setInstructions([]);
  pipelineTest.value!.setInstructions(initialInstructions.value);
}
</script>

<template>
  <div class="col flex flex-column gap-4 p-2">
    <div class="flex justify-content-between align-items-center">
      <Button icon="pi pi-arrow-left" severity="secondary" @click="router.back()"/>
      <div class="flex flex-column gap-1 justify-content-center text-center">
        <h2 class="p-0 m-0">{{ $t('global.pages.editor') }}</h2>
        <small>{{ program?.name?.slice(0, 25) }}</small>
      </div>
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

    <div v-if="program" ref="pipelineContainerHeight" class="h-full relative">
      <VAceEditor
          v-model:value="program.code"
          lang="javascript"
          style="height: 10em; min-height: 100%;"
          theme="monokai"/>
      <div
          :class="{'h-full sm:px-3': testExpanded || pipelineExpanded}"
          class="flex flex-column w-full absolute bottom-0 z-5 bg-black-alpha-90 p-3 sm:p-2 overflow-scroll">
        <div ref="pipelineContainer"
             class="flex justify-content-between align-items-center gap-2">
          <div class="flex">
            <Button
                :class="{ 'bg-gray-800 text-base text-white': consoleExpanded }"
                :label="$t('program.buttons.console')"
                class="hover:bg-gray-800 text-sm mr-2"
                severity="secondary"
                text
                @click="consoleExpanded = !consoleExpanded; testExpanded = false; resetTestExpanded = false"
            />
            <Button
                :class="{ 'bg-gray-800 text-base text-white': testExpanded }"
                :label="$t('program.buttons.test')"
                class="hover:bg-gray-800 text-sm mr-2"
                severity="secondary"
                text
                @click="testExpanded = !testExpanded; resetTestExpanded = false; consoleExpanded = false;"
            />
          </div>
          <div>
            <Button
                :loading="loading"
                severity="secondary"
                style="color: #49DE80;"
                @click="onRunProgram()"
            >
              <span class="hidden sm:block mr-2 text-sm">{{ $t('program.buttons.execute') }}</span>
              <svg height="14" viewBox="0 0 384 512" width="10.5" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"
                    fill="#49de80"/>
              </svg>
            </Button>
          </div>
        </div>
        <!-- Console   -->
        <div v-if="consoleExpanded" class="bg-gray-900 p-3 mt-3 border-round">
          <pre><code>{{ output }}</code></pre>
        </div>
        <!-- Pipelines Test   -->
        <div v-if="!resetTestExpanded" v-show="testExpanded"
             class="bg-gray-900 p-3 mt-3 border-round h-full overflow-scroll">
          <ProgramPipelineTest ref="pipelineTest" v-model:can-execute="canExecute" :program="program"/>
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
            v-model="visibility"
            :options="visibilities"
            :placeholder="$t('program.forms.visibility.placeholder')"
            data-key="value"
            option-label="label"
            @change="program.visibility = $event.value.value"
        />
        <Dropdown
            v-model="language"
            :options="languages"
            :placeholder="$t('program.forms.language.placeholder')"
            data-key="value"
            option-label="label"
            @change="program.language = $event.value.value; program.version = $event.value.value === 'java' ? '8' : ''"
        />
        <Dropdown
            v-if="program.language === 'java'"
            v-model="version"
            :options="versions"
            :placeholder="$t('program.forms.version.placeholder')"
            option-label="label"
            @change="program.version = $event.value.value"
        />

        <Button
            :label="$t('program.buttons.save')"
            :loading="loadingUpdateProgram"
            icon="pi pi-save"
            icon-pos="right"
            severity="success"
            @click="onSaveProgram()"/>
      </div>
    </SideBar>

    <!-- Modal Pipeline Graph   -->
    <Dialog v-model:visible="openPipelineGraph" :header="$t('program.pipeline')" modal>
      <ProgramPipelineGraph
          v-if="program"
          :program="program"
          @on-update="fetchProgram(program.programId); resetTestExpanded = true; testExpanded = false"
      />
    </Dialog>

    <!-- Modal Code History   -->
    <Dialog
        v-model:visible="openCodeHistory"
        :header="$t('program.code_history')"
        :pt="{content: 'h-full'}"
        :style="{ width: '80%', height: '80%' }"
        modal
    >
      <ProgramCodeHistory
          v-if="program"
          :program="program"
          @on-import="program.code = $event.code; openCodeHistory = false"
      />
    </Dialog>
  </div>

</template>

<style scoped>
</style>