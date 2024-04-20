<script lang="ts" setup>


const onAdvancedUpload = () => {
  console.log('onAdvancedUpload');
};

</script>

<template>
  <FileUpload
      :maxFileSize="1000000"
      :pt="{root: 'border-1 border-dashed border-gray-500 border-round'}"
      :show-cancel-button="false"
      :show-upload-button="false"
      accept="image/*"
      class=""
      name="demo[]"
      url="/api/upload"
      @upload="onAdvancedUpload()"
  >
    <template #content="{files}">
      <img v-if="files.length > 0" :src="files[0].objectURL" alt="image" class="w-full h-full"/>
    </template>
    <template #empty>
      <p>Déposez votre image</p>
    </template>
  </FileUpload>
</template>

<style scoped>

</style>