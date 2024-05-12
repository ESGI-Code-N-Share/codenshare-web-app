<script lang="ts" setup>

import ConversationMessage from "@/components/conversations/ConversationMessage.vue";

defineProps<{ messages: any[] }>();

const currentUserId = "11111111-1111-1111-1111-111111111111"; //todo change

</script>

<template>
  <div class="flex flex-column gap-3 w-full bg-purple-200">
    <ConversationMessage v-for="message in messages" :message="message"
                         :side="currentUserId === message.sendBy ? 'right' : 'left'"/>
  </div>
</template>

<style scoped>

</style>