<script lang="ts" setup>

import {ref} from "vue";

const languages = [
  {name: 'Français', code: 'fr'},
  {name: 'English', code: 'en'},
  {name: 'Español', code: 'es'},
  {name: 'Deutsch', code: 'de'},
  {name: 'Português', code: 'pt'},
  {name: '中文', code: 'zh'},
];

const selectedLang = ref(languages[1]);

</script>

<template>
  <div>
    <h1>Settings Page</h1>
    <div>langage</div>

    <Dropdown v-model="selectedLang" :options="languages" optionLabel="name" placeholder="Select a Language"/>
  </div>
</template>

<style scoped>

</style>