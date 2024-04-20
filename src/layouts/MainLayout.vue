<script lang="ts" setup>

import {computed, ref} from "vue";
import MenuSidebar from "@/sidebars/MenuSidebar.vue";
import {useRoute} from "vue-router";

const route = useRoute();

const sidebar = ref(false);


const hideRightContent = computed(() => {
  return !['program', 'messages', 'settings', 'playground'].includes(route?.name as string || '');
});
</script>

<template>
  <section class="w-screen min-h-screen md:px-4">
    <div class="flex flex-column md:flex-row h-full container p-2">

      <!-- Top Col     -->
      <div class="block md:hidden bg-purple-200">
        <div class="flex justify-content-between align-items-center p-3">
          <div>
            <h1 class="text-2xl m-0">CodeNShare</h1>
          </div>
          <div class="flex items-center" @click="sidebar = true">
            <div class="mr-2">
              <Avatar :image="'https://randomuser.me/api/portraits/men/33.jpg'" shape="circle" size="large"/>
            </div>
          </div>
        </div>
      </div>

      <!-- Left Col     -->
      <MenuSidebar class="h-screen hidden md:block lg:col"/>

      <!-- Middle Col     -->
      <div v-if="$route.name === 'program'" class="h-full surface-card p-3 mt-3 border-round-xl col">
        <router-view></router-view>
      </div>
      <div v-else class="h-full surface-card p-3 mt-3 border-round-xl md:col lg:col-6">
        <router-view></router-view>
      </div>

      <!-- Right Col     -->
      <div v-if="hideRightContent" class="hidden lg:block col-3 m-3 p-3 surface-card border-round-xl"
           style="max-height: 95vh">
        <div class="pb-2 h-auto">
          <h3 class="mt-2">Suggestion d'amis</h3>
          <div v-for="i in 5" class="flex justify-content-between align-items-center mb-2 p-1 border-round">
            <div class="flex align-items-center">
              <Avatar :image="'https://randomuser.me/api/portraits/men/9.jpg'" shape="circle" size="large"/>
              <div class="ml-2">
                <div>L. Corentin</div>
                <div class="text-color-secondary text-sm">Suivis par Elena</div>
              </div>
            </div>
            <Button aria-label="add-friend" icon="pi pi-user-plus" severity="secondary"/>
          </div>
        </div>

        <Divider class="my-2"/>
      </div>
    </div>

    <SideBar v-model:visible="sidebar" class="" header="CodeNShare">
      <MenuSidebar/>
    </SideBar>
  </section>
</template>

<style scoped>
.container {
  margin-right: auto;
  margin-left: auto;
  max-width: 1500px;
  width: 100%;
}
</style>