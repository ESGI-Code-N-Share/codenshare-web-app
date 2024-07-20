<script lang="ts" setup>

import {ref} from "vue";
import {useI18n} from "vue-i18n";
import {useUserStore} from "@/stores/user.store";
import InputFile from "@/components/files/InputFile.vue";
import {ToastService} from "@/services/toast.service";
import {useToast} from "primevue/usetoast";

const i18n = useI18n();
const userStore = useUserStore();
const currentUser = userStore.currentUser;
const toastNotifications = new ToastService(useToast());


const loading = ref({save: false});

const user = ref({...currentUser});
const languages = [
  {name: 'Français', code: 'fr'},
  {name: 'English', code: 'en'},
  {name: 'Español', code: 'es'},
  {name: 'Deutsch', code: 'de'},
  {name: 'Português', code: 'pt'},
  {name: '中文', code: 'zh'},
];

const selectedLang = ref(languages.find(lang => lang.code === i18n.locale.value));

function setLanguage(language: string) {
  i18n.locale.value = language;
  localStorage.setItem('language', language);
}

const onSaveUser = async () => {
  try {
    loading.value.save = true;
    if (!user.value.firstname || !user.value.lastname || !user.value.avatar) {
      toastNotifications.showError(i18n.t('setting.errors.empty_fields'));
      return;
    }
    await userStore.updateUser({
      firstname: user.value.firstname,
      lastname: user.value.lastname,
      avatar: user.value.avatar,
    });
    toastNotifications.showSuccess(i18n.t('setting.success.save'));
  } catch (e) {
    console.error(e);
    toastNotifications.showError(i18n.t('setting.errors.save'));
  } finally {
    loading.value.save = false;
  }
}

</script>

<template>
  <div class="col flex flex-column gap-2 p-0">
    <h2 class="p-2 pt-4 m-0">{{ $t('global.pages.settings') }}</h2>
    <div class="flex flex-column md:flex-row justify-content-between px-3 w-full h-full surface-card border-round-xl">
      <!-- account     -->
      <div v-if="user" class="col-12 md:col-5 flex flex-column gap-2 p-0">
        <h3>{{ $t('setting.account') }}</h3>
        <div class="flex flex-column gap-4">
          <div class="flex flex-column gap-2">
            <InputFile
                v-model:file-url="user.avatar"
                accept="image/*"
                max-height-preview="7"
                @onFileSelected="user.avatar = $event.fileUrl"
                uploadable
            />
          </div>
          <div class="flex flex-column gap-2">
            <div>{{ $t('setting.forms.firstname.label') }}</div>
            <InputText v-model="user.firstname" :placeholder="$t('setting.forms.firstname.placeholder')"/>
          </div>
          <div class="flex flex-column gap-2">
            <div>{{ $t('setting.forms.lastname.label') }}</div>
            <InputText v-model="user.lastname" :placeholder="$t('setting.forms.lastname.placeholder')"/>
          </div>
          <div class="flex flex-column gap-2">
            <div>{{ $t('setting.forms.email.label') }}</div>
            <InputText v-model="user.email" :placeholder="$t('setting.forms.email.placeholder')" readonly/>
          </div>
          <div class="flex flex-column gap-2">
            <div>{{ $t('setting.forms.email.label') }}</div>
            <Textarea v-model="user.overview" :placeholder="$t('setting.forms.overview.placeholder')" readonly/>
          </div>

          <Button
              :label="$t('setting.buttons.save')"
              :loading="loading.save"
              class="w-full"
              severity="success"
              @click="onSaveUser()"
          />
        </div>
      </div>

      <div class="flex justify-content-center pt-4 pb-2">
        <Divider class="my-0 p-0" style="width: 75%; height: 1px;" type="dashed"/>
      </div>

      <!-- App Settings     -->
      <div class="col-12 md:col-5 flex flex-column gap-2 p-0 pb-4">
        <h3>{{ $t('setting.application') }}</h3>
        <div class="flex flex-column gap-4">
          <div class="flex flex-column gap-2">
            <div>{{ $t('global.forms.language.label') }}</div>
            <Dropdown
                v-model="selectedLang"
                :options="languages"
                :placeholder="$t('global.forms.language.placeholder')"
                optionLabel="name"
                @update:model-value="setLanguage($event.code)"
            />
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>

</style>