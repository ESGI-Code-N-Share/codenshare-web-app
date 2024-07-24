<script lang="ts" setup>

import {onMounted, ref} from "vue";
import PostCard from "@/components/posts/PostCard.vue";
import PostNew from "@/components/posts/PostNew.vue";
import {Post, Program} from "@/models";
import {CodeNSharePostApi, CodeNShareProgramApi} from "@/api/codenshare";
import {ToastService} from "@/services/toast.service";
import {useToast} from "primevue/usetoast";
import {useRoute} from "vue-router";
import ProgramCard from "@/components/programs/ProgramCard.vue";

const route = useRoute();
const toastNotifications = new ToastService(useToast());

const posts = ref<Post[]>([]);
const loading = ref({fetch: false})

const post = ref<Post>();
const openPostSharedModal = ref(false);

const program = ref<Program>();
const openProgramSharedModal = ref(false);

onMounted(async () => {
  if (route.query?.post) {
    openPostSharedModal.value = true;
    const postId = route.query.post as string;
    try {
      post.value = await CodeNSharePostApi.getById(postId);
    } catch (e) {
      console.error(e);
      openPostSharedModal.value = false;
    }
  } else if (route.query?.program) {
    openProgramSharedModal.value = true;
    const programId = route.query.program as string;
    try {
      program.value = await CodeNShareProgramApi.get(programId);
    } catch (e) {
      console.error(e);
      openProgramSharedModal.value = false;
    }
  }

  await fetchPosts();
});

const fetchPosts = async () => {
  try {
    loading.value.fetch = true;
    posts.value = await CodeNSharePostApi.getLatestPosts();
  } catch (e) {
    console.error(e);
    toastNotifications.showError("Une erreur s'est produite lors du chargement des publications");
  } finally {
    loading.value.fetch = false;
  }
}
</script>

<template>
  <div class="col flex flex-column gap-4 p-2">
    <h2 class="p-0 m-0">{{ $t('global.pages.home') }}</h2>
    <div class="flex flex-column gap-3 w-full">
      <PostNew @on-published="fetchPosts()"/>

      <div class="flex justify-content-center">
        <Divider class="my-0 p-0" style="width: 75%;" type="dashed"/>
      </div>

      <!-- Post    -->
      <div v-if="loading.fetch" class="flex justify-content-center align-items-center h-full">
        <ProgressSpinner/>
      </div>
      <div v-else class="flex flex-column gap-3">
        <PostCard v-for="post in posts" :key="post.postId" :post="post" @on-deleted="fetchPosts()"/>
      </div>

      <!-- End of feed    -->
      <div v-if="!loading.fetch" class="flex justify-content-center">
        <Divider class="my-0 p-0" style="width: 75%;" type="dashed"/>
      </div>
      <div v-if="!loading.fetch" class="flex justify-content-center p-3 border-round-xl surface-card">
        {{ $t('post.end_of_post') }}
      </div>
    </div>

    <Dialog v-if="post" v-model:visible="openPostSharedModal" :style="{width: '50vw'}" header="Post" modal>
      <PostCard :post="post"/>
    </Dialog>

    <Dialog v-if="program" v-model:visible="openProgramSharedModal" :style="{width: '50vw'}" header="Program" modal>
      <ProgramCard :program="program"/>
    </Dialog>

  </div>
</template>

<style scoped>

</style>