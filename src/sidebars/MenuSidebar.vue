<script lang="ts" setup>
import {ref} from "vue";
import {usePrimeVue} from "primevue/config";


defineProps<{ short?: boolean }>()
defineEmits(['onNextMenu']);

// todo temp
const primevue = usePrimeVue();

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
    routeName: 'messages',
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
  primevue.changeTheme('aura-dark-amber', "aura-light-amber", "theme-link", () => {
    console.log('Theme changed');
  })
}

</script>

<template>
  <div class="h-full flex flex-column gap-3 align-items-stretch border-round-2xl "
       style="min-height: 550px !important; background-color: #121212; padding: 0 0.5em 0 0; min-width: 275px; max-width: 275px">
    <div class="surface-card border-round-xl p-2">
      <!-- Top   -->
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
        <Button class="absolute top-0 left-0 text-white" icon="pi pi-sign-out" rounded severity="secondary"
                @click="onLogout()"/>
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
  </div>
</template>

<style scoped>

</style>