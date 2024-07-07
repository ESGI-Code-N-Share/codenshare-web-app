<script lang="ts" setup>

import {Program, ProgramsRequest} from "@/models";

interface ProgramListItemProps {
  program: Program | ProgramsRequest;
  noRound?: boolean;
  clickable?: boolean;
  deletable?: boolean;
}

defineProps<ProgramListItemProps>();
defineEmits(['onDelete', 'onClick']);

</script>

<template>
  <div
      :class="[noRound ? '' : 'border-round-xl', clickable ? 'cursor-pointer': '']"
      class="flex justify-content-between align-items-center p-1"
      style="background-color: #121212;"
      @click="$emit('onClick')"
  >
    <div class="flex align-items-center">
      <Avatar
          :image="program.imageURL"
          :pt="{image: {class: 'border-round-xl', style: 'object-fit: cover; min-height: 50px; min-width: 50px; max-height: 50px; max-width: 50px'}}"
          size="xlarge"
      />
      <div class="pl-3">
        <h4 class="m-0">{{ program.name }}</h4>
        <div class="text-color-secondary text-sm mt-1">
          <span v-if="'authorName' in program">{{
              program.authorName.slice(0, 1) + ' ' + program.authorLastName
            }}</span>
          <span v-else>{{ program.description }}</span>
        </div>
      </div>
    </div>
    <Button v-if="deletable" icon="pi pi-trash" severity="danger" text @click.stop="$emit('onDelete')"/>
  </div>
</template>

<style scoped>

</style>