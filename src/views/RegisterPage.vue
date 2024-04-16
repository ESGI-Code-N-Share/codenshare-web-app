<script lang="ts" setup>

import {ref} from "vue";
import {ToastService} from "@/services/toast.service";
import {useToast} from "primevue/usetoast";
import {AuthService} from "@/services/auth.service.ts";
import AuthPage from "@/components/auth/AuthPage.vue";

const authService = new AuthService();
const toastNotifications = new ToastService(useToast())

const loading = ref(false);

const firstname = ref('');
const lastname = ref('');
const birthDate = ref('');
const email = ref('');
const password = ref('');
const cgu = ref(false);

const firstnameError = ref('');
const lastnameError = ref('');
const birthDateError = ref('');
const emailError = ref('');
const passwordError = ref('');
const cguError = ref('');

// todo add utils functions to validate form
function isRegisterFormValid(): boolean {
  let isValid = true;

  if (!firstname.value) {
    firstnameError.value = 'Le prénom est requis';
    isValid = false;
  }

  if (!lastname.value) {
    lastnameError.value = 'Le nom est requis';
    isValid = false;
  }

  if (!birthDate.value) {
    birthDateError.value = 'La date de naissance est requise';
    isValid = false;
  }

  if (!email.value) {
    emailError.value = 'L\'email est requis';
    isValid = false;
  }

  if (!password.value) {
    passwordError.value = 'Le mot de passe est requis';
    isValid = false;
  }

  if (!cgu.value) {
    cguError.value = 'Vous devez accepter les conditions d\'utilisation';
    isValid = false;
  }

  return isValid;
}

function resetErrors() {
  firstnameError.value = '';
  lastnameError.value = '';
  birthDateError.value = '';
  emailError.value = '';
  passwordError.value = '';
  cguError.value = '';
}

async function onSubmitRegisterForm() {
  try {
    loading.value = true;
    resetErrors();

    if (!isRegisterFormValid()) {
      return toastNotifications.showError("Le formulaire contient des erreurs");
    }

    await authService.register(firstname.value, lastname.value, email.value, password.value)

    toastNotifications.showSuccess("Votre compte a été créé avec succès");
  } catch (e) {
    console.error(e);
    // toastNotifications.showError("Une erreur s'est produite lors de la création de votre compte");
    toastNotifications.showError(e.message);
  } finally {
    loading.value = false;
  }
}


</script>

<template>
  <AuthPage>
    <div class="flex w-full h-full surface-card border-round-3xl p-4 m-autor">
      <div class="flex flex-column gap-5 justify-content-center col-12 md:col-6 xl:col-5 p-1 sm:p-8 md:p-5 lg:p-6">
        <div class="md:mb-4">
          <h1 class="text-4xl lg:text-5xl mb-4 lg:col-8 p-0">Créer ton compte</h1>
          <div class="text-white-alpha-50 text-lg font-semibold mb-2">
            <span class="mr-1">Déjà inscrit ?</span>
            <span class="gradient-text-primary hover:underline text-base"
                  @click="$router.push('/login')">Connecte-toi.</span>
          </div>
        </div>
        <div>
          <form ref="registerFormRef" class="flex flex-column gap-3">
            <div class="flex gap-3">
              <InputText
                  v-model="firstname"
                  v-tooltip.bottom="firstnameError"
                  :invalid="!!firstnameError"
                  class="w-full"
                  placeholder="John"
                  @update:modelValue="firstnameError = ''"
              />
              <InputText
                  v-model="lastname"
                  v-tooltip.bottom="lastnameError"
                  :invalid="!!lastnameError"
                  class="w-full"
                  placeholder="Doe"
                  @update:modelValue="lastnameError = ''"
              />
            </div>
            <Calendar
                v-model="birthDate"
                v-tooltip.bottom="birthDateError"
                :invalid="!!birthDateError"
                class="w-full"
                placeholder="Date de naissance"
                @update:modelValue="birthDateError = ''"
            />
            <InputText
                v-model="email"
                v-tooltip.bottom="emailError"
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

            <div class="flex align-items-center">
              <Checkbox
                  id="cgu"
                  v-model="cgu"
                  v-tooltip.bottom="cguError"
                  :invalid="!!cguError"
                  binary
                  class="mr-2"
                  @update:modelValue="cguError = ''"
              />
              <label class="text-sm" for="cgu">
                <span class="mr-1">J'accepte les</span>
                <a class="text-blue-500 no-underline font-medium cursor-pointer">conditions d'utilisation</a>
              </label>
            </div>

            <Button
                :loading="loading"
                class="gradient-bg-primary justify-content-center"
                icon-pos="right"
                label="Créer mon compte"
                @click="onSubmitRegisterForm()"
            />
          </form>
        </div>

      </div>
      <div class="p-0 h-full col-0 md:col-6 xl:col-7">
        <img
            alt="Image"
            class="h-full border-round-3xl"
            src="/src/assets/images/meeting-office.png"
            style="max-width: 100%; object-fit: cover;"
        />
      </div>
    </div>
  </AuthPage>
</template>

<style scoped>

</style>