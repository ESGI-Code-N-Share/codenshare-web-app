<script lang="ts" setup>
import {ref} from "vue";
import UserAvatar from "@/components/avatars/UserAvatar.vue";
import {useUserStore} from "@/stores/user.store";
import {useRouter} from "vue-router";


const props = defineProps<{ collapsed: boolean, isFixed: boolean }>();
const emit = defineEmits(['onNextMenu', 'onClose', 'onCollapse', 'onExpand', 'onSearch']);

const router = useRouter();
const userStore = useUserStore();
const currentUser = userStore.currentUser;


const menus = ref([
  {
    icon: 'pi pi-home',
    label: 'home',
    routeName: 'home',
    children: [],
    params: {profileId: '1'}
  },
  {
    icon: 'pi pi-user',
    label: 'profile',
    routeName: 'profile',
    children: [],
    params: {
      profileId: currentUser?.userId
    }
  },
  {
    icon: 'pi pi-book',
    label: 'programs',
    routeName: 'programs',
    children: ['program'],
    params: {}
  },
  {
    icon: 'pi pi-envelope',
    label: 'messages',
    routeName: 'conversations',
    children: [],
    params: {}
  }
]);

async function onLogout() {
  try {
    const userStore = useUserStore();
    await userStore.logout();
    await router.push({name: 'login'});
  } catch (e) {
    console.error(e);
  }
}

</script>

<template>
  <div
      :class="{'right-shadow': isFixed, 'p-2': isFixed}"
      class="h-full flex flex-column gap-3 align-items-stretch"
      @click.prevent="collapsed ? $emit('onExpand') : ''"
  >
    <div v-if="currentUser" class="flex flex-column gap-2 p-2 surface-card border-round-xl">

      <div :class="{'p-4 pt-4 sm:pt-6': !collapsed}" class="flex flex-column align-items-center gap-2 p-2 relative">
        <UserAvatar :avatar-size="collapsed ? 2 : 3.5" :avatars="[currentUser.avatar]"/>
        <div v-if="!collapsed" class="hidden sm:block gradient-text-primary font-semibold text-lg">{{
            userStore.fullName
          }}
        </div>
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
      <div class="p-2" @click.stop="$emit('onSearch')">
        <Button
            v-if="collapsed"
            class="w-full"
            icon="pi pi-search"
            severity="secondary"
            @click="$router.push({ name: 'settings' })"
        />
        <IconField v-else class="" iconPosition="left">
          <InputIcon class="pi pi-search"></InputIcon>
          <InputText :placeholder="$t('global.menubar.search')" class="w-full text-sm border-round-md" readonly/>
        </IconField>
      </div>
    </div>

    <div class="flex flex-column justify-content-between p-3 surface-card border-round-xl h-full ">
      <div class="flex flex-column gap-2 align-items-stretch">
        <Button
            v-for="menu in menus"
            :class="{'justify-content-center': collapsed}"
            :size="collapsed ? 'large' : undefined "
            :style="$route.name === menu.routeName || menu.children.some(child => child === $route.name) ? 'color: #FBBF24; background: linear-gradient(92deg, rgba(251, 191, 36, 0.45) 0%, rgba(251, 146, 60, 0.40) 100%), #000;' : ''"
            :text="$route.name !== menu.routeName"
            class="w-full border-0 border-transparent"
            severity="secondary"
            @click="$router.push({ name: menu.routeName, params: menu.params }); $emit('onNextMenu')"
        >
          <i :class="{'pr-2': !collapsed, [menu.icon]: true}"></i>
          <div v-if="!collapsed">{{ $t(`global.menubar.${menu.label}`) }}</div>
        </Button>
      </div>

      <Button
          v-if="collapsed"
          :class="$route.name === 'settings' ? 'gradient-bg-primary text-black-alpha-90' : 'hover:surface-200'"
          class="w-full"
          severity="secondary"
          @click="$router.push({ name: 'settings' })"
      />

      <Button
          v-else
          :class="$route.name === 'settings' ? 'gradient-bg-primary text-black-alpha-90' : 'hover:surface-200'"
          class="w-full"
          iconPos="right"
          :label="$t('global.menubar.settings')"
          severity="secondary"
          @click="$router.push({ name: 'settings' })"
      />
    </div>
  </div>
</template>

<style scoped>
.right-shadow {
  box-shadow: 5px 0 15px rgba(255, 255, 255, 0.1);
}
</style>