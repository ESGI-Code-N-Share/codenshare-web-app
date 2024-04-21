<script lang="ts" setup>

import {ref} from "vue";
import {ToastService} from "@/services/toast.service";
import {useToast} from "primevue/usetoast";
import {useRouter} from "vue-router";
import ResetPasswordRequestDialog from "@/components/dialogs/ResetPasswordRequestDialog.vue";
import {AuthService} from "@/services/auth.service";
import AuthPage from "@/components/auth/AuthPage.vue";
import {ViewHandleErrorService} from "@/services/view.handleError.service";
import {userLoginSchema} from "@/validations/user-form.validation";
import * as yup from "yup";
import {useI18n} from "vue-i18n";

const router = useRouter();
const i18n = useI18n();

const authService = new AuthService();
const viewHandleErrorService = new ViewHandleErrorService();
const toastNotifications = new ToastService(useToast());

const loading = ref(false);
const openResetPasswordDialog = ref(false);

const email = ref('');
const password = ref('');
const stayLogin = ref(false);

const formErrors = ref({
  email: '',
  password: '',
  reset() {
    this.email = '';
    this.password = '';
  }
});


async function onSubmitLoginForm() {
  try {
    loading.value = true;
    formErrors.value.reset();

    await userLoginSchema.validate({
      email: email.value,
      password: password.value,
    }, {abortEarly: false});

    await authService.signIn(email.value, password.value)
    await router.push('/home');
  } catch (e) {
    if (e instanceof yup.ValidationError) {
      e.errors.forEach(error => {
        if (error.includes('email')) formErrors.value.email = error;
        if (error.includes('password')) formErrors.value.password = error;
      });
      toastNotifications.showError(i18n.t('form.errors.count', {count: e.errors.length}));
    } else {
      toastNotifications.showError(await viewHandleErrorService.handleError(e));
    }
  } finally {
    loading.value = false;
  }
}


async function onSubmitGoogleLogin() {
  try {
    await authService.signInWithGoogle()
    toastNotifications.showSuccess('Connexion réussie avec Google');
    await router.push('/home');
  } catch (e: any) {
    toastNotifications.showError(await viewHandleErrorService.handleError(e));
  } finally {
    loading.value = false;
  }

}

async function onSubmitGithubLogin() {
  try {
    await authService.signInWithGithub()
    toastNotifications.showSuccess('Connexion réussie avec Github');
    await router.push('/home');
  } catch (e: any) {
    toastNotifications.showError(await viewHandleErrorService.handleError(e));
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <AuthPage>
    <div class="w-full h-full m-auto max-w-30rem">
      <div class="flex flex-column justify-content-center h-full p-4 surface-card border-round-3xl">
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
              v-tooltip.bottom="$t(formErrors.email)"
              :invalid="!!formErrors.email"
              class="w-full"
              inputmode="email"
              placeholder="john.doe@email.com"
              type="email"
              @update:modelValue="formErrors.email = ''"
          />
          <InputText
              v-model="password"
              v-tooltip.bottom="$t(formErrors.password)"
              :invalid="!!formErrors.password"
              class="w-full"
              inputmode="text"
              placeholder="*********"
              type="password"
              @update:modelValue="formErrors.password = ''"
          />

          <div class="flex align-items-center justify-content-between">
            <div class="flex align-items-center">
              <Checkbox id="cgu" v-model="stayLogin" binary class="mr-2"/>
              <label class="text-sm" for="cgu">Rester connecté</label>
            </div>
            <div class="text-sm text-blue-600" @click="openResetPasswordDialog = true">
              Mot de passe oublié ?
            </div>
          </div>

          <Button
              :loading="loading"
              class="gradient-bg-primary justify-content-center mt-1"
              icon-pos="right"
              label="Se connecter"
              @click="onSubmitLoginForm()"
          />
        </form>

        <Divider>
          <span class="text-600">Ou</span>
        </Divider>

        <div>
          <div class="flex">
            <Button class="w-full bg-white" icon="pi pi-google" label="Se connecter avec Google"
                    @click="onSubmitGoogleLogin()"/>
          </div>
          <div class="flex mt-2">
            <Button class="w-full bg-black-alpha-50 text-white" icon="pi pi-google"
                    label="Se connecter avec Github" @click="onSubmitGithubLogin()"/>
          </div>
        </div>
      </div>
    </div>
    <ResetPasswordRequestDialog v-model:isOpen="openResetPasswordDialog"/>
  </AuthPage>
</template>

<style scoped>

</style>