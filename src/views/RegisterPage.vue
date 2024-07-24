<script lang="ts" setup>

import {ref} from "vue";
import {ToastService} from "@/services/toast.service";
import {useToast} from "primevue/usetoast";
import AuthPage from "@/components/auth/AuthPage.vue";
import dayjs from "dayjs/esm/index.js";
import {CodeNShareAuthApi} from "@/api/codenshare";
import {useRouter} from "vue-router";
import {userCreateSchema} from "@/validations/user-form.validation";
import * as yup from "yup";

dayjs.locale(localStorage.getItem('language') || 'fr');

const router = useRouter();
const toastNotifications = new ToastService(useToast())

const loading = ref(false);

const isProduction = import.meta.env.MODE === 'production';

const firstname = ref(isProduction ? '' : 'John');
const lastname = ref(isProduction ? '' : 'Doe');
const birthDate = ref(new Date(new Date().getFullYear() - 18, 0, 1));
const email = ref(isProduction ? '' : 'john.doe@email.fr');
const password = ref(isProduction ? '' : 'admincns');
const cgu = ref(!isProduction);

const formErrors = ref({
  firstname: '',
  lastname: '',
  birthDate: '',
  email: '',
  password: '',
  cgu: '',
  reset() {
    this.firstname = '';
    this.lastname = '';
    this.birthDate = '';
    this.email = '';
    this.password = '';
    this.cgu = '';
  }
});

async function onSubmitRegisterForm() {
  try {
    loading.value = true;
    formErrors.value.reset();

    console.log(birthDate.value)
    const createUser = await userCreateSchema.validate({
      firstname: firstname.value,
      lastname: lastname.value,
      birthdate: birthDate.value,
      email: email.value,
      password: password.value,
      cgu: cgu.value
    }, {abortEarly: false});

    await CodeNShareAuthApi.register(
        createUser.firstname,
        createUser.lastname,
        dayjs(createUser.birthdate).format('YYYY-MM-DD'),
        createUser.email,
        createUser.password
    );

    toastNotifications.showSuccess("Votre compte a été créé avec succès");
    await router.push({name: 'login'});
  } catch (e: any | yup.ValidationError) {
    console.error(e);
    if (e instanceof yup.ValidationError) {
      e.errors.forEach(error => {
        if (error.includes('firstname')) formErrors.value.firstname = error;
        if (error.includes('lastname')) formErrors.value.lastname = error;
        if (error.includes('birthdate')) formErrors.value.birthDate = error;
        if (error.includes('email')) formErrors.value.email = error;
        if (error.includes('password')) formErrors.value.password = error;
        if (error.includes('cgu')) formErrors.value.cgu = error;
      });
      toastNotifications.showError("Veuillez vérifier les erreurs dans le formulaire");
    } else {
      toastNotifications.showError(e.message);
    }
  } finally {
    loading.value = false;
    toastNotifications.showSuccess("Un mail de confirmation vous a été envoyé.");
  }
}


</script>
<template>
  <AuthPage>
    <div class="flex w-full h-full surface-card border-round-3xl p-4 m-auto">
      <div class="flex flex-column gap-5 justify-content-center col-12 md:col-6 xl:col-5 p-1 sm:p-8 md:p-5 lg:p-6">
        <div class="md:mb-4">
          <h1 class="text-4xl lg:text-5xl mb-4 lg:col-8 p-0">Créer ton compte</h1>
          <div class="text-white-alpha-50 text-lg font-semibold mb-2">
            <span class="mr-1">Déjà inscrit ?</span>
            <span class="gradient-text-primary hover:underline text-base cursor-pointer"
                  @click="$router.push('/login')">Connecte-toi.</span>
          </div>
        </div>
        <div>
          <form ref="registerFormRef" class="flex flex-column gap-3">
            <div class="flex gap-3">
              <InputText
                  v-model="firstname"
                  v-tooltip.bottom="formErrors.firstname"
                  :invalid="!!formErrors.firstname"
                  class="w-full"
                  placeholder="Prénom"
                  @update:modelValue="formErrors.firstname = ''"
              />
              <InputText
                  v-model="lastname"
                  v-tooltip.bottom="formErrors.lastname"
                  :invalid="!!formErrors.lastname"
                  class="w-full"
                  placeholder="Nom"
                  @update:modelValue="formErrors.lastname = ''"
              />
            </div>
            <Calendar
                v-model="birthDate"
                v-tooltip.bottom="formErrors.birthDate"
                :invalid="!!formErrors.birthDate"
                class="w-full"
                placeholder="Date de naissance"
                @update:modelValue="formErrors.birthDate = ''"
            />
            <InputText
                v-model="email"
                v-tooltip.bottom="formErrors.email"
                :invalid="!!formErrors.email"
                class="w-full"
                inputmode="email"
                placeholder="john.doe@email.com"
                type="email"
                @update:modelValue="formErrors.email = ''"
            />
            <Password
                v-model="password"
                v-tooltip.bottom="formErrors.password"
                :invalid="!!formErrors.password"
                class="w-full"
                placeholder="*********"
                @update:modelValue="formErrors.password = ''"
            />

            <div class="flex align-items-center">
              <Checkbox
                  id="cgu"
                  v-model="cgu"
                  v-tooltip.bottom="formErrors.cgu"
                  :invalid="!!formErrors.cgu"
                  binary
                  class="mr-2"
                  @update:modelValue="formErrors.cgu = ''"
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