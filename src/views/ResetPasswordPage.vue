<script lang="ts" setup>

import {onMounted, ref} from "vue";
import {useToast} from "primevue/usetoast";
import {ToastService} from "@/services/toast.service";
import {useRoute, useRouter} from "vue-router";

const route = useRoute();
const router = useRouter();
const toastNotifications = new ToastService(useToast());

const loading = ref(false);
const success = ref(false);
const token = ref('');

const password = ref('');
const repeatPassword = ref('');

const passwordError = ref('');
const repeatPasswordError = ref('');


function onSubmitResetPasswordForm() {
  loading.value = true;

  try {
    if (!password.value) {
      passwordError.value = "Le mot de passe est requis";
      loading.value = false;
      return;
    }

    if (!repeatPassword.value) {
      repeatPasswordError.value = "La confirmation du mot de passe est requise";
      loading.value = false;
      return;
    }

    toastNotifications.showSuccess('Mot de passe réinitialisé avec succès');
    success.value = true;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
}


onMounted(() => {
  token.value = route.query.token as string;

  if (!token.value) {
    toastNotifications.showError('Token invalid');
    // router.push('/login');
  }
});
</script>

<template>
  <section class="h-screen w-screen px-3 py-8">
    <div class="container surface-card border-round-3xl p-3 h-full sm:max-w-max">
      <Toast class="sm:w-auto" position="top-right" style="width: 85%;"/>
      <div class="h-full w-full px-2 py-6 sm:p-6 sm:max-w-max">
        <div class="text-center mb-5">
          <div class="text-900 text-2xl sm:text-3xl font-medium mb-3">Réinitialisation du mot de passe</div>
        </div>

        <form ref="registerFormRef" class="flex flex-column gap-3">
          <Password
              v-model="password"
              v-tooltip.bottom="passwordError"
              :invalid="!!passwordError"
              class="w-full"
              placeholder="Mot de passe"
              toggleMask
              @update:modelValue="passwordError = ''"
          />
          <Password
              v-model="repeatPassword"
              v-tooltip.bottom="repeatPasswordError"
              :invalid="!!repeatPasswordError"
              class="w-full"
              placeholder="Répéter le mot de passe"
              toggleMask
              @update:modelValue="repeatPasswordError = ''"
          />

          <Button
              :disabled="success"
              :loading="loading"
              class="gradient-bg-primary justify-content-center mt-1"
              icon-pos="right"
              label="Réinitialiser le mot de passe"
              @click="onSubmitResetPasswordForm()"
          />
        </form>
      </div>
    </div>
  </section>
</template>

<style scoped>
.container {
  margin-right: auto;
  margin-left: auto;
  max-width: 1200px;
  width: 100%;
}
</style>