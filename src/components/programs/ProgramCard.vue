<script lang="ts" setup>

import {ref} from "vue";
import {useRouter} from "vue-router";
import {Program, ProgramsRequest} from "@/models";
import {CodeNShareProgramApi} from "@/api/codenshare";


interface ProgramCardProps {
  program: Program | ProgramsRequest
}

const props = defineProps<ProgramCardProps>();
const emit = defineEmits(['onDeleted']);

const router = useRouter();

const menuProgram = ref();
const editProgramOptions = ref<any[]>([
  {
    label: 'Options',
    items: [
      {
        label: 'Utiliser',
        icon: 'pi pi-play',
        command: (event: Event) => {
          console.log(event);
          router.push({name: 'playground', query: {program: props.program.programId}})
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
          router.push({name: 'program', params: {program: props.program.programId}})
        }
      },
      {
        label: 'Supprimer',
        icon: 'pi pi-trash',
        command: async () => {
          try {
            try {
              await CodeNShareProgramApi.delete(props.program.programId)
              emit('onDeleted', props.program.programId);
            } catch (e) {
              console.error(e);
            }
          } catch (e) {
            console.error(e);
          }
        }
      }
    ]
  }
]);

function editProgramToggle(event: Event) {
  menuProgram.value.toggle(event);
}

</script>

<template>
  <div class="p-2 sm:p-2" style="min-height: 300px; max-height: 300px">
    <div class="flex flex-column surface-card border-round-xl p-2 h-full">
      <img
          alt="meeting"
          class="border-round-xl"
          :src="program.imageURL"
          style="object-fit: cover; width: 100%; height: auto; max-height: 125px"
          @click="$router.push({name: 'program', params: {program: program.programId}})"
      />
      <div class="flex flex-column pl-2 pb-2 overflow-hidden">
        <div class="flex justify-content-between align-items-center mt-2">
          <small v-if="program.visibility === 'public'" class="" style="color: #4ade80">En ligne</small>
          <small v-else-if="program.visibility === 'protected'" class="" style="color: #f7b924">Protégé</small>
          <small v-else-if="program.visibility === 'private'" class="" style="color: #4a6dde">Privé</small>
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

        <h3 class="my-1">{{ program.name }}</h3>
        <div class="text-color-secondary text-sm overflow-hidden">{{ program.description }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>