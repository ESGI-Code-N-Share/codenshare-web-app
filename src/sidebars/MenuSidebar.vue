<script lang="ts" setup>
import {ref} from "vue";
import UserAvatar from "@/components/avatars/UserAvatar.vue";


defineProps<{ collapsed: boolean, isFixed: boolean }>();
defineEmits(['onNextMenu', 'onClose', 'onCollapse', 'onExpand']);

const menus = ref([
  {
    icon: 'pi pi-home',
    label: 'Accueil',
    routeName: 'home',
    params: {profileId: '1'}
  },
  {
    icon: 'pi pi-user',
    label: 'Profile',
    routeName: 'profile', //Todo get user id
    params: {
      profileId: '1'
    }
  },
  {
    icon: 'pi pi-book',
    label: 'Programmes',
    routeName: 'programs',
    params: {}
  },
  {
    icon: 'pi pi-envelope',
    label: 'Messages',
    routeName: 'conversations',
    params: {}
  },
  {
    icon: 'pi pi-question-circle',
    label: 'Aide',
    routeName: 'help',
    params: {}
  },
  {
    icon: 'pi pi-cog',
    label: 'Paramètres',
    routeName: 'settings',
    params: {}
  }
]);

function onLogout() {

}

</script>

<template>
  <div
      :class="{'right-shadow': isFixed, 'p-2': isFixed}"
      class="h-full flex flex-column gap-3 align-items-stretch"
      @click.prevent="collapsed ? $emit('onExpand') : ''"
  >
    <div class="flex flex-column gap-2 p-2 surface-card border-round-xl">

      <div :class="{'p-4 pt-6': !collapsed}" class="flex flex-column align-items-center gap-2 p-2 relative">
        <UserAvatar :avatar-size="collapsed ? 2 : 3.5" :avatars="['https://randomuser.me/api/portraits/men/92.jpg']"/>
        <div v-if="!collapsed" class="gradient-text-primary font-semibold text-lg">Corentin Lechene</div>
        <Button
            v-if="!collapsed"
            class="absolute left-0 text-white"
            icon="pi pi-sign-out"
            rounded
            severity="secondary"
            style="top: 0.75em"
            text
            @click="onLogout()"
        />
        <Button
            v-if="!collapsed"
            :icon="isFixed ? 'pi pi-times' : 'pi pi-chevron-left'"
            class="absolute right-0 text-white"
            rounded
            severity="secondary"
            style="top: 0.75em"
            @click.stop="isFixed ? $emit('onClose') : $emit('onCollapse')"
        />
      </div>

      <div class="flex justify-content-center w-full">
        <Divider class="my-0 p-0" style=""/>
      </div>
      <div class="p-2">
        <Button
            v-if="collapsed"
            :class="$route.name === 'playground' ? 'gradient-bg-primary text-black-alpha-90' : 'hover:surface-200'"
            class="w-full"
            icon="pi pi-search"
            severity="secondary"
            @click="$router.push({ name: 'playground' })"
        />
        <IconField v-else class="" iconPosition="left">
          <InputIcon class="pi pi-search"></InputIcon>
          <InputText class="w-full text-sm border-round-md" placeholder="Recherche"/>
        </IconField>
      </div>
    </div>

    <div class="flex flex-column justify-content-between p-3 surface-card border-round-xl h-full ">
      <div class="flex flex-column gap-2 align-items-stretch">
        <Button
            v-for="menu in menus"
            :class="{'justify-content-center': collapsed}"
            :size="collapsed ? 'large' : undefined "
            :style="$route.name === menu.routeName ? 'color: #FBBF24; background: linear-gradient(92deg, rgba(251, 191, 36, 0.45) 0%, rgba(251, 146, 60, 0.40) 100%), #000;' : ''"
            :text="$route.name !== menu.routeName"
            class="w-full border-0 border-transparent"
            severity="secondary"
            @click="$router.push({ name: menu.routeName, params: menu.params }); $emit('onNextMenu')"
        >
          <i :class="{'pr-2': !collapsed, [menu.icon]: true}"></i>
          <div v-if="!collapsed">{{ menu.label }}</div>
        </Button>
      </div>

      <Button
          v-if="collapsed"
          :class="$route.name === 'playground' ? 'gradient-bg-primary text-black-alpha-90' : 'hover:surface-200'"
          class="w-full"
          icon="pi pi-play"
          severity="secondary"
          @click="$router.push({ name: 'playground' })"
      />

      <Button
          v-else
          :class="$route.name === 'playground' ? 'gradient-bg-primary text-black-alpha-90' : 'hover:surface-200'"
          class="w-full"
          icon="pi pi-play"
          iconPos="right"
          label="Playground"
          severity="secondary"
          @click="$router.push({ name: 'playground' })"
      />
    </div>
  </div>
</template>


<!--<div class="h-full flex flex-column gap-3 align-items-stretch border-round-2xl w-full">
<div class="surface-card border-round-xl p-2">
  &lt;!&ndash; Top   &ndash;&gt;
  <div v-if="short">
    <div class="flex justify-content-between align-items-center px-2 pb-3 pt-2">
      <div class="flex align-items-center gap-2">
        <Avatar :image="'https://randomuser.me/api/portraits/men/9.jpg'" shape="circle" size="large"/>
        <div class="text-sm">L. Corentin</div>
      </div>
      <Button class="text-primary" icon="pi pi-sign-out" rounded severity="secondary" @click="onLogout()"/>
    </div>
  </div>
  <div v-else class="flex flex-column align-items-center justify-content-center pb-4 pt-3 relative">
    <Avatar :image="'https://randomuser.me/api/portraits/men/9.jpg'" shape="circle" size="xlarge"/>
    <div class="mt-2">Corentin lechene</div>
    <Button class="absolute top-0 left-0 text-white" icon="pi pi-sign-out" rounded severity="secondary" text
            @click="onLogout()"/>
    <Button class="absolute top-0 right-0 text-white" icon="pi pi-times" rounded severity="secondary"
            @click="$emit('onClose')"/>
  </div>

  <Divider class="mb-2 mt-0"/>

  <div class="p-1">
    <IconField class="" iconPosition="left">
      <InputIcon class="pi pi-search"></InputIcon>
      <InputText class="w-full text-sm border-round-md" placeholder="Rechercher n'importe quoi.."/>
    </IconField>
  </div>
</div>


<div class="surface-card border-round-xl h-full flex flex-column justify-content-between p-2 pt-4">
  <div class="flex flex-column gap-2 align-items-stretch">
    <Button
        v-for="menu in menus"
        :style="$route.name === menu.routeName ? 'color: #FBBF24; background: linear-gradient(92deg, rgba(251, 191, 36, 0.45) 0%, rgba(251, 146, 60, 0.40) 100%), #000;' : ''"
        :text="$route.name !== menu.routeName"
        class="w-full border-0 border-transparent"
        severity="secondary"
        @click="$router.push({ name: menu.routeName, params: menu.params }); $emit('onNextMenu')"
    >
      <i :class="menu.icon" class="mr-2"></i>
      <div>{{ menu.label }}</div>
    </Button>
  </div>
  <Button
      :class="$route.name === 'playground' ? 'gradient-bg-primary text-black-alpha-90' : 'hover:surface-200'"
      class="w-full"
      icon="pi pi-play"
      iconPos="right"
      label="Playground"
      severity="secondary"
      @click="$router.push({ name: 'playground' })"
  />
</div>
</div>-->

<style scoped>
.right-shadow {
  box-shadow: 5px 0 15px rgba(255, 255, 255, 0.1);
}
</style>