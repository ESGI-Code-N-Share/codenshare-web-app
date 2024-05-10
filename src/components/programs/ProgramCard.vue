<script lang="ts" setup>

import {ref} from "vue";
import {useRouter} from "vue-router";
import {CodeNSareApi} from "@/api/codenshare.api";

interface MenuItem {
  /**
   * Property name or getter function to use as the label of an item.
   */
  label?: string | ((...args: any) => string) | undefined;
  /**
   * Icon of the item.
   */
  icon?: string | undefined;
  /**
   * Callback to execute when item is clicked.
   * @param {MenuItemCommandEvent} event - Custom command event.
   * @todo next release should be able to change
   */
  command?: (event: Event) => void;
  /**
   * External link to navigate when item is clicked.
   */
  url?: string | undefined;
  /**
   *  An array of children menuitems.
   */
  items?: MenuItem[] | undefined;
  /**
   * A boolean or a function to return a boolean to specify if the item is disabled.
   * @defaultValue false
   */
  disabled?: boolean | ((...args: any) => boolean) | undefined;
  /**
   * A boolean or a function to return a boolean to specify if the item is visible.
   * @defaultValue true
   */
  visible?: boolean | ((...args: any) => boolean) | undefined;
  /**
   * Specifies where to open the linked document.
   */
  target?: string | undefined;
  /**
   * Defines the item as a separator.
   * @defaultValue false
   */
  separator?: boolean | undefined;
  /**
   * Inline style of the menuitem.
   */
  style?: any;
  /**
   * Style class of the menuitem.
   */
  class?: any;
  /**
   * Unique identifier of an item.
   */
  key?: string | undefined;

  /**
   * Optional
   */
  [key: string]: any;
}

type Program = {
  programId: string;
}

interface ProgramCardProps {
  program: Program
}

const props = defineProps<ProgramCardProps>();
const emit = defineEmits(['onDeleted']);

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
          const programApi = new CodeNSareApi().program;
          await programApi.delete(props.program.programId);
          emit('onDeleted', props.program.programId)
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
  <div class="border-round-xl p-3" style="background-color: #121212">
    <img
        alt="meeting"
        class="border-round-xl cursor-pointer"
        src="/src/assets/images/meeting-office.png"
        style="object-fit: cover; width: 100%; height: auto; max-height: 125px"
        @click="router.push({name: 'program', params: {program: props.program.programId}})"
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
</template>

<style scoped>

</style>