<script lang="ts" setup>

type InfoCardProps = {
  avatarUrl: string;
  avatarSize?: number;
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
  <div class="flex justify-content-between align-items-center border-round">
    <div class="flex align-items-center align-self-start">
      <Avatar v-if="avatarUrl" :image="avatarUrl" :pt="{image: {style: pt}}" :style="pt" shape="circle" size="large"
              @click="$emit('onAvatarClick')"/>
      <Avatar v-else :pt="{image: {style: pt}}" :style="pt" icon="pi pi-image" shape="circle" size="large"
              @click="$emit('onAvatarClick')"/>
      <div class="ml-3">
        <div v-if="caption" class="text-xs self-">{{ caption }}</div>
        <div class="text-base">{{ title }}</div>
        <div v-if="subtitle" class="flex text-color-secondary text-sm mt-1 align-items-center">
          <i v-if="subtitleIcon" :class="subtitleIcon" class="pi pr-1"></i>
          <div>{{ subtitle }}</div>
        </div>
      </div>
    </div>
    <div v-if="$slots.button" class="flex gap-2">
      <slot name="button"/>
    </div>
  </div>
</template>

<style scoped>

</style>