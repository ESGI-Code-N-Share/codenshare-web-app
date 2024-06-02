<script lang="ts" setup>

import {onMounted, ref} from "vue";
import PostCard from "@/components/posts/PostCard.vue";
import PostNew from "@/components/posts/PostNew.vue";
import {Post} from "@/models";
import {CodeNSharePostApi} from "@/api/codenshare";

const baseUrl = ref(import.meta.env.VITE_API_URL);
const mode = ref(import.meta.env.MODE);

const posts = ref<Post[]>([]);

onMounted(async () => {
  console.log(import.meta.env);
  await fetchPosts();
});

const fetchPosts = async () => {
  try {
    posts.value = await CodeNSharePostApi.getLatestPosts();
  } catch (e) {
    console.error(e);
  }
}
</script>

<template>
  <div class="col flex flex-column gap-4 p-2">
    <h2 class="p-0 m-0">Fil d'actualités</h2>
    <div class="flex flex-column gap-3 w-full">
      <PostNew @on-published="fetchPosts()"/>

      <!-- Post    -->
      <div class="flex flex-column gap-3">
        <PostCard v-for="post in posts" :key="post.postId" :post="post" @on-deleted="fetchPosts()"/>
      </div>

      <!-- End of feed    -->
      <div class="flex justify-content-center">
        <Divider class="my-0 p-0" style="width: 75%;" type="dashed"/>
      </div>
      <div class="flex justify-content-center p-3 border-round-xl surface-card">
        Vous avez atteint la fin du fil d'actualités
      </div>
    </div>

  </div>
</template>

<!--<div class="flex gap-3 w-full h-full">
&lt;!&ndash; Content &ndash;&gt;
<div class="col md:surface-card border-round-xl md:p-4 h-full">
  <h2 class="text-xl ml-2 mt-0 pt-2">Fil d'actualités</h2>
  &lt;!&ndash; New message    &ndash;&gt;
  <PostNew/>

  <div class="py-2"></div>

  &lt;!&ndash; Posts     &ndash;&gt;
  <div class="flex flex-column gap-3">
    <PostCard v-for="post in posts" :key="post.id" :post="post"/>
  </div>

</div>

&lt;!&ndash; Right Content &ndash;&gt;
<div class="hidden lg:block lg:col-5 xl:col-4 surface-card border-round-xl p-4">
  <h3 class="text-lg ml-2 mt-0">Suggestion d'amis</h3>

  <div class="flex flex-column gap-2">
    <div v-for="i in 5" class="flex justify-content-between align-items-center p-2 border-round-lg"
         style="background-color: #121212;">
      <div class="flex align-items-center">
        <Avatar :image="'https://randomuser.me/api/portraits/men/9.jpg'" shape="circle" size="large"/>
        <div class="ml-2">
          <div>L. Corentin</div>
          <div class="text-color-secondary text-sm">Suivis par Elena</div>
        </div>
      </div>
      <Button aria-label="add-friend" icon="pi pi-user-plus" severity="secondary"/>
    </div>
  </div>

  <Divider class="my-4"/>

</div>
</div>-->

<style scoped>

</style>