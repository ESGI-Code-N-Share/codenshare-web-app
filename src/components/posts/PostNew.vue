<script lang="ts" setup>

import {ref} from "vue";
import {MenuItem} from "primevue/menuitem";
import InputFile from "@/components/files/InputFile.vue";

const menuPostOptions = ref();
const addImage = ref(false);
const addProgram = ref(false);

const content = ref('');

const createPostOptions = ref<MenuItem[]>([
  {
    label: 'Ajouter une image',
    icon: 'pi pi-image',
    command() {
      addImage.value = true;
      createPostOptions.value[0].disabled = true;
    },
  },
  {
    label: 'Ajouter un programme',
    icon: 'pi pi-book',
    command() {
      addProgram.value = true;
      createPostOptions.value[1].disabled = true;
    },
  },
  {
    label: 'Annuler',
    icon: 'pi pi-refresh',
    class: 'border-round text-color-primary',
    style: 'color: #f87171',
    command() {
      addProgram.value = false;
      addImage.value = false;
      content.value = '';

      createPostOptions.value?.forEach(item => item.disabled = false);
    }
  }
]);

function createPostToggle(event: Event) {
  menuPostOptions.value.show(event);
}

</script>

<template>
  <div class="p-2 border-round-xl surface-card" style="background-color: #121212;">
    <div class="flex justify-content-between align-items-center mb-3 p-2 border-round">
      <div class="flex align-items-center">
        <Avatar
            :image="'https://randomuser.me/api/portraits/men/9.jpg'"
            :pt="{image: {style: 'min-height: 50px; min-width: 50px; height: 50px; width: 50px; object-fit: cover'}}" shape="circle" size="large"/>
        <div class="ml-3">
          <div class="text-sm">Corentin Lechêne</div>
          <div class="flex text-color-secondary text-sm mt-1 align-items-center">
            <i class="pi pi-clock mr-1"></i>
            <small>Juste maintenant</small>
          </div>
        </div>
      </div>
      <div class="flex gap-2">
        <SplitButton :model="createPostOptions" label="Publier"></SplitButton>
      </div>
    </div>
    <InputFile v-if="addImage" accept="image/*" class="mb-3" max-height-preview="5"/>
    <Textarea v-model="content" class="w-full" placeholder="Contenu" rows="3" variant="filled"/>
  </div>
</template>

<style scoped>
</style>