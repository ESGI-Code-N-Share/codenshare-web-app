<script lang="ts" setup>

import {ref} from "vue";
import {useI18n} from "vue-i18n";

const i18n = useI18n();

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

</script>

<template>
  <div>
    <h1>Settings Page</h1>
    <div>langage</div>

    <Dropdown
        v-model="selectedLang"
        :options="languages"
        :placeholder="$t('global.forms.language.placeholder')"
        optionLabel="name"
        @update:model-value="setLanguage($event.code)"
    />
  </div>
</template>

<style scoped>

</style>