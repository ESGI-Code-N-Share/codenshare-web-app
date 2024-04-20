<script lang="ts" setup>

import {onMounted, ref} from "vue";
import PostNew from "@/components/posts/PostNew.vue";

const baseUrl = ref(import.meta.env.VITE_API_URL);
const mode = ref(import.meta.env.MODE);

onMounted(() => {
  console.log(import.meta.env);
});
</script>

<template>
  <div class="flex gap-3 w-full h-full">
    <!-- Content -->
    <div class="col md:surface-card border-round-xl p-2 sm:p-4 h-full">
      <h2 class="text-xl ml-2 mt-0">Fil d'actualités</h2>
      <!-- New message    -->
      <PostNew/>
      <Divider class="my-2"/>

      <!-- Posts     -->
      <div class="p-2">
        <div>Posts...</div>
      </div>
      <PostNew/>
      <PostNew/>
      <PostNew/>
      <PostNew/>
      <PostNew/>

    </div>

    <!-- Right Content -->
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
  </div>
</template>

<style scoped>

</style>