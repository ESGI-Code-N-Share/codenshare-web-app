<script lang="ts" setup>

import {Message} from "@/models";

interface ConversationMessageProps {
  message: Message;
  side: 'left' | 'right';
}

defineProps<ConversationMessageProps>()

</script>

<template>
  <div :class="{ 'justify-content-start': side === 'right', 'flex-row-reverse': side === 'right' }"
       class="flex gap-2 align-items-end">
    <Avatar :image="message.sender.avatar" shape="circle"/>
    <div :class="{'bg-gray-700': side === 'right'}" class="bg-gray-500 p-2 border-round-sm" style="max-width: 47.5%">
      {{ message.content }}
    </div>
    <div class="text-sm text-color-secondary">{{ new Date(message.sendAt).toLocaleTimeString() }}</div>
  </div>
</template>

<style scoped>

</style>