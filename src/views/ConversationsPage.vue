<script lang="ts" setup>

import {onMounted, onUnmounted, ref} from "vue";
import {Conversation, Message, User, UserId} from "@/models";
import UserAvatar from "@/components/avatars/UserAvatar.vue";
import {CodeNShareConversationApi, CodeNShareMessageApi} from "@/api/codenshare";
import InfoCard from "@/components/cards/InfoCard.vue";
import {useUserStore} from "@/stores/user.store";
import ConversationMessage from "@/components/conversations/ConversationMessage.vue";

const userStore = useUserStore();
const currentUser = userStore.currentUser;

const messageContent = ref('');
const menuOptionsConversation = ref();

const openConversationCreationModal = ref(false);
const selectedUsers = ref<User[]>([]);
const friendsOptions = ref<{ name: string, userId: UserId }[]>([]);

const intervalId = ref<NodeJS.Timeout>();
const isNewMessage = ref('');


const currentConversation = ref<Conversation>();
const conversations = ref<Conversation[]>([]);
const messages = ref<Message[]>()

onMounted(async () => {
  await fetchConversations();
  if (conversations.value.length > 0) {
    currentConversation.value = conversations.value[0];
    messages.value = conversations.value[0].messages
  }
  intervalId.value = setInterval(() => fetchConversations(true), 10000);
})
onUnmounted(() => {
  clearInterval(intervalId.value);
})

const sendMessage = async () => {
  try {
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
  } catch (e) {
    console.error(e);
  }
}

const getMessagesByConversation = async (conversation: Conversation) => {
  try {
    messages.value = await CodeNShareMessageApi.getByConversation(conversation.conversationId);
    currentConversation.value = conversation;
    isNewMessage.value = '';
  } catch (e) {
    console.error(e);
  }
}

const onCreateNewConversation = async () => {
}

const openOptionsConversation = (event: MouseEvent) => {
  menuOptionsConversation.value.toggle(event);
}

const fetchConversations = async (secondFetch = false) => {
  try {
    conversations.value = await CodeNShareConversationApi.getByUser();
    const firstConversation = conversations.value[0];
    // here we check if the first conversation has a new message
    // and if the current conversation is not the same as the first conversation
    // and if the last message is not from the current user
    // then we set the conversation id to the isNewMessage and we display it as a new message
    if (secondFetch) {
      if (firstConversation?.conversationId !== currentConversation.value?.conversationId) {
        const lastMessage = firstConversation.messages.at(-1);
        if (lastMessage && lastMessage.sender.userId !== currentUser?.userId) {
          isNewMessage.value = firstConversation.conversationId;
        }
      } else {
        messages.value = firstConversation.messages;
      }
    }
    currentConversation.value = conversations.value.find(c => c.conversationId === currentConversation.value?.conversationId);
  } catch (e) {
    console.error(e);
  }
}

const optionsConversation = [
  {
    label: 'Supprimer',
    icon: 'pi pi-trash',
    command: async () => {
      if (!currentConversation.value) return;


    }
  }
]

</script>

<template>
  <div class="col flex w-full h-full p-2 surface-card" style="background: var(--primary-400)">
    <div class="flex flex-column w-6rem sm:w-8rem md:w-13rem lg:w-17rem p-0 md:py-2 border-right-1 border-gray-700  ">
      <div class="flex align-items-center justify-content-center md:justify-content-between pb-2 md:py-3 px-2   "
           style="min-height: 70px; max-height: 70px">
        <h3 class="hidden md:block p-0 m-0 text-2xl">Messages</h3>
        <Button icon="pi pi-plus" @click="openConversationCreationModal = true"/>
      </div>


      <div class="flex justify-content-center w-full">
        <Divider class="my-0 p-0" style=""/>
      </div>

      <div v-if="currentConversation" class="flex flex-column gap-2 pr-2 justify-content-center py-2 overflow-hidden">
        <div
            v-for="conversation in conversations"
            :key="conversation.conversationId"
            :class="{'selected': currentConversation === conversation, 'new-message': isNewMessage === conversation.conversationId }"
            class="flex gap-2 w-full align-items-center border-round-xl"
            @click="getMessagesByConversation(conversation)"
        >
          <UserAvatar
              :avatar-size="1.75"
              :avatars="conversation.members.map(u => u.avatar)"
              :max="1"
              class="p-1 border-round-lg"
              style="min-width: 75px !important;"
              @click="currentConversation = conversation"
          />
          <div v-if="conversation.messages.at(-1)" class="hidden md:flex flex-column gap-1">
            <div class="text-base">{{ conversation.messages.at(-1)?.sender?.firstname }}</div>
            <small>{{ conversation.messages.at(-1)?.content }}</small>
          </div>
          <div class="hidden md:block">Pas de message</div>
        </div>


      </div>
      <div v-else>
        Vide
      </div>


    </div>
    <div v-if="currentConversation" class="col flex flex-column p-0 md:py-2">
      <div class="px-3 py-2 relative z-2" style="min-height: 70px; max-height: 70px">
        <InfoCard
            :avatar-url="currentConversation.owner.avatar"
            :title="currentConversation.owner.firstname + ' ' + currentConversation.owner.lastname"
        >
          <template #button>
            <Button icon="pi pi-ellipsis-v" @click="openOptionsConversation($event)"/>
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
      <div class="flex flex-column gap-3 w-full h-full pt-2 px-3">
        <ConversationMessage
            v-for="message in messages"
            :message="message"
            :side="currentUser?.userId === message.sender.userId ? 'right' : 'left'"
            style="max-width: 50em"
        />
      </div>
      <div class="flex gap-3 w-full p-2 pl-3 pt-3 border-top-1 border-gray-500">
        <IconField class="flex w-full cursor-pointer" iconPosition="right">
          <InputIcon class="pi pi-send" @click="sendMessage()"></InputIcon>
          <Textarea v-model="messageContent" :rows="1" class="w-full text-sm" placeholder="Ecrire un message"/>
        </IconField>
        <Button icon="pi pi-paperclip" icon-pos="right" severity="secondary"/>
      </div>
    </div>
  </div>
</template>

<style scoped>

.selected {
  background-color: #252525;
  cursor: pointer;
}

.new-message {
  background-color: #49DE8060;
}

</style>