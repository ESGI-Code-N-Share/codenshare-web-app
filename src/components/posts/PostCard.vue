<script lang="ts" setup>

import {onMounted, ref} from "vue";
import hljs from 'highlight.js';
import 'highlight.js/styles/atelier-dune-dark.css';
import 'highlight.js/lib/languages/javascript';
import InfoCard from "@/components/cards/InfoCard.vue";
import {Post} from "@/models";
import {useUserStore} from "@/stores/user.store";
import dayjs from 'dayjs/esm/index.js'
import {CodeNSharePostApi} from "@/api/codenshare";


interface PostCardProps {
  post: Post
}

const props = defineProps<PostCardProps>();
const emit = defineEmits(['onDeleted']);


const userStore = useUserStore();
const currentUser = userStore.currentUser;

const imageNotFound = ref(false);
const menuEditPost = ref();
const editPostOptions = ref([
  {
    label: 'Importer le programme',
    icon: 'pi pi-upload',
    async command() {
      //todo import program
    }
  },
  {
    separator: true
  },
  {
    label: 'Supprimer',
    icon: 'pi pi-trash',
    class: 'text-color-danger',
    async command() {
      try {
        await CodeNSharePostApi.delete(props.post.postId);
        emit('onDeleted', props.post.postId);
      } catch (e) {
        console.error(e);
      }
    }
  }
])


onMounted(() => {
  const {post} = props;

  editPostOptions.value.shift(); //todo import program
  // if(!post.program || post.program.visibility === 'private') {
  //   editPostOptions.value.shift();
  // }

  if (post.author.userId !== currentUser!.userId) {
    editPostOptions.value.pop();
    editPostOptions.value.pop();
  }

  hljs.highlightAll();
});


const openEditPost = (event: Event) => {
  menuEditPost.value.toggle(event);
}

</script>

<template>
  <div class="flex flex-column gap-3 border-round-xl post-card"
       style="padding: 0.75em 0.75em 1em; background: var(--gray-900);">
    <InfoCard
        :avatar-url="post.author.avatar"
        :subtitle="dayjs(post.postedAt).format('DD MMM YYYY HH:mm')"
        :title="`${post.author.firstname} ${post.author.lastname}`"
        subtitle-icon="pi-clock"
        @onAvatarClick="$router.push(`/app/profile/qsdqsd`)"
    >
      <template #button>
        <Button aria-label="more-options" icon="pi pi-ellipsis-v" severity="secondary" @click="openEditPost($event)"/>
        <Menu ref="menuEditPost" :model="editPostOptions" popup/>
      </template>
    </InfoCard>
    <div class="flex flex-column gap-2 px-1">
      <div class="text-lg m-0">{{ post.title }}</div>
      <div class="text-color-secondary pb-2">{{ post.content }}</div>
      <div v-if="post.image && !imageNotFound" class="w-full h-full border-1 border-gray-500 border-round-xl">
        <img
            v-if="!imageNotFound"
            :src="post.image"
            alt="post-image"
            class="w-full h-full max-h-15rem border-round bg-gray-800 opacity-50 vertical-align-top"
            style="object-fit: contain"
            @error="imageNotFound = true"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>