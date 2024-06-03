<script lang="ts" setup>

import InfoCard from "@/components/cards/InfoCard.vue";
import {computed, onMounted, ref} from "vue";
import ConversationMessages from "@/components/conversations/ConversationMessages.vue";
import {Conversation, User, UserId} from "@/models";


const messageContent = ref('');
const menuOptionsConversation = ref();

const openConversationCreationModal = ref(false);
const selectedUsers = ref<User[]>([]);
const friendsOptions = ref<{ name: string, userId: UserId }[]>([]);


const currentConversation = ref<Conversation>();
const conversations = ref<Conversation[]>([]);
const messages = computed(() => currentConversation.value?.messages || []);

onMounted(async () => {

})


const sendMessage = async () => {

}

const getMessagesByConversation = async (conversation: Conversation) => {
}

const onCreateNewConversation = async () => {

}

const openOptionsConversation = (event: MouseEvent) => {
  menuOptionsConversation.value.toggle(event);
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
              :avatar-url="conversation.members[0].avatar"
              :subtitle="conversation.messages.length > 0 ? conversation.messages[0].content : 'Pas de message'"
              :title="conversation.members[0].lastname[0] + ' ' + conversation.members[0].firstname"
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