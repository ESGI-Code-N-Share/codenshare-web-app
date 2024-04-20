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
  <div>
    <p>codenshare in {{mode}} mode. ({{baseUrl ?? "x"}})</p>
    <Button label="Click me" @click="$router.push('/login')" />

    <PostNew/>
  </div>
</template>

<style scoped>

</style>