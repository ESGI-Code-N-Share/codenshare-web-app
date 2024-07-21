<script lang="ts" setup>


import {ref, watch} from "vue";
import PostCard from "@/components/posts/PostCard.vue";
import ProgramCard from "@/components/programs/ProgramCard.vue";
import InfoCard from "@/components/cards/InfoCard.vue";
import ListView from "@/components/ListView.vue";
import UserAvatar from "@/components/avatars/UserAvatar.vue";
import {Friend, Post, Program, ProgramsRequest, User, UserId} from "@/models";
import {useRoute, useRouter} from "vue-router";
import {CodeNShareFriendApi, CodeNSharePostApi, CodeNShareProgramApi, CodeNShareUserApi} from "@/api/codenshare";
import {useUserStore} from "@/stores/user.store";
import dayjs from "dayjs/esm/index.js";
import {ToastService} from "@/services/toast.service";
import {useToast} from "primevue/usetoast";
import {useI18n} from "vue-i18n";

dayjs.locale(localStorage.getItem('language') || 'fr');

const route = useRoute();
const router = useRouter();
const toastNotifications = new ToastService(useToast());
const {t: $t} = useI18n();


const userStore = useUserStore();
const currentUser = userStore.currentUser;

const loading = ref({friends: false, programs: false, user: false, posts: false})

const followerIcon = (friend: Friend) => {
  if (currentUser) {
    if (friend.requestedBy.userId === currentUser.userId) {
      return undefined;
    } else {
      return user.value?.following?.find(f => f.addressedTo.userId === friend.requestedBy.userId)
          ? 'pi pi-user-minus'
          : 'pi pi-user-plus';
    }
  }
  return undefined;
}

const menuOptionsProfile = ref();
const menuItemsProfile = ref([
  {
    label: $t('profile.buttons.follow'),
    icon: 'pi pi-user-plus',
    async command() {
      if (user.value?.detail && currentUser?.userId) {
        if (user.value.detail.userId !== currentUser?.userId) {
          try {
            await CodeNShareFriendApi.follow(currentUser.userId, user.value.detail.userId);
            await fetchProfile(user.value.detail.userId);
            toastNotifications.showSuccess(`Vous suivez maintenant ${user.value.detail.firstname}`);
          } catch (e) {
            console.error(e);
          }
        } else {
          console.error('You cannot follow yourself');
        }
      }
    }
  }
])


const user = ref<{
  posts: Post[] | undefined,
  programs: ProgramsRequest[] | undefined,
  detail: User | undefined,
  followers: Friend[] | undefined,
  following: Friend[] | undefined
}>()

const fetchPrograms = async (userId: UserId) => {
  try {
    loading.value.programs = true;
    return await CodeNShareProgramApi.getByUser(userId)
  } catch (e) {
    console.error(e);
    toastNotifications.showError('Impossible de charger les programmes');
  } finally {
    loading.value.programs = false;
  }
}

const fetchUser = async (userId: UserId) => {
  try {
    loading.value.programs = true;
    return await CodeNShareUserApi.find(userId);
  } catch (e) {
    console.error(e);
    toastNotifications.showError("Impossible de charger les informations de l'utilisateur");
  } finally {
    loading.value.programs = false;
  }
}

const fetchPosts = async (userId: UserId) => {
  try {
    loading.value.programs = true;
    return await CodeNSharePostApi.getByUser(userId)
  } catch (e) {
    console.error(e);
    toastNotifications.showError('Impossible de charger les posts');
  } finally {
    loading.value.programs = false;
  }
}

const fetchFollowers = async (userId: UserId) => {
  try {
    loading.value.programs = true;
    return await CodeNShareFriendApi.getFollowersByUser(userId);
  } catch (e) {
    console.error(e);
    toastNotifications.showError('Impossible de charger les followers');
  } finally {
    loading.value.programs = false;
  }
}

const fetchFollowing = async (userId: UserId) => {
  try {
    loading.value.programs = true;
    return await CodeNShareFriendApi.getFollowingByUser(userId);
  } catch (e) {
    console.error(e);
    toastNotifications.showError('Impossible de charger les following');
  } finally {
    loading.value.programs = false;
  }
}

