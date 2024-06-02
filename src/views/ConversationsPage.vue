<script lang="ts" setup>

import InfoCard from "@/components/cards/InfoCard.vue";
import {computed, onMounted, ref} from "vue";
import ConversationMessages from "@/components/conversations/ConversationMessages.vue";
import {useConversationStore} from "@/stores/conversation.store";
import {useUserStore} from "@/stores/user.store";
import {Conversation, User, UserId} from "@/models";
import {useFriendStore} from "@/stores/friend.store";


const userStore = useUserStore();
const conversationStore = useConversationStore();
const friendStore = useFriendStore();
const currentUser = userStore.currentUser;

const messageContent = ref('');
const menuOptionsConversation = ref();

const openConversationCreationModal = ref(false);
const selectedUsers = ref<User[]>([]);
const friendsOptions = ref<{ name: string, userId: UserId }[]>([]);


const currentConversation = ref<Conversation>();
const conversations = computed(() => conversationStore.conversations);
const messages = computed(() => currentConversation.value?.messages || []);

onMounted(async () => {
  if (currentUser) {
    await conversationStore.fetchConversations(currentUser.userId);
    await friendStore.fetchFriends(currentUser.userId);
    if (conversationStore.conversations.length > 0) {
      currentConversation.value = conversationStore.conversations[0];
    }
    friendsOptions.value = friendStore.friends
        .filter(friend => friend.status === 'accepted')
        .map(friend => ({
          name: friend.addressedBy.firstname + ' ' + friend.addressedBy.lastname,
          userId: friend.addressedBy.userId
        }));
  }
})


const sendMessage = async () => {
  if (!messageContent.value || !currentUser || !currentConversation.value) return;
  try {
    const nextMessage = await conversationStore.sendMessage(
        currentConversation.value.conversationId,
        currentUser.userId,
        messageContent.value,
        //tood
    );
    messageContent.value = '';
    messages.value.push(nextMessage);
    messages.value.pop(); //fixme bug
  } catch (e) {
    console.error(e);
  }
}

const getMessagesByConversation = async (conversation: Conversation) => {
  currentConversation.value = await conversationStore.fetchConversation(conversation.conversationId);
}

const onCreateNewConversation = async () => {
  if (!currentUser || selectedUsers.value.length === 0) return;
  try {
    currentConversation.value = await conversationStore.createConversation(
        currentUser.userId,
        selectedUsers.value.map(user => user.userId),
    );
    openConversationCreationModal.value = false;
    selectedUsers.value = [];
    currentConversation.value = await conversationStore.fetchConversation(currentConversation.value.conversationId);
    conversationStore.conversations.unshift(currentConversation.value);
  } catch (e) {
    console.error(e);
  }
}

const openOptionsConversation = (event: MouseEvent) => {
  menuOptionsConversation.value.toggle(event);
}

const optionsConversation = [
  {
    label: 'Supprimer',
    icon: 'pi pi-trash',
    command: async () => {
      if (!currentConversation.value || !currentUser) return;

      try {
        await conversationStore.leaveConversation(currentConversation.value.conversationId, currentUser.userId)
        conversationStore.conversations = conversationStore.conversations.filter(conversation => conversation.conversationId !== currentConversation.value?.conversationId);
        currentConversation.value = conversationStore.conversations[0];
      } catch (e) {
        console.error(e);
      }
    }
  }
]

</script>

<template>
  <div class="h-full md:surface-card border-round-xl p-2 sm:p-4">
    <div class="flex h-full">
      <!-- Conversations   -->
      <div class="col-4 md:col-5 lg:col-4 overflow-hidden" style="min-width: 150px !important; max-width: 300px">
        <div class="flex align-items-center justify-content-between">
          <h2 class="text-xl ml-2 my-0 hidden md:block md:text-lg">Conversations</h2>
          <Button class="hidden md:flex" icon="pi pi-plus" icon-pos="right" severity="success" text
                  @click="openConversationCreationModal = true"/>
          <Button class="flex md:hidden w-full text-sm" icon="pi pi-plus" icon-pos="right" label="Nouveau"
                  severity="success" @click="openConversationCreationModal = true"/>
        </div>

        <IconField class="" iconPosition="left">
          <InputIcon class="pi pi-search"></InputIcon>
          <InputText class="w-full text-sm border-round-md" placeholder="Chercher un contact"/>
        </IconField>

        <Divider class="col-12 mb-2 mt-0"/>

        <!--  fixme      <VirtualScroller class="col-12" itemSize="50" style="height: calc(100% - 100px)">
                  <div class="flex flex-column gap-2">
                    <InfoCard
                        :avatar-url="`https://randomuser.me/api/portraits/men/${i + 1}.jpg`"
                        class="w-full"
                        subtitle="Tu m'as envoyé un message ?"
                        title="L. Corentin"
                    />
                  </div>
                </VirtualScroller>-->

        <div class="flex flex-column gap-2">
          <InfoCard
              v-for="conversation in conversations"
              :avatar-url="conversation.users[0].avatar"
              :subtitle="conversation.messages.length > 0 ? conversation.messages[0].content : 'Pas de message'"
              :title="conversation.users[0].lastname[0] + ' ' + conversation.users[0].firstname"
              class="w-full"
              @click="getMessagesByConversation(conversation)"
          />
        </div>

      </div>

      <!-- Message   -->
      <div class="flex flex-column col h-full z-1">
        <div v-if="currentConversation" class="flex flex-column h-10rem">
          <InfoCard
              :avatar-url="currentConversation.owner.avatar"
              :subtitle="currentConversation.messages.length > 0 ? currentConversation.messages[0].content : 'Pas de message'"
              :title="currentConversation.owner.lastname[0] + ' ' + currentConversation.owner.firstname"
              class="col-12 p-2"
              style="max-width: 25em;"
          >
            <template #button>
              <Button aria-label="more-options" icon="pi pi-ellipsis-v" severity="secondary"
                      @click="openOptionsConversation($event)"/>
              <Menu ref="menuOptionsConversation" :model="optionsConversation" popup/>
            </template>
          </InfoCard>

          <Divider class="col py-2 m-0"/>
        </div>

        <div class="flex flex-column justify-content-end h-full">
          <ConversationMessages :messages="messages" class="col-12 h-full"/>

          <div class="flex gap-3 w-full p-2 border-top-1 border-gray-500">
            <IconField class="flex w-full cursor-pointer" iconPosition="right">
              <InputIcon class="pi pi-send" @click="sendMessage()"></InputIcon>
              <Textarea v-model="messageContent" :rows="1" class="w-full text-sm" placeholder="Ecrire un message"/>
            </IconField>
            <Button icon="pi pi-paperclip" icon-pos="right" severity="secondary"/>
          </div>
        </div>
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

</style>