<script lang="ts" setup>
import { useRouter } from 'vue-router'
import AuthPage from "@/components/auth/AuthPage.vue";

const router = useRouter()

function goToLogin() {
  router.push({ name: 'login' })
}
</script>

<template>
  <AuthPage>
    <div class="w-full h-full m-auto max-w-30rem">
      <div class="flex flex-column justify-content-center h-full p-4 surface-card border-round-3xl"
           style="min-height: 43rem">
        <div class="text-center mb-5 sm:mb-7">
          <img alt="Image" class="mb-3" height="150" src="/src/assets/logo.png"/>
          <div class="text-900 text-2xl sm:text-3xl font-medium mb-3">Email Verified Successfully</div>
          <span class="text-600 font-medium line-height-3">Your email has been verified successfully.</span>
        </div>

        <Button
            class="gradient-bg-primary justify-content-center mt-4 w-full"
            label="Go to Login"
            @click="goToLogin"
        />
      </div>
    </div>
  </AuthPage>
</template>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}
</style>
