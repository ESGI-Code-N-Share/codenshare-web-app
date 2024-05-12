<script lang="ts" setup>

import InfoCard from "@/components/cards/InfoCard.vue";
import {onMounted, ref} from "vue";
import ConversationMessages from "@/components/conversations/ConversationMessages.vue";

const messages = ref<{ content: string, sendAt: string, sendBy: string }[]>([]);

const messageContent = ref('');

onMounted(() => {
  //todo ici tu fetch les messages d'un user
  messages.value = [
    {
      content: "Salut, comment ça va ?",
      sendAt: "12:02",
      sendBy: '11111111-1111-1111-1111-111111111111'
    },
    {
      content: "Bien et toi ?",
      sendAt: "14:36",
      sendBy: '22222222-2222-2222-2222-222222222222'
    },
    {
      content: "J'aimerai te partager un programme qui va pas du tout hacker ton PC car les devs de CodeNShare ont bien pensés la sécurité !",
      sendAt: "14:38",
      sendBy: '11111111-1111-1111-1111-111111111111'
    }
  ]
})


const sendMessage = () => {
  messages.value?.push({
    content: messageContent.value,
    sendAt: new Date().toLocaleTimeString().slice(0, 5),
    sendBy: '11111111-1111-1111-1111-111111111111',
  });
  messageContent.value = '';
}

const getMessagesByConversationId = (conversationId: string) => {
  //todo ici tu fetch les messages d'un autre user
  if (conversationId === '1') {
    messages.value = [
      {
        content: "Salut, comment ça va ?",
        sendAt: "12:02",
        sendBy: '11111111-1111-1111-1111-111111111111'
      },
      {
        content: "Bien et toi ?",
        sendAt: "14:36",
        sendBy: '22222222-2222-2222-2222-222222222222'
      },
      {
        content: "J'aimerai te partager un programme qui va pas du tout hacker ton PC car les devs de CodeNShare ont bien pensés la sécurité !",
        sendAt: "14:38",
        sendBy: '11111111-1111-1111-1111-111111111111'
      }
    ]
  } else if (conversationId === '2') {
    messages.value = [
      {
        content: "Y'a un mec il m'a dit que tu étais un bon dev",
        sendAt: "12:02",
        sendBy: '33333333-3333-3333-3333-333333333333'
      },
      {
        content: "Ah bon ?",
        sendAt: "14:36",
        sendBy: '22222222-2222-2222-2222-222222222222'
      },
      {
        content: "Oui, il m'a dit que tu étais un bon dev et que tu avais un bon niveau en sécurité informatique",
        sendAt: "14:38",
        sendBy: '33333333-3333-3333-3333-333333333333'
      },
      {
        content: "C'est un menteur le crois pas",
        sendAt: "14:38",
        sendBy: '11111111-1111-1111-1111-111111111111'
      },
      {
        content: "C'est vrai, je suis un bon dev et j'ai un bon niveau en sécurité informatique",
        sendAt: "14:38",
        sendBy: '22222222-2222-2222-2222-222222222222'
      },
      {
        content: "Merci pour le compliment",
        sendAt: "14:38",
        sendBy: '33333333-3333-3333-3333-333333333333'
      }
    ]
  } else {
    messages.value = [
      {
        content: 'yo bg',
        sendAt: "12:02",
        sendBy: '11111111-1111-1111-1111-111111111111'
      },
      {
        content: 'ça va bien ?',
        sendAt: "14:36",
        sendBy: '22222222-2222-2222-2222-222222222222'
      }
    ]
  }

}

</script>

<template>
  <div class="h-full md:surface-card border-round-xl p-2 sm:p-4">
    <div class="flex h-full">
      <!-- Conversations   -->
      <div class="col-4 md:col-5 lg:col-4 overflow-hidden" style="min-width: 150px !important;">
        <div class="flex align-items-center justify-content-between">
          <h2 class="text-xl ml-2 my-0 hidden md:block md:text-lg">Conversations</h2>
          <Button class="hidden md:flex" icon="pi pi-plus" icon-pos="right" severity="success" text/>
          <Button class="flex md:hidden w-full text-sm" icon="pi pi-plus" icon-pos="right" label="Nouveau"
                  severity="success"/>
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
              avatar-url="https://randomuser.me/api/portraits/men/1.jpg"
              class="w-full"
              subtitle="Tu m'as envoyé un message ?"
              title="L. Corentin"
              @click="getMessagesByConversationId('1')"
          />
          <InfoCard
              avatar-url="https://randomuser.me/api/portraits/men/2.jpg"
              class="w-full"
              subtitle="Tu m'as envoyé un message ?"
              title="L. Corentin, S. Abdallah et 1 autre personne"
              @click="getMessagesByConversationId('2')"
          />
          <InfoCard
              avatar-url="https://randomuser.me/api/portraits/men/3.jpg"
              class="w-full"
              subtitle="Tu m'as envoyé un message ?"
              title="S. Abdallah"
              @click="getMessagesByConversationId('3')"
          />
        </div>

      </div>

      <!-- Message   -->
      <div class="flex flex-column col h-full z-1">
        <div class="flex flex-column h-10rem">
          <InfoCard
              avatar-url="https://randomuser.me/api/portraits/men/1.jpg"
              class="col-12 p-2"
              subtitle="Dernier message : 12h"
              title="Corentin Lechene"
          >
            <template #button>
              <Button icon="pi pi-ellipsis-v" icon-pos="right" severity="secondary" text/>
            </template>
          </InfoCard>

          <Divider class="col-12 py-2 m-0"/>
        </div>

        <div class="flex flex-column justify-content-end h-full">
          <ConversationMessages :messages="messages" class="col-12 h-full"/>

          <div class="flex gap-3 w-full p-2 border-top-1 border-gray-500">
            <IconField class="flex w-full" iconPosition="right">
              <InputIcon class="pi pi-send" @click="sendMessage()"></InputIcon>
              <Textarea v-model="messageContent" :rows="1" class="w-full text-sm" placeholder="Ecrire un message"/>
            </IconField>
            <Button icon="pi pi-paperclip" icon-pos="right" severity="secondary"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>

<!--<div class="flex justify-content-between align-items-center col-4 md:col-5 lg:col-4 bg-yellow-200" style="min-width: 150px !important;">
      <h2 class="text-xl ml-2 my-0">Conversations</h2>
      <Button
          icon="pi pi-plus"
          icon-pos="right"
          label="Nouveau"
          severity="success"
          @click="onCreateNewProgram"
      />
    </div>
    <div>2</div>-->