<script lang="ts" setup>

import {computed} from "vue";

const avatars = defineModel('avatars', {
  default: ['https://randomuser.me/api/portraits/men/92.jpg']
});

const props = withDefaults(defineProps<{ avatarSize?: number, max?: number }>(), {avatarSize: 2, max: 5});
const emit = defineEmits(['onAvatarClick']);

const pt = computed(() => ({
  minHeight: `${props.avatarSize}em`,
  minWidth: `${props.avatarSize}em`,
  height: `${props.avatarSize}em`,
  width: `${props.avatarSize}em`,
}));

</script>

<template>
  <AvatarGroup>
    <Avatar
        v-for="(avatar, i) in avatars.slice(0, max)"
        :key="avatar"
        :image="avatar"
        :pt="{image: {style: pt}}"
        :style="pt"
        shape="circle"
        size="large"
        @click="$emit('onAvatarClick', i)"
    />
    <Avatar
        v-if="avatars.length > max"
        :label="`+${avatars.length - max}`"
        :pt="{image: {style: pt}}"
        :style="pt"
        shape="circle"
        size="large"
    />
  </AvatarGroup>
</template>

<style scoped>
.p-avatar-group .p-avatar + .p-avatar {
  margin-left: -1.15em;
}
</style>