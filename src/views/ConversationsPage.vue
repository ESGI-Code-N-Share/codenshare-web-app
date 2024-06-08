<script lang="ts" setup>

import {computed, onMounted, onUnmounted, ref} from "vue";
import {Conversation, ConversationId, Message, User, UserId} from "@/models";
import UserAvatar from "@/components/avatars/UserAvatar.vue";
import {CodeNShareConversationApi, CodeNShareFriendApi, CodeNShareMessageApi} from "@/api/codenshare";
import InfoCard from "@/components/cards/InfoCard.vue";
import {useUserStore} from "@/stores/user.store";
import ConversationMessage from "@/components/conversations/ConversationMessage.vue";
import VirtualScroller from "primevue/virtualscroller";
import dayjs from "dayjs/esm/index.js";
import {useToast} from "primevue/usetoast";
import {ToastService} from "@/services/toast.service";

const size1 = computed(() => {
  return window.innerWidth < 450 ? 1 : window.innerWidth < 550 ? 2 : window.innerWidth < 1024 ? 4 : 5;
});
const size2 = computed(() => {
  return window.innerWidth < 450 ? 0 : window.innerWidth < 768 ? 3 : window.innerWidth < 1024 ? 4 : 5;
});
const userStore = useUserStore();
const currentUser = userStore.currentUser;
const toastNotifications = new ToastService(useToast());

const messageContent = ref('');
const menuOptionsConversation = ref();
const scrollView = ref<VirtualScroller>();
const loading = ref({create: false, fetch: true, fetchFriends: false, delete: false, send: false});

const openConversationCreationModal = ref(false);
const selectedUsers = ref<User[]>([]);
const friendsOptions = ref<{ name: string, userId: UserId }[]>([]);

const intervalId = ref<NodeJS.Timeout>();
const isNewMessage = ref<ConversationId>();

const optionsConversation = [
  {
    label: 'Quitter',
    icon: 'pi pi-trash',
    loading: false,
    async command() {
      if (!currentConversation.value) return;
      try {
        this.loading = true
        await CodeNShareConversationApi.delete(currentConversation.value.conversationId);
        conversations.value = conversations.value.filter(c => c.conversationId !== currentConversation.value?.conversationId);
        currentConversation.value = conversations.value[0];
        messages.value = currentConversation.value?.messages;
        scrollToLast();
        toastNotifications.showSuccess("Conversation supprimée avec succès");
      } catch (e) {
        console.error(e);
        toastNotifications.showError("Une erreur s'est produite lors de la suppression de la conversation");
      } finally {
        this.loading = false
      }
    }
  }
]
const openOptionsConversation = (event: MouseEvent) => {
  menuOptionsConversation.value.toggle(event);
}

const currentConversation = ref<Conversation>();
const conversations = ref<Conversation[]>([]);
const messages = ref<Message[]>()

onMounted(async () => {
  await fetchConversations();
  if (conversations.value.length > 0) {
    currentConversation.value = conversations.value[0];
    messages.value = conversations.value[0].messages
  }
  intervalId.value = setInterval(() => fetchConversations(true), 7500);
})
onUnmounted(() => {
  clearInterval(intervalId.value);
})

const scrollToLast = () => {
  setTimeout(() => {
    if (scrollView.value) {
      const last = scrollView.value?.getRenderedRange().last;
      scrollView.value?.scrollToIndex(last, 'smooth');
    }
  }, 100);
}

const sendMessage = async () => {
  try {
    loading.value.send = true;
    if (!currentConversation.value || !currentUser || !messageContent) return;
    const message = await CodeNShareMessageApi.send(
        messageContent.value,
        currentConversation.value.conversationId,
        currentUser.userId
    );
    messages.value = typeof messages.value === 'undefined'
        ? [message]
        : [...messages.value, message];
    messageContent.value = '';
    scrollToLast();
  } catch (e) {
    console.error(e);
  } finally {
    loading.value.send = false;
  }
}

