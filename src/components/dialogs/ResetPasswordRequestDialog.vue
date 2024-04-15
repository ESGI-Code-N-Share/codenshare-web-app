<script lang="ts" setup>

import {ref} from "vue";
import {useToast} from "primevue/usetoast";
import {ToastService} from "@/services/toast.service";


const toastNotifications = new ToastService(useToast());

const isOpen = defineModel<boolean>('isOpen', {
  type: Boolean,
  default: false
});
const loading = ref(false);
const success = ref(false);

const email = ref('');

const emailError = ref('');


function onSubmitResetPasswordRequest() {
  loading.value = true;

  if (!email.value) {
    emailError.value = "L'email est requis";
    loading.value = false;
    return;
  }

  try {
    // todo call api to send reset password request
    toastNotifications.showSuccess('Demande de réinitialisation de mot de passe envoyée avec succès');
    success.value = true;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
}

</script>

<template>
  <Dialog
      v-model:visible="isOpen"
      :draggable="false"
      :style="{ width: '25rem' }"
      closable
      header="Mot de passe oublié ?"
      modal
      @afterHide="success = false; email = ''; emailError = '';"
  >
    <div class="flex px-2 h-full">
      <form ref="registerFormRef" class="flex flex-column gap-3 w-full">
        <InlineMessage v-if="success" class="w-full" severity="success">Un email vous a été envoyé</InlineMessage>
        <InputText
            v-model="email"
            v-tooltip.bottom="emailError"
            :disabled="success"
            :invalid="!!emailError"
            class="w-full"
            inputmode="email"
            placeholder="john.doe@email.com"
            type="email"
            @update:modelValue="emailError = ''"
        />

        <Button
            :disabled="success"
            :loading="loading"
            class="w-full mt-1"
            label="Envoyer un lien"
            @click="onSubmitResetPasswordRequest()"
        />
      </form>
    </div>
  </Dialog>
</template>

<style scoped>

</style>