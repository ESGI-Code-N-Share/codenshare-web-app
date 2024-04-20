<script lang="ts" setup>

import {onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {MenuItem} from "primevue/menuitem";
import InputFile from "@/components/files/InputFile.vue";
import ProgramListItem from "@/components/programs/ProgramListItem.vue";

const route = useRoute();
const router = useRouter();

const programId = ref();

const sidebarEditor = ref(false);

const code = ref('');
const panelProgram = ref();
const panelTest = ref();

const editProgramOptions = ref<MenuItem[]>([
  {
    label: 'Options',
    items: [
      {
        label: 'Sauvegarder',
        icon: 'pi pi-save',
      },
      {
        label: 'Supprimer',
        icon: 'pi pi-trash'
      }
    ]
  }
]);

onMounted(() => {
  panelProgram.value.toggle();
  programId.value = route.params.program as string;
  if (!programId.value) {
    return router.push({name: 'programs'});
  }

  // todo call api to get program details
})


function openMenu(event: Event) {
  // editProgramToggle(event);
}

function openPanelProgram(event: Event) {
  panelProgram.value.toggle(event);
  panelTest.value.toggle(event);
}

function openPanelTest(event: Event) {
  panelTest.value.toggle(event);
  panelProgram.value.toggle(event);
}
</script>

<template>
  <div class="h-full flex">
    <!-- Editor   -->
    <div class="col">
      <Editor v-model="code" class="p-0 col"/>


    </div>


    <!-- Right content   -->
    <Button class="block lg:hidden" label=">" @click="sidebarEditor = !sidebarEditor; openPanelProgram($event)"/>
    <div class="hidden lg:block lg:col-5">
      <!-- Program edition   -->
      <Panel ref="panelProgram" class="border-round-xl" collapsed style="background-color: #121212">
        <template #header>
          <div class="flex justify-content-between align-items-center w-full" @click.stop="openPanelProgram($event)">
            <h4 class="my-2">Nom du programme</h4>
            <div>
              <Button icon="pi pi-ellipsis-v" severity="contrast" text @click="openMenu($event)"/>
              <Menu :model="editProgramOptions" popup/>
            </div>
          </div>
        </template>

        <!-- Drag and drop     -->
        <InputFile class="h-5rem w-full"/>
        <Textarea class="h-5rem w-full" placeholder="Description"/>
      </Panel>

      <!-- Test   -->
      <Panel ref="panelTest" class="border-round-xl" collapsed style="background-color: #121212">
        <template #header>
          <div class="w-full" @click.stop="openPanelTest($event)">
            <h4 class="my-2">Tester votre programme</h4>
          </div>
        </template>

        <!-- Test     -->
        <div class="flex flex-column align-items-stretch gap-3">
          <div class="border-2 border-dashed border-gray-500 border-round text-center p-4 text-color-secondary">
            <i class="pi pi-download text-5xl mb-2"/>
            <div>Drag and drop a file</div>
          </div>

          <div class="text-center">
            <i class="pi pi-chevron-down text-3xl gradient-text-primary"/>
          </div>

          <ProgramListItem/>
          <Button
              v-tooltip.bottom="'Unavailable for now'"
              class="text-color-secondary"
              icon="pi pi-plus"
              icon-pos="right"
              label="Ajouter un autre programme"
              severity="secondary"
          />
          <!--        <ProgramListItemEmpty />-->


          <div class="text-center">
            <i class="pi pi-equals text-3xl gradient-text-primary"/>
          </div>

          <div class="border-2 border-dashed border-gray-500 border-round text-center p-4 text-color-secondary">
            <i class="pi pi-image text-6xl"/>
          </div>

          <Button
              class="text-center justify-content-center mt-2"
              severity="secondary"
              style="color: #49DE80; background: linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%), #27272A;"
          >
            <div>Exécuter</div>
            <i class="pi pi-play px-2"></i>
          </Button>
        </div>

      </Panel>
    </div>

    <SideBar v-model:visible="sidebarEditor" class="block lg:hidden" header="Édition & test" position="right">
      <div class="">
        <!-- Program edition   -->
        <Panel ref="panelProgram" class="border-round-xl" collapsed style="background-color: #121212">
          <template #header>
            <div class="flex justify-content-between align-items-center w-full" @click.stop="openPanelProgram($event)">
              <h4 class="my-2">Nom du programme</h4>
              <div>
                <Button icon="pi pi-ellipsis-v" severity="contrast" text @click="openMenu($event)"/>
                <Menu :model="editProgramOptions" popup/>
              </div>
            </div>
          </template>

          <!-- Drag and drop     -->
          <div>
            Drago and drop
          </div>
          <Textarea class="h-5rem w-full" placeholder="Description"/>
        </Panel>

        <!-- Test   -->
        <Panel ref="panelTest" class="border-round-xl" collapsed style="background-color: #121212">
          <template #header>
            <div class="w-full" @click.stop="openPanelTest($event)">
              <h4 class="my-2">Tester votre programme</h4>
            </div>
          </template>

          <!-- Drag and drop     -->
          <div>
            Drago and drop
          </div>
          <Textarea class="h-5rem w-full" placeholder="Description"/>
        </Panel>
      </div>
    </SideBar>
  </div>
</template>

<style scoped>
</style>