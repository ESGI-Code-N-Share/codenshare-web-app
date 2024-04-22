<script lang="ts" setup>

import {ref} from "vue";
import {ToastService} from "@/services/toast.service";
import {useToast} from "primevue/usetoast";

const toastNotification = new ToastService(useToast());

type Accept = 'image/*' | 'video/*' | 'audio/*';

interface InputFileProps {
  accept: Accept;
  maxHeightPreview?: string;
}

const props = defineProps<InputFileProps>();
const emit = defineEmits(['onFileSelected', 'onWrongFileType'])

const fileUrl = ref('');

const isHovering = ref(false);

/* methods */

const handleDrop = (event: DragEvent) => {
  isHovering.value = false;
  event.preventDefault();
  if (!event.dataTransfer) return;

  const files = event.dataTransfer.files;
  if (files.length > 0) {
    const file = files[0];
    processFile(file);
  }
};

const fileToBlob = (file: File): Promise<Blob> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (result instanceof ArrayBuffer) {
        resolve(new Blob([result]));
      }
    };
    reader.readAsArrayBuffer(file);
  });
};

const processFile = async (file: File) => {
  // check if accepted file type
  if (!file?.type) return;
  const accepted = props.accept?.split(',')?.map(a => a.trim()) || [];

  console.log(accepted, file.type)
  if (!accepted.some(accept => file.type.startsWith(accept.replace('*', '')))) {
    toastNotification.showError('Type de fichier non supporté');
    emit('onWrongFileType', {fileType: file.type});
    return;
  }

  if (file.type.startsWith('image/')) {
    const blob = await fileToBlob(file);

    // todo call api to upload file
    const formData = new FormData();
    formData.append('file', blob, file.name);

    // temp
    const fileName = 'image';

    fileUrl.value = URL.createObjectURL(blob);
    emit('onFileSelected', {fileName, fileUrl: fileUrl.value});
  } else {
    // todo call api to upload file
  }
};


const handleClick = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = props.accept || 'image/*';
  input.onchange = (e) => {
    const files = (e.target as HTMLInputElement).files;
    if (files && files.length === 1) {
      const file = files[0];
      processFile(file);
    }
  };
  input.click();
};

</script>


<template>
  <div
      :class="{ 'bg-gray-700': isHovering, 'p-2': !!fileUrl, 'p-4': !fileUrl }"
      class="drop-zone border-dashed border-gray-500 border-round text-center text-color-secondary cursor-pointer h-auto"
      style="background-color: var(--gray-800);"
      @click="handleClick()"
      @drop="handleDrop($event)"
      @dragover.prevent="isHovering = true"
      @dragleave.prevent="isHovering = false"
  >
    <img v-if="fileUrl" :class="`max-h-${maxHeightPreview || 15}rem`" :src="fileUrl" alt="image" class="w-full h-full"
         style="object-fit: contain"/>
    <div v-else>
      <i class="pi pi-download text-5xl mb-2"/>
      <div>Glissez-déposez votre fichier</div>
    </div>
    <Toast class="sm:w-auto" position="top-right" style="width: 85%;"/>
  </div>
</template>