<script lang="ts" setup>

import {onMounted, ref} from "vue";
import hljs from 'highlight.js';
import 'highlight.js/styles/atelier-dune-dark.css';
import 'highlight.js/lib/languages/javascript';
import InfoCard from "@/components/cards/InfoCard.vue";

const menuEditPost = ref();
const editPostOptions = ref([
  {
    label: 'Modifier',
    icon: 'pi pi-pencil',
    command() {
      console.log('Edit post');
    }
  },
  {
    label: 'Supprimer',
    icon: 'pi pi-trash',
    class: 'text-color-danger',
    command() {
      console.log('Delete post');
    }
  }
])

interface PostCardProps {
  post: {
    id: number;
    user: {
      firstname: string;
      lastname: string;
      avatarUrl: string;
    }
    title: string;
    content: string;
    codeBlock?: string;
    image?: string;
    programId?: string;
    postedAt?: string;
  }
}

const props = defineProps<PostCardProps>();
const emit = defineEmits();


onMounted(() => {
  hljs.highlightAll();
  const {post} = props;
  if (post.programId) {
    editPostOptions.value.unshift({
      label: 'Importer le programme',
      icon: 'pi pi-upload',
      command() {
        console.log('View program');
      }
    });
  }
});


const openEditPost = (event: Event) => {
  menuEditPost.value.toggle(event);
}

</script>

<template>
  <div class="flex flex-column gap-3 border-round-xl post-card"
       style="padding: 0.75em 0.75em 1em; background: var(--gray-900);">
    <InfoCard :avatar-url="post.user.avatarUrl" :subtitle="post.postedAt"
              :title="`${post.user.firstname} ${post.user.lastname}`" subtitle-icon="pi-clock">
      <template #button>
        <Button aria-label="more-options" icon="pi pi-ellipsis-v" severity="secondary" @click="openEditPost($event)"/>
        <Menu ref="menuEditPost" :model="editPostOptions" popup/>
      </template>
    </InfoCard>
    <div class="flex flex-column gap-2 px-2">
      <div class="text-lg m-0">{{ post.title }}</div>
      <div class="text-color-secondary pb-2">{{ post.content }}</div>
      <div v-if="post.image" class="w-full h-full border-1 border-gray-500 border-round-xl">
        <img
            :src="post.image"
            alt="post-image"
            class="w-full h-full max-h-15rem border-round bg-gray-800 opacity-50 vertical-align-top"
            style="object-fit: contain"
        />
      </div>
      <div v-if="post.codeBlock" class="w-full">
        <pre class="m-0">
          <code class="border-round-xl border-1 border-gray-500 border-round-xl px-4">
            {{ post.codeBlock }}
          </code>
        </pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media (min-width: 768px) {
  .post-card {
    background-color: #121212 !important;
  }
}
</style>