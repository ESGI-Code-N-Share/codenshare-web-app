<script lang="ts" setup>
import {Program} from "@/models";
import {ToastService} from "@/services/toast.service";
import {useToast} from "primevue/usetoast";
import {onMounted, onUnmounted, ref, watch} from "vue";
import {CodeNShareProgramApi} from "@/api/codenshare";
import {useUserStore} from "@/stores/user.store";
import ProgramPipelinesGraph from "@/components/programs/ProgramPipelinesGraph.vue";
import {IInput, IOutput} from "@/utils/dag.util";
import InputFile from "@/components/files/InputFile.vue";
import ProgramListItem from "@/components/programs/ProgramListItem.vue";
import OutputFile from "@/components/files/OutputFile.vue";


// interface ProgramPipelineTestProps {
//
// }

const canExecute = defineModel('canExecute', {type: Boolean, required: false, default: false})
const emit = defineEmits(['onUpdate'])

const userStore = useUserStore();
const currentUser = userStore.currentUser;
const toastNotifications = new ToastService(useToast());

const programs = ref<Program[][]>([[], []]);
const instructions = ref<{
  program: Program,
  inputs: IInput[],
  outputs: IOutput[],
  isProgramDone: boolean,
  isProgramError?: boolean,
  console?: string
}[]>([]);
const initialInstructions = ref<{
  program: Program,
  inputs: IInput[],
  outputs: IOutput[],
  isProgramDone: boolean,
  isProgramError?: boolean,
  console?: string
}[]>([]);
const isPipelineRunning = ref(false);
const isPipelineError = ref(false);

onMounted(async () => {
  await fetchUserPrograms()
})

const fetchUserPrograms = async () => {
  try {
    if (!currentUser) return;
    const userPrograms = await CodeNShareProgramApi.getByUser(currentUser.userId);
    const promises = userPrograms.map((program) => CodeNShareProgramApi.get(program.programId));
    const p = await Promise.all(promises);//todo remove
    programs.value = [p.slice(2), p.slice(0, 2)]
  } catch (e) {
    console.error(e);
    toastNotifications.showError("Failed to fetch programs");
  }
}

const onNextStep = (e: {
  program: Program;
  inputs: IInput[];
  outputs: IOutput[],
  isProgramDone: boolean
}[], next: (event: Event) => void) => {
  instructions.value = e;
  initialInstructions.value = JSON.parse(JSON.stringify(e));
  canExecute.value = true;
  next(e as unknown as Event)
}

function getInstructions() {
  return instructions.value;
}

function setInstructions(updatedInstruction: {
  program: Program,
  inputs: IInput[],
  outputs: IOutput[],
  isProgramDone: boolean
}[]) {
  instructions.value = updatedInstruction
}

defineExpose({
  getInstructions,
  setInstructions,
  isPipelineRunning,
  isPipelineError,
})

const isInputsUploaded = (instruction: { inputs: IInput[] }) => {
  return instruction.inputs.every(i => i.uploaded)
}

const isOutputsUploaded = (instruction: { outputs: IOutput[] }) => {
  return instruction.outputs.every(i => i.url !== null)
}

const resetInstructions = () => {
  instructions.value = []
  isPipelineError.value = false;
  isPipelineRunning.value = false;
  setTimeout(() => {
    instructions.value = JSON.parse(JSON.stringify(initialInstructions.value));
  }, 10)
}

const downloadFiles = (outputs: IOutput[]) => {
  const urls = outputs.map(o => o.url);
  //downloadFiles(urls)
  console.log(urls)
}


const interval = ref()
watch(isPipelineRunning, (value) => {
  if (value) {
    setTimeout(() => {
      const stepsPipelines = document.querySelectorAll('.step-pipeline');
      let current = 0;
      stepsPipelines[current].scrollIntoView({behavior: 'smooth'});
      interval.value = setInterval(() => {
        if (stepsPipelines[current].classList.contains('pi-check')) {
          current++;
          if (current === stepsPipelines.length || stepsPipelines[current].classList.contains('pi-exclamation-circle') || stepsPipelines[current].classList.contains('pi-times')) {
            clearInterval(interval.value);
          } else {
            stepsPipelines[current].scrollIntoView({behavior: 'smooth', block: 'center', inline: 'center'});
          }
        }
      }, 250)
    }, 250)
  } else {
    clearInterval(interval.value)
  }
})

onUnmounted(() => {
  clearInterval(interval.value)
})

</script>

