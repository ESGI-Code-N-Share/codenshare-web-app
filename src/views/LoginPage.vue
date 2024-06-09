<script lang="ts" setup>

import {ref} from "vue";
import {ToastService} from "@/services/toast.service";
import {useToast} from "primevue/usetoast";
import {useRouter} from "vue-router";
import ResetPasswordRequestDialog from "@/components/dialogs/ResetPasswordRequestDialog.vue";
import AuthPage from "@/components/auth/AuthPage.vue";
import {useUserStore} from "@/stores/user.store";

const toastNotifications = new ToastService(useToast());
const router = useRouter();

const loading = ref(false);
const openResetPasswordDialog = ref(false);

const email = ref('');
const password = ref('');
const stayLogin = ref(false);

const emailError = ref('');
const passwordError = ref('');

function isLoginFormValid(): boolean {
  let isValid = true;

  if (!email.value) {
    emailError.value = 'L\'email est requis';
    isValid = false;
  }

  if (!password.value) {
    passwordError.value = 'Le mot de passe est requis';
    isValid = false;
  }

  return isValid;
}

function resetErrors() {
  emailError.value = '';
  passwordError.value = '';
}


async function onSubmitLoginForm() {
  try {
    loading.value = true;
    resetErrors();

    if (!isLoginFormValid()) {
      toastNotifications.showError('Veuillez vérifier les erreurs dans le formulaire');
      return;
    }

    const userStore = useUserStore();
    await userStore.login(email.value, password.value);

    if (userStore.error) {
      toastNotifications.showError(userStore.error);
    } else {
      toastNotifications.showSuccess('Connexion réussie');
      await router.push({ name: 'home' });
    }
  } catch (e) {
    console.error(e);
    toastNotifications.showError('Une erreur est survenue');
  } finally {
    loading.value = false;
  }
}

// todo remove this function in production
async function onSubmitAdminLoginForm() {
  try {
    const userStore = useUserStore();
    await userStore.login('admin@cns.fr', 'adminfiters');
    toastNotifications.showSuccess('Connexion réussie');
    await router.push({name: 'home'});
  } catch (e) {
    console.error(e);
  }
}


</script>

<template>
  <AuthPage>
    <div class="w-full h-full m-auto max-w-30rem">
      <div class="flex flex-column justify-content-center h-full p-4 surface-card border-round-3xl"
           style="min-height: 43rem">
        <div class="text-center mb-5 sm:mb-7">
          <img alt="Image" class="mb-3" height="50" src="/src/assets/vue.svg"/>
          <div class="text-900 text-2xl sm:text-3xl font-medium mb-3">Content de te revoir !</div>
          <span class="text-600 font-medium line-height-3">Pas encore de compte ?</span>
          <a class="font-medium ml-2 gradient-text-primary cursor-pointer"
             @click="$router.push('/register')">Par ici.</a>
        </div>

        <form ref="registerFormRef" class="flex flex-column gap-3">
          <InputText
              v-model="email"
              v-tooltip.bottom="emailError"
              inputmode="email"
              :invalid="!!emailError"
              class="w-full"
              placeholder="john.doe@email.com"
              type="email"
              @update:modelValue="emailError = ''"
          />
          <Password
              v-model="password"
              v-tooltip.bottom="passwordError"
              :invalid="!!passwordError"
              class="w-full"
              placeholder="Mot de passe"
              toggleMask
              @update:modelValue="passwordError = ''"
          />

          <div class="flex align-items-center justify-content-between">
            <div class="flex align-items-center">
              <Checkbox
                  id="cgu"
                  v-model="stayLogin"
                  binary
                  class="mr-2"
              />
              <label class="text-sm" for="cgu">Rester connecté</label>
            </div>
            <div class="text-sm text-blue-600" @click="openResetPasswordDialog = true">Mot de passe oublié ?</div>
          </div>

          <Button
              :loading="loading"
              class="gradient-bg-primary justify-content-center mt-1"
              icon-pos="right"
              label="Se connecter"
              @click="onSubmitLoginForm()"
          />
          <Button
              :loading="loading"
              class="gradient-bg-primary justify-content-center mt-1"
              icon-pos="right"
              label="Se connecter avec l'admin"
              @click="onSubmitAdminLoginForm()"
          />
        </form>

        <Divider>
          <span class="text-600">Ou</span>
        </Divider>

        <div>
          <div class="flex">
            <Button class="w-full bg-white" icon="pi pi-google" label="Se connecter avec Google"/>
          </div>
          <div class="flex mt-2">
            <Button class="w-full bg-black-alpha-50 text-white" icon="pi pi-google" label="Se connecter avec Github"/>
          </div>
        </div>
      </div>
    </div>
    <ResetPasswordRequestDialog v-model:isOpen="openResetPasswordDialog"/>
  </AuthPage>
</template>

<style scoped>

</style>