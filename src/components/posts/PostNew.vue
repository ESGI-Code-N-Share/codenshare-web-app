<script lang="ts" setup>

import {ref} from "vue";
import InputFile from "@/components/files/InputFile.vue";
import InfoCard from "@/components/cards/InfoCard.vue";

const menuCreatePost = ref();

const addImage = ref(false);
const addProgram = ref(false);

const title = ref('');
const content = ref('');

const createPostOptions = ref<any[]>([
  {
    label: 'Options de publication',
    items: [
      {
        label: 'Ajouter une image',
        icon: 'pi pi-image',
        command() {
          addImage.value = true;
          this.disabled = true;
        },
      },
      {
        label: 'Ajouter un programme',
        icon: 'pi pi-book',
        command() {
          addProgram.value = true;
          this.disabled = true;
        },
      },
      {
        separator: true,
      },

    ]
  },
  {
    label: 'Publication',
    items: [
      {
        label: 'Publier',
        icon: 'pi pi-send',
        class: 'border-round text-color-primary',
        style: 'color: #2e7d32',
        command() {
          console.log('Publish post');
        }
      },
      {
        separator: true,
      },
      {
        label: 'Annuler',
        icon: 'pi pi-refresh',
        class: 'border-round text-color-primary',
        style: 'color: #f87171',
        command() {
          addProgram.value = false;
          addImage.value = false;
          title.value = '';
          content.value = '';

          if (createPostOptions.value[0].items) {
            createPostOptions.value[0].items.forEach(item => item.disabled = false);
          }
        }
      }
    ]
  }

]);
const user = ref('https://randomuser.me/api/portraits/men/92.jpg')


const openCreatePost = (event: Event) => {
  menuCreatePost.value.toggle(event);
}

</script>

<template>
  <div class="flex flex-column gap-3 surface-card border-round-xl p-3">
    <InfoCard :avatar-url="user" subtitle="Aujourd'hui" subtitle-icon="pi-clock" title="Corentin Lechene">
      <template #button>
        <Button aria-label="more-options" icon="pi pi-ellipsis-v" severity="secondary" @click="openCreatePost($event)"/>
        <Menu ref="menuCreatePost" :model="createPostOptions" popup/>
      </template>
    </InfoCard>
    <!-- Form   -->
    <div class="flex flex-column gap-2">
      <InputText v-model="title" class="w-full" placeholder="Titre du post" variant="filled"/>
      <Textarea v-model="content" class="w-full" placeholder="Contenu" rows="3" variant="filled"/>
      <InputFile v-if="addImage" accept="image/*" class="" max-height-preview="5"/>
    </div>
  </div>
</template>

<style scoped>

</style>