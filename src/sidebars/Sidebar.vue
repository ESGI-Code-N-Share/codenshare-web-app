<script lang="ts" setup>

import {computed, onMounted, onUnmounted} from "vue";
import MenuSidebar from "@/sidebars/MenuSidebar.vue";

const sidebarState = defineModel('state', {
  type: String,
  default: 'hidden',
})

onMounted(() => {
  window.addEventListener('resize', onResize);
  onResize();
});

onUnmounted(() => {
  window.removeEventListener('resize', onResize);
});

const toggleSidebar = (n: 'hidden' | 'collapsed' | 'expanded') => {
  sidebarState.value = n;
};

function onResize() {
  if (!window) return;

  if (window.innerWidth < 768) {
    toggleSidebar('hidden')
  } else if (window.innerWidth < 1024) {
    toggleSidebar('collapsed')
  } else {
    toggleSidebar('expanded')
  }
}

const sidebarClass = computed(() => {
  return {
    'sidebar-hidden': sidebarState.value === 'hidden',
    'sidebar-collapsed': sidebarState.value === 'collapsed',
    'sidebar-expanded': sidebarState.value === 'expanded',
    'sidebar-fixed': window.innerWidth < 768,
  };
});

</script>

<template>
  <div :class="['sidebar', sidebarClass]" class="p-0 md:p-4">
    <MenuSidebar @on-close="toggleSidebar('hidden')"/>
  </div>
</template>


<style scoped>

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  transition: width 0.5s;
  overflow: hidden;
  background-color: #121212;
  color: white;
  z-index: 9999;
}

.sidebar-fixed {
  width: 0;
  position: fixed;
}

.sidebar-hidden {
  width: 0;
}

.sidebar-collapsed {
  padding: 0.5em;
  width: 90px;
}

.sidebar-expanded {
  padding: 0.5em;
  width: 300px;
}
</style>