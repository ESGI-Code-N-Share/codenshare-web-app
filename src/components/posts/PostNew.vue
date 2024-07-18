<script lang="ts" setup>

import {ref} from "vue";
import InputFile from "@/components/files/InputFile.vue";
import InfoCard from "@/components/cards/InfoCard.vue";
import {useUserStore} from "@/stores/user.store";
import {CodeNSharePostApi, CodeNShareProgramApi} from "@/api/codenshare";
import {ToastService} from "@/services/toast.service";
import {useToast} from "primevue/usetoast";
import {useI18n} from "vue-i18n";

const emit = defineEmits(['onPublished']);

const userStore = useUserStore();
const currentUser = userStore.currentUser;
const toastNotifications = new ToastService(useToast());
const {t} = useI18n();

const menuCreatePost = ref();

const loading = ref({create: false})
const addImage = ref(false);
const addProgram = ref(false);

const title = ref('');
const content = ref('');
const image = ref('');
const program = ref('');

const programModel = ref();
const programsOptions = ref<{ name: string, value: string }[]>([])

const createPostOptions = ref<any[]>([
  {
    items: [
      {
        label: t('post.buttons.add_image'),
        icon: 'pi pi-image',
        command() {
          addImage.value = true;
          this.disabled = true;
        },
      },
      {
        label: t('post.buttons.add_program'),
        icon: 'pi pi-book',
        command() {
          fetchUserPrograms()
              .then(() => addProgram.value = true)
              .then(() => this.disabled = true)
              .catch(e => console.error(e));
        },
      },
      {
        separator: true,
      },

    ]
  },
  {
    label: t('post.publish'),
    items: [
      {
        label: t('post.buttons.submit'),
        icon: 'pi pi-send',
        class: 'border-round text-color-primary',
        style: 'color: #2e7d32',
        async command() {
          if (!title.value || !content.value) {
            return;
          }
          try {
            loading.value.create = true;
            console.log(title.value, content.value, image.value, program.value);
            await CodeNSharePostApi.create(title.value, content.value, image.value, program.value);
            emit('onPublished');
            toastNotifications.showSuccess('Publication créée');
            reset();
          } catch (e) {
            console.error(e);
            toastNotifications.showError("Une erreur s'est produite lors de la création de la publication");
          } finally {
            loading.value.create = false;
          }
        }
      },
      {
        separator: true,
      },
      {
        label: t('post.buttons.cancel'),
        icon: 'pi pi-refresh',
        class: 'border-round text-color-primary',
        style: 'color: #f87171',
        command() {
          reset()
        }
      }
    ]
  }

]);

const fetchUserPrograms = async () => {
  try {
    const programs = await CodeNShareProgramApi.getByUser(currentUser!.userId);
    programsOptions.value = programs.map(p => ({name: p.name, value: p.programId}));
  } catch (e) {
    console.error(e);
    toastNotifications.showError("Une erreur s'est produite lors de la récupération des programmes");
  }
}

function reset() {
  addProgram.value = false;
  addImage.value = false;
  title.value = '';
  content.value = '';

  if (createPostOptions.value[0].items) {
    createPostOptions.value[0].items.forEach(item => item.disabled = false);
  }
}


const openCreatePost = (event: Event) => {
  menuCreatePost.value.toggle(event);
}

</script>

<template>
  <div v-if="currentUser" class="flex flex-column gap-3 surface-card border-round-xl p-3">
    <InfoCard :avatar-url="currentUser.avatar" :subtitle="$t('global.today')" :title="userStore.fullName"
              subtitle-icon="pi-clock">
      <template #button>
        <Button aria-label="more-options" icon="pi pi-ellipsis-v" severity="secondary" @click="openCreatePost($event)"/>
        <Menu ref="menuCreatePost" :model="createPostOptions" popup/>
      </template>
    </InfoCard>
    <!-- Form   -->
    <div class="flex flex-column gap-2">
      <InputText v-model="title" :placeholder="$t('post.forms.title.placeholder')" class="w-full" variant="filled"/>
      <Textarea v-model="content" :placeholder="$t('post.forms.content.placeholder')" class="w-full" rows="3"
                variant="filled"/>
      <InputFile v-if="addImage" accept="image/*" max-height-preview="5" @on-file-selected="image = $event.fileUrl"/>
      <Dropdown
          v-if="addProgram"
          v-model="programModel"
          :options="programsOptions"
          :placeholder="$t('post.forms.program.placeholder')"
          option-label="name"
          option-value="value"
          @change="program = $event.value"
      />
    </div>
  </div>
</template>

<style scoped>

</style>