const fetchProfile = async (userId: UserId) => {
  try {
    if (menuItemsProfile.value[0]) menuItemsProfile.value[0].visible = false;
    if (menuItemsProfile.value[1]) menuItemsProfile.value[1].visible = false;

    user.value = {
      detail: await fetchUser(userId),
      posts: await fetchPosts(userId),
      programs: await fetchPrograms(userId),
      followers: await fetchFollowers(userId),
      following: await fetchFollowing(userId),
    }
    if (user.value?.detail?.userId === currentUser?.userId) {
      menuItemsProfile.value[0].visible = false;
      menuItemsProfile.value.push({
        label: $t('profile.buttons.edit'),
        icon: 'pi pi-pencil',
        command: () => router.push('/app/settings')
      })
    } else {
      menuItemsProfile.value[0].visible = true;
      if (menuItemsProfile.value[1]) {
        menuItemsProfile.value[1].visible = false;
      }
    }
  } catch (e) {
    console.error(e);
    toastNotifications.showError('Impossible de charger le profil');
  } finally {
    if (user.value?.detail === undefined) {
      router.back();
    }
  }
}

watch(
    () => route.params.profileId,
    (newUserId) => {
      fetchProfile(newUserId as UserId);
    },
    {immediate: true}
);
watch(
    () => route.query.loading,
    () => {
      router.push(route.fullPath.replace(/&?loading=true/, ''));
      user.value = undefined;
    },
    {immediate: true}
);

function openOptionsProfile(event: MouseEvent) {
  menuOptionsProfile.value.show(event);
}

const onToggleFriend = async (friend: Friend) => {
  try {
    if (!currentUser) return;
    const isFollowing = user.value?.following?.find(f => f.addressedTo.userId === friend.requestedBy.userId);
    if (isFollowing) {
      await CodeNShareFriendApi.unfollow(currentUser.userId, friend.requestedBy.userId);
      if (user.value) {
        user.value.following = Array.isArray(user.value.following)
            ? user.value.following.filter(f => f.addressedTo.userId !== friend.requestedBy.userId)
            : [];
      }
      toastNotifications.showSuccess(`Vous ne suivez plus ${friend.requestedBy.firstname}`);
    } else {
      await CodeNShareFriendApi.follow(currentUser.userId, friend.requestedBy.userId);
      if (user.value) {
        user.value.following = Array.isArray(user.value.following)
            ? [...user.value.following, friend]
            : [friend];
      }
      toastNotifications.showSuccess(`Vous suivez maintenant ${friend.requestedBy.firstname}`);
    }
  } catch (e) {
    console.error(e);
  }
}
</script>

