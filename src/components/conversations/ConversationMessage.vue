<script lang="ts" setup>

interface ConversationMessageProps {
  message: {
    content: string;
    avatar: string;
    sendAt: string;
    sendBy: string;
  }
  side: 'left' | 'right';
}

defineProps<ConversationMessageProps>()

</script>

<template>
  <div :class="{ 'justify-content-start': side === 'right', 'flex-row-reverse': side === 'right' }"
       class="flex gap-2 align-items-end">
    <Avatar :image="`https://randomuser.me/api/portraits/men/${message.sendBy.charAt(0)}.jpg`" shape="circle"/>
    <div :class="{'bg-gray-700': side === 'right'}" class="bg-gray-500 p-2 border-round-sm" style="max-width: 47.5%">
      {{ message.content }}
    </div>
    <div class="text-sm text-color-secondary">{{ message.sendAt }}</div>
  </div>
</template>

<style scoped>

</style>