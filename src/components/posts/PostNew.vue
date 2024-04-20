<script lang="ts" setup>

import {ref} from "vue";
import {MenuItem} from "primevue/menuitem";

const menuShort = ref();
const menuLong = ref();

const createPostOptionsLong = ref<MenuItem[]>([
  {
    label: 'Options',
    items: [
      {
        label: 'Ajouter une image',
        icon: 'pi pi-image'
      },
      {
        label: 'Ajouter un programme',
        icon: 'pi pi-book'
      },
      {
        label: 'Annuler',
        icon: 'pi pi-refresh'
      }
    ]
  }
]);

const createPostOptionsShort = ref<MenuItem[]>([
  {
    label: 'Options',
    items: [
      {
        label: 'Annuler',
        icon: 'pi pi-refresh',
      }
    ]
  }
]);

function createPostToggle(event: Event, type: 'short' | 'long') {
  if (type === 'short') {
    menuShort.value.toggle(event);
  } else {
    menuLong.value.toggle(event);
  }
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
      <div>
        <div class="hidden md:flex gap-2">
          <Button
              aria-controls="overlay_menu_post"
              aria-haspopup="true"
              icon="pi pi-image"
              severity="secondary"
              type="button"
          />
          <Button
              aria-controls="overlay_menu_post"
              aria-haspopup="true"
              class=""
              icon="pi pi-book"
              severity="secondary"
              type="button"
          />
          <Button
              aria-controls="overlay_post_create_short"
              aria-haspopup="true"
              class=""
              icon="pi pi-ellipsis-v"
              severity="secondary"
              type="button"
              @click="createPostToggle($event, 'short')"
          />
          <Menu id="overlay_post_create_short" ref="menuShort" :model="createPostOptionsShort" :popup="true"/>
        </div>
        <Button
            aria-controls="overlay_post_create_long"
            aria-haspopup="true"
            class="md:hidden"
            icon="pi pi-ellipsis-v"
            severity="secondary"
            type="button"
            @click="createPostToggle($event, 'long')"
        />
        <Menu id="overlay_post_create_long" ref="menuLong" :model="createPostOptionsLong" :popup="true"/>
      </div>
    </div>
    <Textarea class="w-full" placeholder="Description" rows="3" variant="filled"/>
  </div>
</template>

<style scoped>
.my-bg {
  background-color: #121212;
}
</style>