<template>
  <div class="gap-3 w-full h-full">
    <!-- Content -->
    <div class="col surface-card border-round-xl md:p-4 h-full relative">
      <h2 v-if="user?.detail?.userId === currentUser?.userId" class="text-xl mt-0 pt-2">{{ $t('global.pages.me') }}</h2>
      <div v-else class="flex justify-content-start align-items-center gap-2 pb-2">
        <Button icon="pi pi-arrow-left" severity="secondary" text @click="$router.go(-2);"/>
        <h2 class="text-xl my-0">{{ $t('global.pages.profile') }}</h2>
      </div>

      <div v-if="user" class="flex flex-column gap-3 pt-2 h-full w-full">

        <!--  Profile Info      -->
        <div v-if="user.detail && user.following && user.followers"
             class="flex justify-content-between align-items-center border-round-xs">
          <div class="flex align-items-center align-self-start">
            <UserAvatar :avatar-size="2.5" :avatars="[user.detail.avatar]"/>
            <div class="flex flex-column gap-1 justify-content-center ml-3">
              <div class="text-lg">{{ user.detail.firstname + ' ' + user.detail.lastname }}</div>
              <div class="flex flex-wrap gap-2 text-color-secondary text-sm mt-1 align-items-center">
                <div class="flex gap-1">
                  <i class="pi pi-users mr-1"></i>
                  <div>{{ user.followers.length }}</div>
                  <div>{{ $t('profile.follower') }}</div>
                </div>
                <div class="flex gap-1">
                  <i class="pi pi-user-plus mr-1"></i>
                  <div>{{ user.following.length }}</div>
                  <div>{{ $t('profile.following') }}</div>
                </div>
              </div>
              <small class="text-xs text-gray-600">
                <span class="mr-1">{{ $t('profile.with_us_since') }}</span>
                <span>{{ dayjs(user.detail.createdAt).format('DD/MM/YYYY') }}</span>
              </small>
            </div>
          </div>
          <div v-if="currentUser" class="flex gap-2">
            <Button aria-label="options" icon="pi pi-ellipsis-v" severity="secondary"
                    @click="openOptionsProfile($event)"/>
            <Menu ref="menuOptionsProfile" :model="menuItemsProfile" popup/>
          </div>
        </div>

        <Divider class="m-0"></Divider>

        <!--  Profile Description      -->
        <div class="">
          <h3 class="mt-0">{{ $t('profile.about') }}</h3>
          <p class="m-0 opacity-80">{{ user.detail?.overview }}</p>
        </div>

        <!--  Profile Content      -->
        <TabView :pt="{root: {style: 'display: grid !important'}, panelContainer: 'p-0 pt-3'}" scrollable
                 style="max-width: 50rem">

          <!-- Posts         -->
          <TabPanel :header="$t('post.posts')">
            <ListView :items="user.posts || []">
              <template #default="{item: post}: {item: Post}">
                <PostCard :post="post" class="w-full md:border-noround py-3 px-2" style="border-radius: 0 !important;"/>
              </template>
            </ListView>
          </TabPanel>

          <!-- Programs         -->
          <TabPanel :header="$t('program.programs')">
            <ListView :items="user.programs || []">
              <template #default="{item: program}: {item: Program}">
                <ProgramCard
                    :program="program"
                    class="w-full md:border-noround"
                    style="background: #09090B !important; border-radius: 0 !important;"
                />
              </template>
            </ListView>
          </TabPanel>

          <!-- Followers         -->
          <TabPanel :header="$t('profile.follower')">
            <ListView :items="user.followers || []">
              <template #default="{item: friend}: {item: Friend}">
                <InfoCard
                    :avatar-url="friend.requestedBy.avatar"
                    :subtitle="`${$t('profile.followed_since')} ${ dayjs(friend.createdAt).format('DD/MM/YYYY') }`"
                    :title="friend.requestedBy.firstname + ' ' + friend.requestedBy.lastname"
                    class="px-3 py-2 w-full capitalize"
                    style="background-color: #121212;"
                    @on-avatar-click="$router.push(`/app/profile/${friend.requestedBy.userId}`)"
                >
                  <template #button>
                    <Button
                        v-if="followerIcon(friend)"
                        :icon="followerIcon(friend)"
                        aria-label="more-options"
                        severity="secondary"
                        @click="onToggleFriend(friend)"
                    />
                  </template>
                </InfoCard>
              </template>
            </ListView>
          </TabPanel>

          <!-- Following         -->
          <TabPanel :header="$t('profile.following')">
            <ListView :items="user.following || []">
              <template #default="{item: friend}: {item: Friend}">
                <InfoCard
                    :avatar-url="friend.addressedTo.avatar"
                    :subtitle="`${$t('profile.following_since')} ${ dayjs(friend.createdAt).format('DD/MM/YYYY') }`"
                    :title="friend.addressedTo.firstname + ' ' + friend.addressedTo.lastname"
                    class="px-3 py-2 w-full capitalize"
                    style="background-color: #121212;"
                    @on-avatar-click="$router.push(`/app/profile/${friend.addressedTo.userId}`)"
                >
                  <template #button>
                    <Button
                        aria-label="more-options"
                        icon="pi pi-user-minus"
                        severity="secondary"
                        @click="onToggleFriend(friend)"
                    />
                  </template>
                </InfoCard>
              </template>
            </ListView>
          </TabPanel>
        </TabView>
      </div>
      <div v-else class="absolute" style="left: 45%; top: 40%">
        <ProgressSpinner/>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>