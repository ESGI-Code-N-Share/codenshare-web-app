<script lang="ts" setup>

import UserAvatar from "@/components/avatars/UserAvatar.vue";

type InfoCardProps = {
  avatarUrl?: string;
  avatarUrls?: string[];
  avatarSize?: number;
  maxAvatars?: number;
  title: string;
  subtitle?: string;
  subtitleIcon?: string;
  caption?: string;
}

const props = withDefaults(defineProps<InfoCardProps>(), {avatarSize: 2});
const emit = defineEmits(['onAvatarClick']);

const pt = {
  minHeight: `${props.avatarSize}em`,
  minWidth: `${props.avatarSize}em`,
  height: `${props.avatarSize}em`,
  width: `${props.avatarSize}em`,
}

</script>

<template>
  <div class="flex justify-content-between gap-2 align-items-center">
    <div class="flex gap-2 align-items-center">
      <UserAvatar v-if="avatarUrls" :avatars="avatarUrls" :max="maxAvatars"
                  @on-avatar-click="$emit('onAvatarClick', $event)"/>
      <UserAvatar v-else :avatars="[avatarUrl]" @on-avatar-click="$emit('onAvatarClick', $event)"/>

      <div class="flex flex-column gap-1">
        <div v-if="caption" class="text-xs self-">{{ caption }}</div>
        <div class="text-sm sm:text-base">{{ title }}</div>
        <div v-if="subtitle" class="flex text-color-secondary text-xs sm:text-sm">
          <div>
            <i v-if="subtitleIcon" :class="subtitleIcon" class="pi pr-1"></i>
          </div>
          <div>{{ subtitle }}</div>
        </div>
      </div>
    </div>
    <div v-if="$slots.button" class="flex gap-1">
      <slot name="button"/>
    </div>
  </div>
</template>

<style scoped>

</style>