const getMessagesByConversation = async (conversation: Conversation) => {
  try {
    loading.value.fetch = true;
    if (conversation.conversationId === isNewMessage.value) {
      isNewMessage.value = undefined;
    }

    messages.value = await CodeNShareMessageApi.getByConversation(conversation.conversationId);
    currentConversation.value = conversation;
    messageContent.value = '';
    scrollToLast();
  } catch (e) {
    console.error(e);
  } finally {
    loading.value.fetch = false;
  }
}

const onCreateNewConversation = async () => {
  try {
    const members = selectedUsers.value.map(u => u.userId);
    loading.value.create = true
    const newConversation = await CodeNShareConversationApi.create(members);
    conversations.value = [...conversations.value, newConversation];
    openConversationCreationModal.value = false;
    toastNotifications.showSuccess("Conversation créée avec succès");
  } catch (e) {
    console.error(e);
    toastNotifications.showError("Une erreur s'est produite lors de la création de la conversation");
  } finally {
    loading.value.create = false
  }
}


const fetchConversations = async (secondFetch = false) => {
  try {
    if (!secondFetch) loading.value.fetch = true;
    const lastCurrentMessage = conversations.value[0]?.messages.at(-1);

    conversations.value = await CodeNShareConversationApi.getByUser();
    const lastFetchedMessage = conversations.value[0]?.messages.at(-1);

    if (secondFetch && lastCurrentMessage?.messageId !== lastFetchedMessage?.messageId) {
      if (lastFetchedMessage?.sender.userId !== currentUser?.userId) {
        isNewMessage.value = conversations.value[0].conversationId;
      }
    }

    currentConversation.value = conversations.value.find(c => c.conversationId === currentConversation.value?.conversationId);
    if (!secondFetch) scrollToLast();
  } catch (e) {
    console.error(e);
    toastNotifications.showError("Une erreur s'est produite lors de la récupération des conversations");
  } finally {
    loading.value.fetch = false;
  }
}

const onOpenCreateConversation = async () => {
  if (!currentUser) return;
  try {
    loading.value.fetchFriends = true;
    const following = await CodeNShareFriendApi.getFollowingByUser(currentUser.userId);

    friendsOptions.value = following.map(f => ({
          name: f.addressedTo.firstname + ' ' + f.addressedTo.lastname,
          userId: f.addressedTo.userId
        }
    ));

    openConversationCreationModal.value = true;
  } catch (e) {
    console.error(e);
    toastNotifications.showError("Une erreur s'est produite lors de la récupération de vos amis");
  } finally {
    loading.value.fetchFriends = false;
  }
}

</script>

