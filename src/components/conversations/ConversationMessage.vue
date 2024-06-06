<script lang="ts" setup>

import {Message} from "@/models";
import UserAvatar from "@/components/avatars/UserAvatar.vue";

interface ConversationMessageProps {
  message: Message;
  side: 'left' | 'right';
}

defineProps<ConversationMessageProps>()

</script>

<template>
  <div :class="{ 'justify-content-start': side === 'right', 'flex-row-reverse': side === 'right' }"
       class="flex flex-wrap sm:flex-nowrap gap-2 align-items-end">
    <UserAvatar :avatar-size="1.75" :avatars="[message.sender.avatar]"/>
    <div
        :class="{'bg-gray-700': side === 'right'}"
        class="bg-gray-500 p-2 border-round-sm text-sm sm:text-base"
        style="max-width: 47.5%"
    >
      {{ message.content }}
    </div>
    <div class="text-xs sm:text-sm text-color-secondary">{{ new Date(message.sendAt).toLocaleTimeString('fr') }}</div>
  </div>
</template>

<style scoped>

</style>