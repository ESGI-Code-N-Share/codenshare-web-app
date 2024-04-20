<script lang="ts" setup>
import {ref} from "vue";

const menus = ref([
  {
    icon: 'pi pi-home',
    label: 'Accueil',
    routeName: 'home'
  },
  {
    icon: 'pi pi-user',
    label: 'Profile',
    routeName: 'profile'
  },
  {
    icon: 'pi pi-book',
    label: 'Programmes',
    routeName: 'programs'
  },
  {
    icon: 'pi pi-envelope',
    label: 'Messages',
    routeName: 'messages'
  },
  {
    icon: 'pi pi-question-circle',
    label: 'Aide',
    routeName: 'help'
  },
  {
    icon: 'pi pi-cog',
    label: 'Paramètres',
    routeName: 'settings'
  }
]);
</script>

<template>
  <div class="h-full md:p-3 " style="min-width: 200px; max-width: 250px">
    <div class="flex flex-column border-round-xl p-3 surface-card"
         style="height: 25%; min-height: 240px; max-height: 300px; margin-bottom: 5%">
      <!--      <div>-->
      <!--        <h2 class="mb-2 text-center">CodeNShare</h2>-->
      <!--      </div>-->
      <!--      <divider class="my-3" />-->
      <div class="h-full flex align-items-center justify-content-center">
        <div class="text-center">
          <Avatar :image="'https://randomuser.me/api/portraits/men/9.jpg'" shape="circle" size="xlarge"/>
          <div class="text-xl gradient-text-primary mt-2">Corentin lechene</div>
        </div>
      </div>
      <divider class="my-3"/>
      <div>
        <IconField class="h-full" iconPosition="left">
          <InputIcon class="pi pi-search"></InputIcon>
          <InputText class="w-full" placeholder="Rechercher n'importe quoi.."/>
        </IconField>
      </div>
    </div>

    <div class="flex flex-column justify-content-between border-round-xl p-3 surface-card" style="height: 68%;">
      <div class="flex flex-column gap-2 mt-3">
        <div
            v-for="menu in menus"
            :class="$route.name === menu.routeName ? 'gradient-bg-primary text-black-alpha-90' : 'hover:surface-200 cursor-pointer'"
            class="flex align-items-center p-2 gap-2 border-round"
            @click="$router.push({ name: menu.routeName })"
        >
          <div>
            <i :class="menu.icon" style="font-size: 1.5rem"></i>
          </div>
          <div>{{ menu.label }}</div>
        </div>
      </div>

      <div>
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
  </div>
</template>

<style scoped>

</style>