<template>
  <div class="col flex w-full h-full p-2 surface-card" style="background: var(--primary-400)">
    <div
        class="flex flex-column w-5rem sm:w-8rem md:w-13rem lg:w-17rem xl:w-22rem p-0 md:py-2 border-right-1 border-gray-700  ">
      <div class="flex align-items-center justify-content-center md:justify-content-between pb-2 md:py-3 px-2   "
           style="min-height: 70px; max-height: 70px">
        <h3 class="hidden md:block p-0 m-0 text-2xl">Messages</h3>
        <Button :loading="loading.fetchFriends" icon="pi pi-plus" @click="onOpenCreateConversation()"/>
      </div>


      <div class="flex justify-content-center w-full">
        <Divider class="my-0 p-0" style=""/>
      </div>

      <div v-if="loading.fetch" class="absolute" style="top: 45%; left: 40%">
        <ProgressSpinner/>
      </div>
      <div v-else-if="currentConversation"
           class="flex flex-column gap-2 pr-2 justify-content-center py-2 overflow-hidden">
        <div
            v-for="conversation in conversations"
            :key="conversation.conversationId"
            :class="{'selected': currentConversation === conversation, 'new-message': isNewMessage === conversation.conversationId }"
            class="flex gap-2 w-full align-items-center border-round-xl cursor-pointer hover:bg-gray-700"
            @click="getMessagesByConversation(conversation)"
        >
          <UserAvatar
              v-if="conversation.members.length === 1"
              :avatar-size="1.75"
              :avatars="[...conversation.members, conversation.owner].filter(u => u.userId !== currentUser?.userId).map(u => u.avatar)"
              :max="size1"
              class="p-1 border-round-lg"
              @click="currentConversation = conversation"
          />
          <UserAvatar
              v-else
              :avatar-size="1.75"
              :avatars="conversation.members.map(u => u.avatar)"
              :max="size1"
              class="p-1 border-round-lg"
              @click="currentConversation = conversation"
          />
          <div v-if="conversation.messages.at(-1)" class="hidden md:flex flex-column gap-1">
            <div class="text-base">{{ conversation.messages.at(-1)?.sender?.firstname }}</div>
            <small class="text-color-secondary">{{ conversation.messages.at(-1)?.content }}</small>
          </div>
          <div v-else class="hidden md:block text-color-secondary">Vide</div>
        </div>
      </div>
      <div v-else class="p-3 overflow-hidden text-center">
        <span class="block sm:hidden">Vide</span>
        <span class="hidden sm:block">Aucune conversation</span>
      </div>


    </div>
    <div v-if="!loading.fetch && currentConversation"
         class="col flex flex-column h-full justify-content-end p-0 md:py-2">
      <div class="px-3 py-2 relative z-2" style="min-height: 70px; max-height: 70px">
        <InfoCard
            :avatar-urls="currentConversation.members.map(u => u.avatar)"
            :title="currentConversation.owner.firstname + ' ' + currentConversation.owner.lastname"
            :max-avatars="size2"
            :subtitle="dayjs(currentConversation.createdAt).format('[Créé le] DD/MM/YYYY')"
        >
          <template #button>
            <Button icon="pi pi-ellipsis-v" severity="secondary" @click="openOptionsConversation($event)"/>
            <Menu
                ref="menuOptionsConversation"
                :model="optionsConversation"
                popup
            />
          </template>
        </InfoCard>
      </div>
      <div class="flex justify-content-center w-full relative z-2">
        <Divider class="my-0 p-0" style=""/>
      </div>
      <VirtualScroller
          ref="scrollView"
          :itemSize="50"
          :items="messages"
          class="w-full h-full py-4 px-3"
      >
        <template v-slot:item="{ item }">
          <ConversationMessage
              :message="item"
              :side="currentUser?.userId === item.sender.userId ? 'right' : 'left'"
              class="px-4 py-2"
              style="max-width: 75em"
          />
        </template>
      </VirtualScroller>
      <div class="flex gap-3 w-full p-1 sm:p-2 pl-2 sm:pl-3 pt-2 sm:pt-3 border-top-1 border-gray-500">
        <IconField class="flex w-full cursor-pointer" iconPosition="right">
          <InputIcon v-if="!loading.send" class="pi pi-send" @click="sendMessage()"></InputIcon>
          <InputIcon v-else class="pi pi-spin pi-spinner"></InputIcon>
          <Textarea v-model="messageContent" :rows="1" class="w-full text-xs sm:text-sm"
                    placeholder="Ecrire un message"/>
        </IconField>
        <Button icon="pi pi-paperclip" icon-pos="right" severity="secondary"/>
      </div>
    </div>

    <Dialog v-model:visible="openConversationCreationModal" header="Nouvelle conversation" modal>
      <div class="flex flex-column gap-4">
        <MultiSelect
            v-model="selectedUsers"
            :options="friendsOptions"
            class="w-full"
            optionLabel="name"
            placeholder="Sélectionner des utilisateurs"
        />
        <Button
            :loading="loading.create"
            class="w-full"
            label="Créer"
            severity="success"
            @click="onCreateNewConversation()"
        />
      </div>
    </Dialog>
  </div>
</template>

<style scoped>

.selected {
  background-color: #3c3c3c;
  cursor: pointer;
}

.new-message {
  background-color: #49DE8060;
}

</style>