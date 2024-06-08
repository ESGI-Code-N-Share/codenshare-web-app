<script lang="ts" setup>

import {onMounted, ref} from "vue";
import PostCard from "@/components/posts/PostCard.vue";
import PostNew from "@/components/posts/PostNew.vue";
import {Post} from "@/models";
import {CodeNSharePostApi} from "@/api/codenshare";
import {ToastService} from "@/services/toast.service";
import {useToast} from "primevue/usetoast";


const toastNotifications = new ToastService(useToast());

const posts = ref<Post[]>([]);
const loading = ref({fetch: false})

onMounted(async () => {
  console.log(import.meta.env);
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
    <h2 class="p-0 m-0">Fil d'actualités</h2>
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
        Vous avez atteint la fin du fil d'actualités
      </div>
    </div>

  </div>
</template>

<style scoped>

</style>