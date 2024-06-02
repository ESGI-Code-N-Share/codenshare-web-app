<script lang="ts" setup>

import {ref} from "vue";
import {useRoute} from "vue-router";
import Sidebar from "../sidebars/Sidebar.vue";
import UserAvatar from "@/components/avatars/UserAvatar.vue";

const route = useRoute();

const sidebar = ref<'hidden' | 'collapsed' | 'expanded'>('hidden');


</script>

<template>
  <section class="flex flex-column gap-4 h-full p-2 sm:p-4">

    <!-- Mobile only   -->
    <!-- Navbar top   -->
    <div class="flex md:hidden align-items-center justify-content-between p-2 sm:p-3 border-round-xl surface-card">
      <h1 class="text-3xl m-0">CodeNShare</h1>
      <UserAvatar :avatars="['https://randomuser.me/api/portraits/men/33.jpg']" @onAvatarClick="sidebar = 'expanded'"/>
    </div>

    <!-- Content   -->
    <div
        :class="{ 'offset-ml-90': sidebar === 'collapsed', 'offset-ml-300': sidebar === 'expanded' }"
        class="flex h-full"
        style="transition: margin-left 0.5s"
    >
      <!-- Left Sidebar   -->
      <Sidebar v-model:state="sidebar"/>

      <!-- Views   -->
      <router-view></router-view>
      <!--      views-->
    </div>


  </section>
</template>

<!--<section class="w-screen h-full p-2 sm:p-4" style="min-width: 330px">
&lt;!&ndash; Mobile only   &ndash;&gt;
<div class="flex md:hidden flex-column h-full w-full">
  <div class="surface-card flex justify-content-between align-items-center border-round-xl p-2 sm:p-3">
    <h1 class="text-2xl m-0 ml-2">CodeNShare</h1>
    <div class="flex items-center" @click="sidebar = true">
      <Avatar :image="'https://randomuser.me/api/portraits/men/33.jpg'" shape="circle" size="large"/>
    </div>
  </div>
  &lt;!&ndash; Content < md   &ndash;&gt;
  <router-view></router-view>

  &lt;!&ndash; Sidebar < md   &ndash;&gt;
  <SideBar v-if="!isLgMd" v-model:visible="sidebar" :dismissable="false" blockScroll
           :pt="{root: 'w-auto', content: 'p-2', header: 'pb-2'}" class="border-0"
           header="CodeNShare">
    <MenuSidebar short style="padding: 0.75em !important;" @onNextMenu="sidebar = false"/>
  </SideBar>
</div>

&lt;!&ndash; Tablet and Desktop   &ndash;&gt;
<div class="hidden md:flex gap-2 h-full container">
  <MenuSidebar v-if="isLgMd" class="fixed col-4 lg:col-3"
               style="height: 94vh!important; max-height: 94vh!important;"/>

  <div class="col p-0" style="margin-left: 285px;">
    <router-view></router-view>
  </div>
</div>
</section>-->

<style scoped>
.offset-ml-90 {
  margin-left: 90px;
}

.offset-ml-300 {
  margin-left: 300px;
}
</style>