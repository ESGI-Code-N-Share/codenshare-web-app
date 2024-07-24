<script lang="ts" setup>

import {computed, onMounted, ref} from "vue";
import 'highlight.js/styles/atelier-dune-dark.css';
import 'highlight.js/lib/languages/javascript';
import InfoCard from "@/components/cards/InfoCard.vue";
import {Post, Program} from "@/models";
import {useUserStore} from "@/stores/user.store";
import dayjs from 'dayjs/esm/index.js'
import {getEditPostOptions} from "@/utils/post.util";
import {CodeNSharePostApi, CodeNShareProgramApi} from "@/api/codenshare";
import {ToastService} from "@/services/toast.service";
import {useToast} from "primevue/usetoast";
import ProgramListItem from "@/components/programs/ProgramListItem.vue";
import {VAceEditor} from "vue3-ace-editor";
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';
import hljs from 'highlight.js';
import ProgramPipelinesGraph from "@/components/programs/ProgramPipelinesGraph.vue";

dayjs.locale(localStorage.getItem('language') || 'fr');

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
const openProgramModal = ref(false);
const menuEditPost = ref();
const program = ref<Program>();

const editPostOptions = ref();

const isPostLiked = computed(() => {
  if (!currentUser) return false;
  return props.post.likes.some(like => like.userId === currentUser.userId);
});

const openProgramModal2 = () => {
  openProgramModal.value = true;
  hljs.highlightAll();
}

onMounted(async () => {
  if (!currentUser) return;

  if (props.post.programId) {
    CodeNShareProgramApi.get(props.post.programId)
        .then(p => program.value = p)
        .catch(() => programNotFound.value = true);
  }

  const shareCommand = () => {
    const url = `${window.location.origin}/app/home?post=${props.post.postId}`;
    navigator.clipboard.writeText(url);
    toastNotifications.showSuccess('Lien copié');
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

  const importProgramCommand = async () => {
    try {
      if (!props.post.programId) return;
      await CodeNShareProgramApi.import(props.post.programId);
      toastNotifications.showSuccess('Programme importé');
    } catch (e: any) {
      console.error(e);
      if (e.message) {
        toastNotifications.showError(e.message);
      } else {
        toastNotifications.showError('Erreur lors de l\'importation du programme');
      }
    }
  }

  editPostOptions.value = await getEditPostOptions(props.post, currentUser, {
    deleteCommand,
    importProgramCommand,
    shareCommand,
  });
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
      toastNotifications.showSuccess('Publication non aimée');
    } else {
      await CodeNSharePostApi.like(props.post.postId);
      props.post.likes.push({
        likeId: Math.random().toString(36).substring(7),
        userId: currentUser.userId,
        postId: props.post.postId,
        likedAt: new Date(),
      })
      toastNotifications.showSuccess('Publication aimée');
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
      <!-- Program     -->
      <ProgramListItem v-if="program" :program="program" class="cursor-pointer" @click="openProgramModal2()"/>
      <div v-else-if="programNotFound" class="text-color-secondary">{{ $t('post.program_not_found') }}</div>
      <!-- Image     -->
      <div v-if="post.image && !imageNotFound"
           class="overflow-hidden w-full h-full border-1 border-gray-500 border-round-xl">
        <img
            v-if="!imageNotFound"
            :src="post.image"
            alt="post-image"
            class="w-full h-full max-h-15rem border-round bg-gray-800 vertical-align-top"
            style="object-fit: contain"
            @error="imageNotFound = true"
        />
      </div>
    </div>

    <Dialog v-if="program" v-model:visible="openProgramModal" :header="program?.name" modal
            style="width: 80vw; height: 80vh;">
      <Splitter class="h-full">
        <SplitterPanel class="flex items-center justify-center">
          <VAceEditor
              v-model:value="program.code"
              class="w-full"
              lang="javascript"
              readonly
              style="height: 43em; min-height: 100%;"
              theme="monokai"
          />
        </SplitterPanel>
        <SplitterPanel class="flex items-center justify-center">
          <ProgramPipelinesGraph :programs="[program]" readonly/>
        </SplitterPanel>
      </Splitter>
    </Dialog>
  </div>
</template>

<style scoped>
.liked {
  color: var(--red-500);
}
</style>