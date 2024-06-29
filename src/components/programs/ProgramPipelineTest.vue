<script lang="ts" setup>
import {Program} from "@/models";
import {ToastService} from "@/services/toast.service";
import {useToast} from "primevue/usetoast";
import {onMounted, ref} from "vue";
import InputFile from "@/components/files/InputFile.vue";
import OutputFile from "@/components/files/OutputFile.vue";
import ProgramListItem from "@/components/programs/ProgramListItem.vue";

interface ProgramPipelineTestProps {
  programs: Program[];
}

const props = defineProps<ProgramPipelineTestProps>()
const emit = defineEmits(['onUpdate'])

const toastNotifications = new ToastService(useToast());
const programs = ref<Program[]>([])

onMounted(() => {
  programs.value = props.programs;
})

const isNextProgramHasEnoughPorts = (index: number) => {
  //fixme check if the next program has enough ports
  return true;
}


const addProgram = () => {
  const copyProgram: Program = JSON.parse(JSON.stringify(props.programs[0]))
  copyProgram.instructions.inputs.pop()
  copyProgram.instructions.outputs.pop()
  programs.value!.push(copyProgram);
}
</script>

<template>
  <div v-if="programs" class="flex flex-column align-items-stretch">
    <div v-for="(program, i) in programs" class="flex flex-column gap-3">
      <div v-if="i < 1" class="flex justify-content-between flex-wrap gap-2">
        <div
            v-for="(input, y) in program.instructions.inputs"
            :class="{'w-full': program.instructions.inputs.length === 1}"
            class="flex flex-column gap-2"
            style="width: 47.5%"
        >
          <div class="text-lg">{{ input.name }}</div>
          <!-- todo save the blob         -->
          <InputFile :accept="input.type"/>
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
          <div class="text-lg">{{ output.name }}</div>
          <OutputFile/>
        </div>
      </div>
    </div>

    <Button
        :disabled="programs.length >= 5"
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