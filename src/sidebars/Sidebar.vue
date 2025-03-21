<script lang="ts" setup>

import {computed, onMounted, onUnmounted, ref} from "vue";
import MenuSidebar from "@/sidebars/MenuSidebar.vue";

const sidebarState = defineModel('state', {
  type: String,
  default: 'hidden',
})
defineEmits(['onSearch'])

const isFixed = ref(false);

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
  isFixed.value = false

  if (window.innerWidth < 768) {
    isFixed.value = true;
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
    'sidebar-fixed': isFixed.value,
  };
});

</script>

<template>
  <div :class="['sidebar', sidebarClass]" class="p-0 md:p-4 md:pr-0">
    <MenuSidebar
        :collapsed="state === 'collapsed'"
        :isFixed="isFixed"
        @on-close="toggleSidebar('hidden')"
        @on-collapse="toggleSidebar('collapsed')"
        @on-expand="toggleSidebar('expanded')"
        @on-next-menu="isFixed ? toggleSidebar('hidden') : ''"
        @on-search="$emit('onSearch')"
    />
  </div>
</template>


<style scoped>

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  max-height: 100vh;
  transition: width 0.5s;
  background-color: #121212;
  color: white;
  z-index: 20;
}

.sidebar-fixed {
  width: 0;
  position: fixed;
}

.sidebar-hidden {
  width: 0;
  overflow: hidden;
}

.sidebar-collapsed {
  padding: 0.5em;
  width: 100px;
}

.sidebar-expanded {
  padding: 0.5em;
  width: 300px;
}
</style>