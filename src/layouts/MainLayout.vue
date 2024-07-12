<script lang="ts" setup>

import {ref} from "vue";
import Sidebar from "../sidebars/Sidebar.vue";
import UserAvatar from "@/components/avatars/UserAvatar.vue";
import {useUserStore} from "@/stores/user.store";
import {Program, User, UserId} from "@/models";
import ListView from "@/components/ListView.vue";
import InfoCard from "@/components/cards/InfoCard.vue";
import {CodeNShareFriendApi, CodeNShareProgramApi, CodeNShareUserApi} from "@/api/codenshare";
import ProgramCard from "@/components/programs/ProgramCard.vue";
import dayjs from "dayjs/esm/index.js";
import {ToastService} from "@/services/toast.service";
import {useToast} from "primevue/usetoast";
import {useI18n} from "vue-i18n";

dayjs.locale(localStorage.getItem('language') || 'fr');

const userStore = useUserStore();
const currentUser = userStore.currentUser;
const toastNotifications = new ToastService(useToast());
const {t: $t} = useI18n();

const sidebar = ref<'hidden' | 'collapsed' | 'expanded'>('hidden');
const openSearchModal = ref(false);
const searchInput = ref();
const query = ref('');

type Result = {
  type: 'program';
  value: Program;
} | {
  type: 'user';
  value: User;
}
const results = ref<Result[]>()

const onAddFriend = async (friendId: UserId) => {
  try {
    if (!currentUser) return;
    if (currentUser.userId === friendId) {
      toastNotifications.showError($t('profile.errors.cannot_follow_yourself'));
      return;
    }

    await CodeNShareFriendApi.follow(currentUser.userId, friendId);
    toastNotifications.showSuccess("Demande d'amitié envoyée");
  } catch (e) {
    console.error(e);
  }
}

const onSearch = async () => {
  try {
    if (!query.value || query.value.length <= 1) return;
    const [users, programs] = await Promise.all([
      CodeNShareUserApi.search(query.value),
      CodeNShareProgramApi.search(query.value),
    ]);

    results.value = [
      ...users.map(u => ({type: 'user', value: u})),
      ...programs.map(p => ({type: 'program', value: p})),
    ] as Result[];
  } catch (e) {
    console.error(e);
    toastNotifications.showError("Une erreur s'est produite lors de la recherche");
  }
}

const openSearch = () => {
  openSearchModal.value = true;
  setTimeout(() => {
    searchInput.value.$el.focus()
  }, 100);
}

</script>

<template>
  <section class="flex flex-column gap-4 h-full p-3 sm:p-4 overflow-hidden" style="min-width: 350px">
    <Toast class="sm:w-auto" position="top-right" style="width: 85%;"/>

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
      <Sidebar v-model:state="sidebar" @on-search="openSearch()"/>

      <!-- Views   -->
      <router-view></router-view>

      <!-- Searchbar     -->
      <Dialog
          v-model:visible="openSearchModal"
          :pt="{content: 'p-0'}"
          :show-header="false"
          class="absolute p-2 mx-3"
          modal
          style="min-width: 60% !important; min-height: 40% !important; top: 10%; z-index: 9999;"
      >
        <div class="flex flex-column gap-3 p-2">
          <div class="w-full flex gap-3">
            <InputText
                ref="searchInput"
                v-model.trim="query"
                :placeholder="$t('global.menubar.search')"
                class="w-full"
                @update:model-value="onSearch"
            />
            <Button
                aria-label="close"
                class="p-2"
                icon="pi pi-times"
                @click="openSearchModal = false"
            />
          </div>
          <div class="" style="min-height: 7em">
            <TabView
                :pt="{root: {style: 'display: grid !important'}, panelContainer: 'p-0 pt-3'}"
                scrollable
                style="max-width: 50rem; max-height: 30em"
            >
              <!-- All result             -->
              <TabPanel :header="$t('global.all_results')">
                <ListView v-if="results" :items="results">
                  <template #default="{item: result}: {item: Result}">
                    <InfoCard
                        v-if="result.type === 'user'"
                        :avatar-url="result.value.avatar"
                        :subtitle="`${$t('profile.followed_since')} ${ dayjs(result.value.createdAt).format('DD/MM/YYYY') }`"
                        :title="result.value.firstname + ' ' + result.value.lastname"
                        class="px-3 py-2 w-full capitalize"
                        style="background-color: #121212;"
                        @on-avatar-click="$router.push(`/app/profile/${result.value.userId}`); openSearchModal = false;"
                    >
                      <template #button>
                        <Button
                            aria-label="more-options"
                            icon="pi pi-user-plus"
                            severity="secondary"
                            @click="onAddFriend(result.value.userId)"
                        />
                      </template>
                    </InfoCard>

                    <ProgramCard
                        v-if="result.type === 'program'"
                        :program="result.value"
                        class="w-full"
                        style="background: #121212;"
                    />
                  </template>
                </ListView>
              </TabPanel>

              <!-- All result             -->
              <TabPanel header="Utilisateurs">
                <ListView v-if="results" :items="results.filter(result => result.type === 'user')">
                  <template #default="{item: result}: {item: Result}">
                    <InfoCard
                        v-if="result.type === 'user'"
                        :avatar-url="result.value.avatar"
                        :subtitle="`${$t('profile.followed_since')} ${ dayjs(result.value.createdAt).format('DD/MM/YYYY') }`"
                        :title="result.value.firstname + ' ' + result.value.lastname"
                        class="px-3 py-2 w-full capitalize"
                        style="background-color: #121212;"
                        @on-avatar-click="$router.push(`/app/profile/${result.value.userId}`); openSearchModal = false;"
                    >
                      <template #button>
                        <Button
                            aria-label="more-options"
                            icon="pi pi-user-plus"
                            severity="secondary"
                            @click="onAddFriend(result.value.userId)"
                        />
                      </template>
                    </InfoCard>
                  </template>
                </ListView>
              </TabPanel>

              <!-- Programs             -->
              <TabPanel header="Programmes">
                <ListView v-if="results" :items="results.filter(result => result.type === 'program')">
                  <template #default="{item: result}: {item: Result}">
                    <ProgramCard
                        v-if="result.type === 'program'"
                        :program="result.value"
                        class="w-full"
                        style="background: #121212;"
                        @on-menu-click="openSearchModal = false;"
                    />
                  </template>
                </ListView>
              </TabPanel>
            </TabView>
          </div>
        </div>
      </Dialog>
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