<template>
  <Stepper class="h-full" linear>
    <!-- Step 1   -->
    <StepperPanel :header="$t('program.tests.step1.title')" :pt="{content: 'h-full'}">
      <template #content="{nextCallback}">
        <div class="flex flex-column gap-2 h-full">
          <PickList v-model="programs" class="h-full" dataKey="programId">
            <template #sourceheader> {{ $t('program.tests.step1.available') }}</template>
            <template #targetheader> {{ $t('program.tests.step1.selected') }}</template>
            <template #item="slotProps">
              {{ slotProps.item.name }}
            </template>
          </PickList>
          <div class="flex justify-content-end">
            <Button v-if="programs[1].length > 0 && programs[1].length <= 3" label="Next" @click="nextCallback"/>
          </div>
        </div>
      </template>
    </StepperPanel>
    <!-- Step 2   -->
    <StepperPanel :header="$t('program.tests.step2.title')" :pt="{content: 'h-full'}">
      <template #content="{active, nextCallback, prevCallback}">
        <ProgramPipelinesGraph
            v-if="active"
            v-model:programs="programs[1]"
            @on-instructions="onNextStep($event, nextCallback)"
            @on-back="prevCallback"
        />
      </template>
    </StepperPanel>
    <!-- Step 3   -->
    <StepperPanel :header="$t('program.tests.step3.title')" :pt="{content: 'h-full'}">
      <template #content="{prevCallback}">
        <div class="flex flex-column gap-3 w-full h-full">
          <div class="flex justify-content-between pb-0 -mt-2">
            <Button icon="pi pi-arrow-left" text @click="prevCallback"/>
            <Button icon="pi pi-refresh" label="Réinitialiser" severity="danger" text @click="resetInstructions()"/>
          </div>

          <!-- Step 3 content   -->
          <div class="flex flex-column gap-4 w-full h-full overflow-y-scroll pr-4">
            <div v-for="instruction in instructions" class="flex flex-column">

              <!-- Inputs -->
              <div v-if="instruction.inputs.filter(g => g.relatedTo === null).length > 0" class="grid m-0">
                <div :style="{'width': isPipelineRunning ? '' : 0}" class="col-1 text-center align-self-center">
                  <i
                      :class="!isPipelineRunning ? 'hidden' : isInputsUploaded(instruction) ? 'pi-check text-sm bg-green-700' : instruction.isProgramError ? 'pi-exclamation-circle bg-red-700' : isPipelineError ? 'pi pi-times bg-red-700' : 'pi-spin pi-spinner bg-blue-700'"
                      class="mt-4 pi p-2 border-round-3xl step-pipeline"
                  ></i>
                </div>
                <div class="col flex flex-wrap justify-content-between">
                  <div
                      v-for="input in instruction.inputs.filter(g => g.relatedTo === null)"
                      :class="{'w-full': instruction.inputs.filter(g => g.relatedTo === null).length === 1}"
                      class="flex flex-column gap-2"
                      style="width: 47.5%"
                  >
                    <div class="text-lg">
                      <span>{{ input.filename }}</span>
                      <span class="text-sm"> ({{ input.filetype }})</span>
                    </div>
                    <InputFile
                        :accept="input.filetype"
                        :rename-file="input.filename"
                        max-height-preview="8"
                        @on-file-selected="input.file=$event.file"
                    />
                  </div>
                </div>
              </div>

              <!-- Chevron down -->
              <div class="grid m-0">
                <div :style="{'width': isPipelineRunning ? '' : 0}" class="col-1 text-center align-self-center"></div>
                <div class="col text-center">
                  <i class="pi pi-chevron-down text-2xl gradient-text-primary"/>
                </div>
              </div>

              <!-- Program -->
              <div class="grid m-0">
                <div :style="{'width': isPipelineRunning ? '' : 0}" class="col-1 text-center align-self-center">
                  <i
                      :class="!isPipelineRunning ? 'hidden' : instruction.isProgramDone ? 'pi-check text-sm bg-green-700' : instruction.isProgramError ? 'pi-exclamation-circle bg-red-700' : isPipelineError ? 'pi pi-times bg-red-700' : 'pi-spin pi-spinner bg-blue-700'"
                      class="pi p-2 border-round-3xl step-pipeline"
                  ></i>
                </div>
                <div class="col">
                  <div class="flex flex-column border-round-xl overflow-hidden w-full"
                       style="background-color: rgb(18, 18, 18)">
                    <ProgramListItem :program="instruction.program"/>
                    <Divider class="m-0"/>
                    <div v-if="instruction.console" class="text-left w-full p-3 text-sm max-h-5rem overflow-y-scroll">
                      {{ instruction.console || 'No console output' }}
                    </div>
                  </div>
                </div>
              </div>


              <!-- Equal -->
              <div class="grid m-0">
                <div :style="{'width': isPipelineRunning ? '' : 0}" class="col-1 text-center align-self-center"></div>
                <div class="col text-center">
                  <i class="pi pi-equals text-2xl gradient-text-primary"/>
                </div>
              </div>


              <!-- Outputs -->
              <div class="grid m-0">
                <div :style="{'width': isPipelineRunning ? '' : 0}" class="col-1 text-center align-self-center">
                  <i
                      :class="!isPipelineRunning ? 'hidden' : isOutputsUploaded(instruction) ? 'pi-check text-sm bg-green-700' : isPipelineError ? 'pi pi-times bg-red-700' : 'pi-spin pi-spinner bg-blue-700'"
                      class="mt-4 pi p-2 border-round-3xl step-pipeline"
                  ></i>
                </div>
                <div class="col flex flex-wrap justify-content-between">
                  <div
                      v-for="output in instruction.outputs"
                      :class="{'w-full': instruction.outputs.length === 1}"
                      class="flex flex-column gap-2"
                      style="width: 47.5%;"
                  >
                    <div class="flex justify-content-between">
                      <div class="text-lg">
                        <span>{{ output.filename }}</span>
                        <span class="text-sm"> ({{ output.filetype }})</span>
                      </div>
                      <Button
                          v-if="output.url"
                          class="text-xs text-color-secondary underline"
                          label="Télécharger les images"
                          text
                          @click="downloadFiles(instruction.outputs)"
                      />
                    </div>
                    <OutputFile v-model:url="output.url" class="w-full" @on-error="output.url = null"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </template>
    </StepperPanel>
  </Stepper>
</template>

<style scoped>
.error-ports {
  border: 2px solid red;
}

.p-stepper {
  flex-basis: 50rem;
}

:deep(.p-stepper-panels) {
  height: 95%;
  padding-left: 0.15em;
  padding-right: 0.15em;
}
</style>