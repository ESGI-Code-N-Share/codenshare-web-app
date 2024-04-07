<script lang="ts" setup>

import {ref} from "vue";

const checked = ref(false);


</script>

<template>
  <div class="flex justify-content-center align-items-center h-full">
    <div class="surface-card p-4 shadow-2 border-round w-full md:w-6 md:p-6 lg:p-8 ">
      <div class="text-center mb-5">
        <img alt="Image" class="mb-3" height="50" src="/src/assets/vue.svg"/>
        <div class="text-900 text-3xl font-medium mb-3">Welcome Back</div>
        <span class="text-600 font-medium line-height-3">Don't have an account?</span>
        <a class="font-medium no-underline ml-2 text-blue-500 cursor-pointer">Create today!</a>
      </div>

      <div>
        <label class="block text-900 font-medium mb-2" for="email1">Email</label>
        <InputText id="email1" class="w-full mb-3" type="email"/>

        <label class="block text-900 font-medium mb-2" for="password1">Password</label>
        <InputText id="password1" class="w-full mb-3" type="password"/>

        <div class="flex align-items-center justify-content-between mb-6">
          <div class="flex align-items-center">
            <Checkbox id="rememberme1" v-model="checked" :binary="true" class="mr-2"></Checkbox>
            <label for="rememberme1">Remember me</label>
          </div>
          <a class="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer">Forgot password?</a>
        </div>

        <Button class="w-full" icon="pi pi-user" label="Sign In"></Button>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>