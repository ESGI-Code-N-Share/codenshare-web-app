<script lang="ts" setup>
import {Program} from "@/models";
import {ToastService} from "@/services/toast.service";
import {useToast} from "primevue/usetoast";
import {onMounted, ref} from "vue";
import {CodeNShareProgramApi} from "@/api/codenshare";
import {useUserStore} from "@/stores/user.store";
import ProgramPipelinesGraph from "@/components/programs/ProgramPipelinesGraph.vue";
import {IInput, IOutput} from "@/utils/dag.util";
import ProgramListItem from "@/components/programs/ProgramListItem.vue";
import OutputFile from "@/components/files/OutputFile.vue";
import InputFile from "@/components/files/InputFile.vue";


// interface ProgramPipelineTestProps {
//
// }

const canExecute = defineModel('canExecute', {type: Boolean, required: false, default: false})
const emit = defineEmits(['onUpdate'])

const userStore = useUserStore();
const currentUser = userStore.currentUser;
const toastNotifications = new ToastService(useToast());

const programs = ref<Program[][]>([[], []]);
const instructions = ref<{ program: Program, inputs: IInput[], outputs: IOutput[] }[]>([]);


onMounted(async () => {
  await fetchUserPrograms()
})

const fetchUserPrograms = async () => {
  try {
    if (!currentUser) return;
    const userPrograms = await CodeNShareProgramApi.getByUser(currentUser.userId);
    const promises = userPrograms.map((program) => CodeNShareProgramApi.get(program.programId));
    const p = await Promise.all(promises);//todo remove
    programs.value = [p.slice(0, 2), p.slice(2)]
  } catch (e) {
    console.error(e);
    toastNotifications.showError("Failed to fetch programs");
  }
}

const onNextStep = (e: { program: Program; inputs: IInput[]; outputs: IOutput[] }[], next: (event: Event) => void) => {
  instructions.value = e;
  canExecute.value = true;
  next(e as unknown as Event)
}

function getInstructions() {
  return instructions.value;
}

function setInstructions(updatedInstruction: { program: Program, inputs: IInput[], outputs: IOutput[] }[]) {
  instructions.value = updatedInstruction
}

defineExpose({
  getInstructions,
  setInstructions,
})

</script>

<template>
  <Stepper class="h-full" linear>
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
    <StepperPanel :header="$t('program.tests.step3.title')" :pt="{content: 'h-full'}">
      <template #content="{prevCallback}">
        <div class="flex justify-content-between">
          <Button icon="pi pi-arrow-left" @click="prevCallback"/>
        </div>
        <div class="flex flex-column gap-3 overflow-y-scroll py-4">
          <div v-for="(instruction, i) in instructions" class="flex flex-column gap-3">
            <div class="flex justify-content-between flex-wrap gap-2">
              <div
                  v-for="(input, y) in instruction.inputs.filter(g => g.relatedTo === null)"
                  :class="{'w-full': instruction.inputs.filter(g => g.relatedTo === null).length === 1}"
                  class="flex flex-column gap-2"
                  style="width: 47.5%"
              >
                <div class="text-lg">{{ input.filename }}</div>
                <!-- todo: Melissa save the blob or file        -->
                <InputFile :accept="input.filetype" :rename-file="input.filename"
                           @on-file-selected="input.file=$event.file"/>
              </div>
            </div>

            <div class="text-center">
              <i class="pi pi-chevron-down text-3xl gradient-text-primary"/>
            </div>

            <div class="flex flex-column gap-2">
              <ProgramListItem
                  :class="{'error-ports': false}"
                  :program="instruction.program"
              />
              <!--              <small v-if="!isNextProgramHasEnoughPorts(i)">-->
              <!--                {{-->
              <!--                  $t('program.errors.not_enough_ports', {-->
              <!--                    inputs: program.instructions.outputs.length,-->
              <!--                    outputs: programs[i + 1]?.instructions?.inputs?.length-->
              <!--                  })-->
              <!--                }}-->
              <!--              </small>-->
            </div>

            <div class="text-center">
              <i class="pi pi-equals text-3xl gradient-text-primary"/>
            </div>

            <div class="flex justify-content-between flex-wrap gap-2">
              <div
                  v-for="output in instruction.outputs"
                  :class="{'w-full': instruction.outputs.length === 1}"
                  class="flex flex-column gap-2"
                  style="width: 47.5%;"
              >
                <!-- todo check if input file is output or new input         -->
                <div class="text-lg">{{ output.filename }}</div>
                <OutputFile v-model:url="output.url"/>
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

::v-deep .p-stepper-panels {
  height: 95%;
  padding-left: 0.15em;
  padding-right: 0.15em;
}
</style>