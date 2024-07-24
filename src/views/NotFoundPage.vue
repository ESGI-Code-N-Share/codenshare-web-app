<template>
  <div class="col flex flex-column justify-content-center align-items-center gap-4 p-2">
    <h1>{{$t('global.pages.not_found')}}</h1>
    <p>{{ $t('global.pages.not_found_description') }}</p>
    <router-link to="/">{{ $t('global.pages.go_home') }}</router-link>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>

.not-found h1 {
  font-size: 3em;
  margin-bottom: 20px;
}

.not-found p {
  font-size: 1.5em;
  margin-bottom: 20px;
}

.not-found a {
  font-size: 1.2em;
  color: #42b983;
  text-decoration: none;
}

.not-found a:hover {
  text-decoration: underline;
}
</style>