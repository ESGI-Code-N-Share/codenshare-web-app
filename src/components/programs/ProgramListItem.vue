<script lang="ts" setup>

import {Program} from "@/models";

interface ProgramListItemProps {
  program: Program;
}

defineProps<ProgramListItemProps>();
defineEmits(['onDelete']);

</script>

<template>
  <div class="flex justify-content-between align-items-center border-round-2xl p-1"
       style="background-color: #121212;">
    <div class="flex align-items-center">
      <Avatar
          :image="program.imageURL"
          :pt="{image: {class: 'border-round-xl', style: 'object-fit: cover; min-height: 50px; min-width: 50px; max-height: 50px; max-width: 50px'}}"
          size="xlarge"
      />
      <div class="pl-3">
        <h4 class="m-0">{{ program.name }}</h4>
        <div class="text-color-secondary text-sm mt-1">{{
            program.authorName.slice(0, 1) + ' ' + program.authorLastName
          }}
        </div>
      </div>
    </div>
    <Button icon="pi pi-trash" severity="danger" text @click="$emit('onDelete')"/>
  </div>
</template>

<style scoped>

</style>