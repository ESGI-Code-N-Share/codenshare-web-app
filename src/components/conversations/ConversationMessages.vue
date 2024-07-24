<script lang="ts" setup>

import ConversationMessage from "@/components/conversations/ConversationMessage.vue";
import {Message} from "@/models";

defineProps<{ messages: Message[] }>();

// const userStore = useUserStore();
const currentUser = {userId: '22222222-2222-2222-2222-222222222222'};

</script>

<template>
  <div class="flex flex-column gap-3 w-full">
    <ConversationMessage
        v-for="message in messages"
        :message="message"
        :side="currentUser?.userId === message.sender.userId ? 'right' : 'left'"
        style="max-width: 50em"
    />
  </div>
</template>

<style scoped>

</style>