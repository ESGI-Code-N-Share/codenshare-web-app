<script lang="ts" setup>

import {computed, onMounted, ref} from "vue";
import hljs from 'highlight.js';
import 'highlight.js/styles/atelier-dune-dark.css';
import 'highlight.js/lib/languages/javascript';
import InfoCard from "@/components/cards/InfoCard.vue";
import {Post} from "@/models";
import {useUserStore} from "@/stores/user.store";
import dayjs from 'dayjs/esm/index.js'
import {getEditPostOptions} from "@/utils/post.util";
import {CodeNSharePostApi, CodeNShareProgramApi} from "@/api/codenshare";
import {ToastService} from "@/services/toast.service";
import {useToast} from "primevue/usetoast";
import ProgramListItem from "@/components/programs/ProgramListItem.vue";


interface PostCardProps {
  post: Post
}

const props = defineProps<PostCardProps>();
const emit = defineEmits(['onDeleted']);


const userStore = useUserStore();
const currentUser = userStore.currentUser;
const toastNotifications = new ToastService(useToast());

const imageNotFound = ref(false);
const programNotFound = ref(false);
const menuEditPost = ref();
const program = ref();

const editPostOptions = ref();

const isPostLiked = computed(() => {
  if (!currentUser) return false;
  return props.post.likes.some(like => like.userId === currentUser.userId);
});

onMounted(() => {
  if (!currentUser) return;

  if (props.post.programId) {
    CodeNShareProgramApi.get(props.post.programId)
        .then(p => program.value = p)
        .catch(() => programNotFound.value = true);
  }

  const deleteCommand = async () => {
    try {
      await CodeNSharePostApi.delete(props.post.postId);
      toastNotifications.showSuccess('Publication supprimée');
      emit('onDeleted', props.post.postId);
    } catch (e) {
      console.error(e);
    }
  };

  editPostOptions.value = getEditPostOptions(props.post, currentUser, {deleteCommand});
  hljs.highlightAll();
});


const openEditPost = (event: Event) => {
  menuEditPost.value.toggle(event);
}

const likePost = async () => {
  if (!currentUser) return;

  try {
    if (isPostLiked.value) {
      await CodeNSharePostApi.unlike(props.post.postId);
      props.post.likes = props.post.likes.filter(like => like.userId !== currentUser.userId);
    } else {
      await CodeNSharePostApi.like(props.post.postId);
      props.post.likes.push({
        likeId: Math.random().toString(36).substring(7),
        userId: currentUser.userId,
        postId: props.post.postId,
        likedAt: new Date(),
      })
    }
  } catch (e) {
    console.error(e);
    toastNotifications.showError('Erreur lors de la mise à jour de la publication');
  }
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
        @onAvatarClick="$router.push(`/app/profile/${post.author.userId}?loading=true`)"
    >
      <template #button>
        <div class="flex align-items-center" style="width: 50px;">
          <Button
              :class="{'liked': isPostLiked}"
              :icon="isPostLiked ? 'pi pi-heart-fill' : 'pi pi-heart'"
              aria-label="like"
              class="w-2"
              size="small"
              text
              @click="likePost()"
          />
          <div class="ml-1">{{ post.likes.length }}</div>
        </div>

        <Button aria-label="more-options" icon="pi pi-ellipsis-v" severity="secondary" @click="openEditPost($event)"/>
        <Menu ref="menuEditPost" :model="editPostOptions" popup/>
      </template>
    </InfoCard>
    <div class="flex flex-column gap-2 px-1">
      <div class="text-base sm:text-lg m-0">{{ post.title }}</div>
      <div class="text-sm sm:text-base text-color-secondary pb-2">{{ post.content }}</div>
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
      <ProgramListItem v-if="program" :program="program"/>
      <div v-else-if="programNotFound" class="text-color-secondary">{{ $t('post.program_not_found') }}</div>
    </div>
  </div>
</template>

<style scoped>
.liked {
  color: var(--red-500);
}
</style>