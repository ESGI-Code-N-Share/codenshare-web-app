<script lang="ts" setup>

import {ref} from "vue";
import {ToastService} from "@/services/toast.service";
import {useToast} from "primevue/usetoast";
import {MediaApi} from "@/api/media";

const toastNotification = new ToastService(useToast());

type Accept = 'image/png' | 'image/jpeg' | 'image/jpg' | 'text/plain' | string

interface InputFileProps {
  renameFile?: string;
  accept: Accept;
  maxHeightPreview?: string;
  uploadable?: boolean;
}

const modelValue = defineModel<string>('fileUrl')
const props = defineProps<InputFileProps>();
const emit = defineEmits(['onFileSelected', 'onWrongFileType'])

const fileUrl = ref('');

const isHovering = ref(false);
const uploaded = ref(false);

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

  let apiUrl = '';
  if (props.uploadable) {
    try {
      const res = await MediaApi.uploadFile(file);
      apiUrl = res.imageURL.replace("0.0.0.0", import.meta.env.VITE_MEDIA_URL);
    } catch (e) {
      console.error(e);
    }
  }

  // for images
  if (file.type.startsWith('image/')) {
    const blob = await fileToBlob(file);

    fileUrl.value = URL.createObjectURL(blob);
    modelValue.value = fileUrl.value;

    if (props.renameFile) {
      const format = file.name.split('.').pop()
      const newFile = new File([blob], `${props.renameFile}.${format}`, {type: file.type});
      emit('onFileSelected', {file: newFile, fileUrl: apiUrl});
      uploaded.value = true;
      return;
    }
    uploaded.value = true;
    emit('onFileSelected', {file: file, fileUrl: apiUrl});
  }

  // others
  if (props.renameFile) {
    const format = file.name.split('.').pop()
    const newFile = new File([file], `${props.renameFile}.${format}`, {type: file.type});
    emit('onFileSelected', {file: newFile, fileUrl: apiUrl});
    uploaded.value = true;
    return;
  }
  uploaded.value = true;
  emit('onFileSelected', {file: file, fileUrl: apiUrl});
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
      :class="{ 'bg-gray-700': isHovering, 'border-gray-500': !uploaded, 'border-green-700': uploaded, 'p-2 bg-gray-900': !!modelValue, 'p-4': !modelValue }"
      class="drop-zone border-dashed border-round text-center text-color-secondary cursor-pointer h-auto"
      style="background-color: var(--gray-800);"
      @click="handleClick()"
      @drop="handleDrop($event)"
      @dragover.prevent="isHovering = true"
      @dragleave.prevent="isHovering = false"
  >
    <div v-if="uploaded && !modelValue" class="flex flex-column gap-1 p-2">
      <i class="pi pi-check text-4xl cursor-pointer"/>
      <small class="text-color-secondary">{{ $t('program.inputs_file.uploaded') }}</small>
    </div>
    <img v-else-if="modelValue" :class="`max-h-${maxHeightPreview || 15}rem`" :src="modelValue" alt="image"
         class="w-full h-full"
         style="object-fit: contain"/>
    <div v-else>
      <i class="pi pi-download text-5xl mb-2"/>
      <div>{{ $t('global.drop_a_file.placeholder') }}</div>
    </div>
    <Toast class="sm:w-auto" position="top-right" style="width: 85%;"/>
  </div>
</template>