<script lang="ts" setup>

import {ref} from "vue";
import Sidebar from "../sidebars/Sidebar.vue";
import UserAvatar from "@/components/avatars/UserAvatar.vue";
import {useUserStore} from "@/stores/user.store";

const userStore = useUserStore();
const currentUser = userStore.currentUser;

const sidebar = ref<'hidden' | 'collapsed' | 'expanded'>('hidden');

</script>

<template>
  <section class="flex flex-column gap-4 h-full p-3 sm:p-4 overflow-hidden" style="min-width: 350px">

    <!-- Mobile only   -->
    <!-- Navbar top   -->
    <div class="flex md:hidden align-items-center justify-content-between p-3 sm:p-4 border-round-xl surface-card">
      <h1 class="text-3xl m-0">CodeNShare</h1>
      <UserAvatar :avatars="[currentUser?.avatar]" @onAvatarClick="sidebar = 'expanded'"/>
    </div>

    <!-- Content   -->
    <div
        :class="{ 'offset-ml-100': sidebar === 'collapsed', 'offset-ml-300': sidebar === 'expanded' }"
        class="flex h-full"
        style="transition: margin-left 0.5s"
    >
      <!-- Left Sidebar   -->
      <Sidebar v-model:state="sidebar"/>

      <!-- Views   -->
      <router-view></router-view>
    </div>

  </section>
</template>

<style scoped>
.offset-ml-100 {
  margin-left: 90px;
}

.offset-ml-300 {
  margin-left: 290px;
}
</style>