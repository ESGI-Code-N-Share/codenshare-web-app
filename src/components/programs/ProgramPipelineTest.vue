<script lang="ts" setup>
import {Program} from "@/models";
import {ToastService} from "@/services/toast.service";
import {useToast} from "primevue/usetoast";
import {onMounted, ref} from "vue";
import InputFile from "@/components/files/InputFile.vue";
import OutputFile from "@/components/files/OutputFile.vue";
import ProgramListItem from "@/components/programs/ProgramListItem.vue";
import {CodeNShareProgramApi} from "@/api/codenshare";


type ProgramInstructionsInputOutput = {
  name: string,
  type: string,
  file: File | null,
}
type ProgramInstructions = {
  programId: string,
  inputs: ProgramInstructionsInputOutput[],
  outputs: ProgramInstructionsInputOutput[],
}

interface ProgramPipelineTestProps {
  instructions: ProgramInstructions[],
}

const props = defineProps<ProgramPipelineTestProps>()
const emit = defineEmits(['onUpdate'])

const toastNotifications = new ToastService(useToast());

const programs = ref<Program[]>([]);

onMounted(async () => {
  await initProgramsFetch()
})

const initProgramsFetch = async () => {
  try {
    const promises = props.instructions.map((instruction) => CodeNShareProgramApi.get(instruction.programId))
    programs.value = await Promise.all(promises);
    if (programs.value.length > 0) {
      toastNotifications.showSuccess("Programs fetched successfully");
    }
  } catch (e) {
    console.error(e);
    toastNotifications.showError("Failed to fetch programs");
  }
}

const isNextProgramHasEnoughPorts = (index: number) => {
  //fixme check if the next program has enough ports
  // const currProgram = programs.value![index];
  // const nextProgram = programs.value![index + 1];

  // if(currProgram) {
  //   console.log("curr =>", currProgram.instructions.inputs)
  //   console.log("curr =>", currProgram.instructions.outputs)
  // }
  // if(nextProgram) {
  //   console.log("next =>", nextProgram.instructions.inputs)
  //   console.log("next =>", nextProgram.instructions.outputs)
  // }

  return true
}


const addProgram = () => {
  const globalInstructions = props.instructions
  globalInstructions.push({
    programId: "fbf3a3aa-d8fc-40d5-ad7b-fb135f7ecd31",
    inputs: [],
    outputs: [],
  })
  initProgramsFetch()
  emit('onUpdate', globalInstructions)
}

const onFileSelected = (instruction: number, input: number, fileEvent: { file: File }) => {
  const instructions = props.instructions
  if (!instructions[instruction].inputs[input]) {
    return
  }
  instructions[instruction].inputs[input].file = fileEvent.file
}
</script>

<template>
  <div v-if="programs" class="flex flex-column align-items-stretch">
    {{ instructions }}
    <div v-for="(program, i) in programs" class="flex flex-column gap-3">
      <div v-if="i < 1" class="flex justify-content-between flex-wrap gap-2">
        <div
            v-for="(input, y) in program.instructions.inputs"
            :class="{'w-full': program.instructions.inputs.length === 1}"
            class="flex flex-column gap-2"
            style="width: 47.5%"
        >
          <div class="text-lg">{{ input.name }}</div>
          <!-- todo: Melissa save the blob or file        -->
          <InputFile :accept="input.type" @on-file-selected="onFileSelected(i, y, $event)"/>
        </div>
      </div>
      <div v-else></div>

      <div class="text-center">
        <i class="pi pi-chevron-down text-3xl gradient-text-primary"/>
      </div>

      <div class="flex flex-column gap-2">
        <ProgramListItem
            :class="{'error-ports': !isNextProgramHasEnoughPorts(i)}"
            :program="program"
            @on-delete="programs.splice(i, 1)"
        />
        <small v-if="!isNextProgramHasEnoughPorts(i)">
          {{
            $t('program.errors.not_enough_ports', {
              inputs: program.instructions.outputs.length,
              outputs: programs[i + 1]?.instructions?.inputs?.length
            })
          }}
        </small>
      </div>

      <div class="text-center">
        <i class="pi pi-equals text-3xl gradient-text-primary"/>
      </div>

      <div class="flex justify-content-between flex-wrap gap-2">
        <div
            v-for="output in program.instructions.outputs"
            :class="{'w-full': program.instructions.outputs.length === 1}"
            class="flex flex-column gap-2"
            style="width: 47.5%;"
        >
          <!-- todo check if input file is output or new input         -->
          <div class="text-lg">{{ output.name }}</div>
          <OutputFile/>
        </div>
      </div>
    </div>

    <Button
        :disabled="programs.length >= 3"
        :label="$t('program.forms.nextProgram.placeholder')"
        class="text-color-secondary w-full mt-3 mb-2"
        icon="pi pi-plus"
        icon-pos="right"
        severity="secondary"
        @click="addProgram()"
    />
  </div>
</template>

<style scoped>
.error-ports {
  border: 2px solid red;
}
</style>