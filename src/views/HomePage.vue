<script lang="ts" setup>

import {onMounted, ref} from "vue";
import PostNew from "@/components/posts/PostNew.vue";
import PostCard from "@/components/posts/PostCard.vue";

const baseUrl = ref(import.meta.env.VITE_API_URL);
const mode = ref(import.meta.env.MODE);

type Post = {
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
  postedAt: string;
}

const postSimple: Post = {
  id: 0,
  user: {
    firstname: 'Corentin',
    lastname: 'Lechêne',
    avatarUrl: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 25) + 1}.jpg`
  },
  title: 'Simple post',
  content: 'This is a simple post',
  postedAt: '15 Jan. 2023'
}
const postWithCodeBlock: Post = {
  id: 1,
  user: {
    firstname: 'Corentin',
    lastname: 'Lechêne',
    avatarUrl: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 25) + 1}.jpg`
  },
  title: 'Post with code block',
  content: 'This is a post with a code block',
  postedAt: '12 Jan. 2023',
  codeBlock: `\nfunction getLines($file) {
  $f = fopen($file, 'r');
  try {
    while ($line = fgets($f)) {
      yield $line;
    }
  } finally {
    fclose($f);
  }
}

foreach (getLines("file.txt") as $n => $line) {
  if ($n > 5) break;
  echo $line;
}`
}
const postWithImage: Post = {
  id: 1,
  user: {
    firstname: 'Corentin',
    lastname: 'Lechêne',
    avatarUrl: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 25) + 1}.jpg`
  },
  title: 'Post with image',
  content: 'This is a post with an image',
  image: 'https://primefaces.org/cdn/primevue/images/galleria/galleria10.jpg',
  postedAt: '2 Jan. 2023',
}
const postWithProgram: Post = {
  id: 2,
  user: {
    firstname: 'Corentin',
    lastname: 'Lechêne',
    avatarUrl: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 25) + 1}.jpg`
  },
  title: 'Post with program',
  content: 'This is a post with a program',
  programId: '1',
  postedAt: '24 Dec. 2022',
}
onMounted(() => {
  console.log(import.meta.env);
});
</script>

<template>
  <div class="flex gap-3 w-full h-full">
    <!-- Content -->
    <div class="col md:surface-card border-round-xl p-2 sm:p-4 h-full">
      <h2 class="text-xl ml-2 mt-0 pt-2">Fil d'actualités</h2>
      <!-- New message    -->
      <PostNew/>

      <div class="py-2"></div>

      <!-- Posts     -->
      <div class="flex flex-column gap-3">
        <PostCard :post="postSimple"/>

        <!--        <PostCard :post="postWithCodeBlock"/>-->

        <PostCard :post="postSimple"/>

        <PostCard :post="postWithImage"/>

        <!--        <PostCard :post="postWithCodeBlock"/>-->
      </div>

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