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
  <div class="flex flex-column gap-2">
    <div :style="{'margin-right': side === 'right' ? '50px' : '0', 'margin-left': side === 'left' ? '50px' : '0'}">
      <Image v-if="message.image" :src="message.image" alt="Image" preview width="250" @error="$emit('onError')"/>
    </div>
    <div :class="{'flex-row-reverse': side === 'right'}" class="flex gap-2">
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
  </div>
</template>

<style scoped>

</style>