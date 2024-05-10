<script lang="ts" setup>

import {ref} from "vue";
import InputFile from "@/components/files/InputFile.vue";
import InfoCard from "@/components/cards/InfoCard.vue";

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

const menuCreatePost = ref();

const addImage = ref(false);
const addProgram = ref(false);

const title = ref('');
const content = ref('');

const createPostOptions = ref<MenuItem[]>([
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


const openCreatePost = (event: Event) => {
  menuCreatePost.value.toggle(event);
}

</script>

<template>
  <div id="post-new" class="flex flex-column gap-3 p-3 border-round-xl" style="background: var(--gray-900);">
    <InfoCard avatar-url="https://randomuser.me/api/portraits/men/9.jpg" subtitle="Juste maintenant" subtitle-icon="pi-clock"
              title="Corentin Lechêne">
      <template #button>
        <Button aria-label="more-options" icon="pi pi-ellipsis-v" severity="secondary" @click="openCreatePost($event)"/>
        <Menu ref="menuCreatePost" :model="createPostOptions" popup/>
      </template>
    </InfoCard>
    <div class="flex flex-column gap-2">
      <InputText v-model="title" class="w-full" placeholder="Titre du post" variant="filled"/>
      <Textarea v-model="content" class="w-full" placeholder="Contenu" rows="3" variant="filled"/>
      <InputFile v-if="addImage" accept="image/*" class="" max-height-preview="5"/>
    </div>
  </div>
</template>

<style scoped>
@media (min-width: 768px) {
  #post-new {
    background-color: #121212 !important;
  }
}
</style>