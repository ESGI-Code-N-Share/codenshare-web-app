<script lang="ts" setup>

import {onMounted, onUnmounted, ref} from "vue";
import {useRoute} from "vue-router";
import MenuSidebar from "@/sidebars/MenuSidebar.vue";

const route = useRoute();

const sidebar = ref(false);
const isLgMd = ref(false)


onMounted(() => {
  window.addEventListener('resize', onResize);
  onResize();
});

onUnmounted(() => {
  window.removeEventListener('resize', onResize);
});

function onResize() {
  if (!window) return;
  isLgMd.value = window.innerWidth > 768;
  sidebar.value = isLgMd.value;
}

</script>

<template>
  <section class="w-screen h-full p-2 sm:p-4" style="min-width: 330px">
    <!-- Mobile only   -->
    <div class="flex md:hidden flex-column h-full w-full">
      <div class="surface-card flex justify-content-between align-items-center border-round-xl p-2 sm:p-3">
        <h1 class="text-2xl m-0 ml-2">CodeNShare</h1>
        <div class="flex items-center" @click="sidebar = true">
          <Avatar :image="'https://randomuser.me/api/portraits/men/33.jpg'" shape="circle" size="large"/>
        </div>
      </div>
      <!-- Content < md   -->
      <router-view></router-view>

      <!-- Sidebar < md   -->
      <SideBar v-if="!isLgMd" v-model:visible="sidebar" :dismissable="false" blockScroll
               :pt="{root: 'w-auto', content: 'p-2', header: 'pb-2'}" class="border-0"
               header="CodeNShare">
        <MenuSidebar short style="padding: 0.75em !important;" @onNextMenu="sidebar = false"/>
      </SideBar>
    </div>

    <!-- Tablet and Desktop   -->
    <div class="hidden md:flex gap-2 h-full container">
      <MenuSidebar v-if="isLgMd" class="fixed col-4 lg:col-3"
                   style="height: 94vh!important; max-height: 94vh!important;"/>

      <div class="col p-0" style="margin-left: 285px;">
        <router-view></router-view>
      </div>
    </div>
  </section>
</template>

<style scoped>
.container {
  margin-right: auto;
  margin-left: auto;
  max-width: 1500px;
  min-height: 94vh;
  width: 100%;
}
</style>