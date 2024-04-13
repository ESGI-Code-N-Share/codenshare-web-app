<script lang="ts" setup>

import {ref} from "vue";
import {AuthService} from "@/services/auth.service";
import {FirebaseErrorMessage} from "@/services/firebase.error.message.ts";
import {ErrorMessage} from "@/services/error.message.ts";

const authService = new AuthService();

const checked = ref(false);
const email = ref('');
const password = ref('');

function onClickedSignUp() {
  authService.signUp(email.value, password.value)
      .then(async (link) => {
        console.log("User created")
        console.log(`Un mail vous a été envoyé pour confirmer votre adresse mail : ${link}`)
      })
      .catch((error) => {
        if(error.message == FirebaseErrorMessage.EMAIL_ALREADY_EXISTS) {
          console.error(ErrorMessage.EMAIL_ALREADY_EXISTS)
        }

        if(error.message == FirebaseErrorMessage.INVALID_EMAIL) {
          console.error(ErrorMessage.INVALID_EMAIL)
        }

        if(error.message == ErrorMessage.INVALID_INFORMATIONS) {
          console.error(ErrorMessage.INVALID_INFORMATIONS)
        }

        if(error.message == FirebaseErrorMessage.INVALID_PASSWORD) {
          console.error(ErrorMessage.INVALID_INFORMATIONS)
        }

      })
}

</script>

<template>
  <div class="flex justify-content-center align-items-center h-full">
    <div class="surface-card p-4 shadow-2 border-round w-full md:w-6 md:p-6 lg:p-8 ">
      <div class="text-center mb-5">
        <img alt="Image" class="mb-3" height="50" src="/src/assets/vue.svg"/>
        <div class="text-900 text-3xl font-medium mb-3">Welcome</div>
        <span class="text-600 font-medium line-height-3">Already have an account?</span>
        <a class="font-medium no-underline ml-2 text-blue-500 cursor-pointer">Sign in here!</a>
      </div>

      <div>
        <label class="block text-900 font-medium mb-2" for="email1">Email</label>
        <InputText v-model="email" id="email1" class="w-full mb-3" type="email"/>

        <label class="block text-900 font-medium mb-2" for="password1">Password</label>
        <InputText v-model="password" id="password1" class="w-full mb-3" type="password"/>

        <div class="flex align-items-center justify-content-between mb-6">
          <div class="flex align-items-center">
            <Checkbox id="rememberme1" v-model="checked" :binary="true" class="mr-2"></Checkbox>
            <label for="rememberme1">Remember me</label>
          </div>
          <a class="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer">Forgot password?</a>
        </div>

        <Button class="w-full" icon="pi pi-user" label="Sign Up" @click="onClickedSignUp()"></Button>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>