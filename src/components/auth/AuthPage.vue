<script lang="ts" setup>

</script>

<template>
  <section class="h-screen w-screen p-1">
    <div class="container p-3 h-full m-auto">
      <Toast class="sm:w-auto" position="top-right" style="width: 85%;"/>
      <slot></slot>
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