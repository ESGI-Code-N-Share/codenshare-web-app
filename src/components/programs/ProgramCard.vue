<script lang="ts" setup>

import {MenuItem} from "primevue/menuitem";
import {ref} from "vue";
import {useRouter} from "vue-router";

type Program = {
  id: string;
}

interface ProgramCardProps {
  program: Program
}

const props = defineProps<ProgramCardProps>();
const emit = defineEmits();

const router = useRouter();

const menuProgram = ref();
const editProgramOptions = ref<MenuItem[]>([
  {
    label: 'Options',
    items: [
      {
        label: 'Utiliser',
        icon: 'pi pi-play',
        command: (event) => {
          console.log(event);
          router.push({name: 'playground', query: {program: props.program.id}})
        }
      },
      {
        label: 'Partager',
        icon: 'pi pi-share-alt'
      },
      {
        label: 'Modifier',
        icon: 'pi pi-pencil',
        command: () => {
          router.push({name: 'program', params: {program: props.program.id}})
        }
      },
      {
        label: 'Supprimer',
        icon: 'pi pi-trash'
      }
    ]
  }
]);

function editProgramToggle(event: Event) {
  menuProgram.value.toggle(event);
}

</script>

<template>
  <div>
    <div class="border-round-xl p-3" style="background-color: #121212">
      <img
          alt="meeting"
          class="border-round-xl"
          src="/src/assets/images/meeting-office.png"
          style="object-fit: cover; width: 100%; height: auto; max-height: 125px"
      />
      <div class="flex justify-content-between align-items-center mt-2">
        <small class="" style="color: #4ade80">En ligne</small>
        <Button
            aria-controls="overlay_edit_program"
            aria-haspopup="true"
            icon="pi pi-ellipsis-v"
            iconPos="right"
            severity="contrast"
            text
            @click="editProgramToggle($event)"
        />
        <Menu id="overlay_edit_program" ref="menuProgram" :model="editProgramOptions" popup/>
      </div>

      <h3 class="my-1">Mon programme</h3>
      <div class="text-color-secondary text-sm" style="min-height: 2em">lorem uqsdg q zdgyuqudi qsdg lorem qsdg</div>
    </div>
  </div>
</template>

<style scoped>

</style>