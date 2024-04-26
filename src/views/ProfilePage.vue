<script lang="ts" setup>


import {ref} from "vue";
import PostCard from "@/components/posts/PostCard.vue";
import ProgramCard from "@/components/programs/ProgramCard.vue";
import InfoCard from "@/components/cards/InfoCard.vue";
import ListView from "@/components/ListView.vue";
import {getPosts, Post} from "@/services/temp/post.service";

const posts = getPosts();


const user = ref({
  firstname: 'Corentin',
  lastname: 'Lechêne',
  avatarUrl: `https://randomuser.me/api/portraits/men/1.jpg`,
  createdAt: '15 Jan. 2023',
  followers: 4,
  following: 9,
  overview: 'lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
});


const pt = {
  minHeight: '2.5em',
  minWidth: '2.5em',
  height: '2.5em',
  width: '2.5em',
}


</script>

<template>
  <div class="gap-3 w-full h-full">
    <!-- Content -->
    <div class="col md:surface-card border-round-xl md:p-4 h-full">
      <h2 class="text-xl mt-0 pt-2">Mon profil</h2>

      <div class="flex flex-column gap-3 h-full w-full">

        <!--  Profile Info      -->
        <div class="flex justify-content-between align-items-center border-round-xs">
          <div class="flex align-items-center align-self-start">
            <Avatar v-if="user.avatarUrl" :image="user.avatarUrl" :pt="{image: {style: pt}}" :style="pt" shape="circle"
                    size="xlarge"
                    @click="$emit('onAvatarClick')"/>
            <Avatar v-else :pt="{image: {style: pt}}" icon="pi pi-image" shape="circle" size="large"
                    @click="$emit('onAvatarClick')"/>
            <div class="flex flex-column gap-1 justify-content-center ml-3">
              <div class="text-lg">{{ user.firstname + ' ' + user.lastname }}</div>
              <div class="flex flex-wrap gap-2 text-color-secondary text-sm mt-1 align-items-center">
                <div class="flex gap-1">
                  <i class="pi pi-users mr-1"></i>
                  <div>{{ user.followers }}</div>
                  <div>suivi(e)s</div>
                </div>
                <div class="flex gap-1">
                  <i class="pi pi-user-plus mr-1"></i>
                  <div>{{ user.following }}</div>
                  <div>abonné(e)s</div>
                </div>
              </div>
              <small class="text-xs text-gray-600">Avec nous depuis le {{ user.createdAt }}</small>
            </div>
          </div>
          <div class="flex gap-2">
            <Button aria-label="send-message" icon="pi pi-envelope" severity="secondary"/>
            <Button aria-label="options" icon="pi pi-ellipsis-v" severity="secondary"/>
          </div>
        </div>

        <Divider class="m-0"></Divider>

        <!--  Profile Description      -->
        <div class="">
          <h3 class="mt-0">A propos</h3>
          <p class="m-0 opacity-80">{{ user.overview }}</p>
        </div>

        <!--  Profile Content      -->
        <TabView :pt="{root: {style: 'display: grid !important'}, panelContainer: 'p-0 pt-3'}" scrollable
                 style="max-width: 50rem">

          <!-- Posts         -->
          <TabPanel header="Posts">
            <ListView :items="posts">
              <template #default="{item: post}: {item: Post}">
                <PostCard :post="post" class="w-full md:border-noround py-3 px-2" style="border-radius: 0 !important;"/>
              </template>
            </ListView>
          </TabPanel>

          <!-- Programs         -->
          <TabPanel header="Programmes">
            <ListView :items="[{id: '1'}, {id: '2'}]">
              <template #default="{item: program}: {item: {id: string}}">
                <ProgramCard :program="program" class="w-full md:border-noround" style="border-radius: 0 !important;"/>
              </template>
            </ListView>
          </TabPanel>

          <!-- Favorites         -->
          <TabPanel header="Favoris">
            <ListView :items="[{id: '1'}, {id: '2'}]">
              <template #default="{item: program}: {item: {id: string}}">
                <ProgramCard :program="program" class="w-full" style="border-radius: 0 !important;"/>
              </template>
            </ListView>
          </TabPanel>

          <!-- Followers         -->
          <TabPanel header="Suivi(e)s">
            <ListView :items="[{
              firstname: 'Corentin',
              lastname: 'Lechêne',
              programs: [1, 2, 3]
            }, {
              firstname: 'Corentin',
              lastname: 'Lechêne',
              programs: [1]
            }, {
              firstname: 'Corentin',
              lastname: 'Lechêne',
              programs: [1, 2, 3, 4, 5, 6, 7, 8]
            }, {
              firstname: 'Corentin',
              lastname: 'Lechêne',
              programs: []
            }]">
              <template #default="{item: person}: {item: {firstname: string, lastname: string, programs: number[]}}">
                <InfoCard :subtitle="person.programs.length + ' programme(s)'"
                          :title="person.firstname + person.lastname"
                          avatar-url="https://randomuser.me/api/portraits/men/9.jpg" class="px-3 py-2 w-full"
                          style="background-color: #121212;">
                  <template #button>
                    <Button aria-label="more-options" icon="pi pi-user-plus" severity="secondary"/>
                  </template>
                </InfoCard>
              </template>
            </ListView>
          </TabPanel>

          <!-- Following         -->
          <TabPanel header="Abonné(e)s">
            <ListView :items="[{
              firstname: 'Corentin',
              lastname: 'Lechêne',
              programs: [1, 2, 3]
            }, {
              firstname: 'Corentin',
              lastname: 'Lechêne',
              programs: [1]
            }, {
              firstname: 'Corentin',
              lastname: 'Lechêne',
              programs: [1, 2, 3, 4, 5, 6, 7, 8]
            }, {
              firstname: 'Corentin',
              lastname: 'Lechêne',
              programs: []
            }]">
              <template #default="{item: person}: {item: {firstname: string, lastname: string, programs: number[]}}">
                <InfoCard :subtitle="person.programs.length + ' programme(s)'"
                          :title="person.firstname + person.lastname"
                          avatar-url="https://randomuser.me/api/portraits/men/9.jpg" class="px-3 py-2 w-full"
                          style="background-color: #121212;">
                  <template #button>
                    <Button aria-label="more-options" icon="pi pi-envelope" severity="secondary"/>
                  </template>
                </InfoCard>
              </template>
            </ListView>
          </TabPanel>
        </TabView>

      </div>
    </div>
  </div>
</template>

<style scoped>
</style>