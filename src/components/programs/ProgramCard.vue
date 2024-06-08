<script lang="ts" setup>

import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import {Program, ProgramsRequest} from "@/models";
import {CodeNShareProgramApi} from "@/api/codenshare";
import {getProgramOptions} from "@/utils/program.util";
import {useUserStore} from "@/stores/user.store";
import {ToastService} from "@/services/toast.service";
import {useToast} from "primevue/usetoast";


interface ProgramCardProps {
  program: Program | ProgramsRequest
}

const props = defineProps<ProgramCardProps>();
const emit = defineEmits(['onDeleted', 'onMenuClick']);

const router = useRouter();
const toastNotifications = new ToastService(useToast());

const menuProgram = ref();
const editProgramOptions = ref();

const currentUser = useUserStore().currentUser;

function editProgramToggle(event: Event) {
  menuProgram.value.toggle(event);
}

onMounted(() => {
  if (!currentUser) return;
  editProgramOptions.value = getProgramOptions(props.program, currentUser, {
    deleteCommand: async () => {
      try {
        await CodeNShareProgramApi.delete(props.program.programId);
        toastNotifications.showSuccess('Programme supprimé');
        emit('onDeleted', props.program.programId);
        emit('onMenuClick')
      } catch (e) {
        console.error(e);
        toastNotifications.showError("Une erreur s'est produite lors de la suppression du programme");
      }
    },

    importCommand: async () => {
      try {
        await CodeNShareProgramApi.import(props.program.programId);
        await router.push({name: 'playground', query: {program: props.program.programId}});
        toastNotifications.showSuccess('Programme importé');
        emit('onMenuClick')
      } catch (e) {
        console.error(e);
        toastNotifications.showError("Une erreur s'est produite lors de l'importation du programme");
      }
    },

    editCommand: () => {
      router.push({name: 'program', params: {program: props.program.programId}})
      emit('onMenuClick')
    },

    shareCommand: () => {
      // router.push({name: 'share-program', params: {program: props.program.programId}});
      emit('onMenuClick')
    },

    useCommand: () => {
      router.push({name: 'playground', query: {program: props.program.programId}})
      emit('onMenuClick')
    }
  });
})

</script>

<template>
  <div class="p-2 sm:p-2 border-round-2xl" style="min-height: 260px; max-height: 300px">
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