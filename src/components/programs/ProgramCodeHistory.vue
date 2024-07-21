<script lang="ts" setup>
import {CodeHistory, Program} from "@/models";
import {onMounted, ref} from "vue";
import dayjs from "dayjs/esm/index.js";
import {VAceEditor} from "vue3-ace-editor";

dayjs.locale(localStorage.getItem('language') || 'fr');

interface ProgramCodeHistoryProps {
  program: Program;
}

const props = defineProps<ProgramCodeHistoryProps>()
const emit = defineEmits(['onImport'])

const codeHistories = ref<CodeHistory[]>([])
const selectedCodeHistory = ref<CodeHistory>()

const layout = ref<'vertical' | 'horizontal'>('vertical')

onMounted(() => {
  codeHistories.value = props.program.codeHistories.reverse();
  selectedCodeHistory.value = codeHistories.value[0];

  layout.value = window.innerWidth > 768 ? 'horizontal' : 'vertical'
})
</script>

<template>
  <Splitter :layout="layout" class="h-full w-full">
    <SplitterPanel :size="10" class="h-full overflow-y-scroll">
      <div class="flex flex-column gap-2 p-2">
        <div
            v-for="codeHistory in codeHistories"
            :class="{'border-white border-1': selectedCodeHistory?.codeHistoryId === codeHistory.codeHistoryId}"
            class="p-2 bg-gray-800 hover:bg-gray-700 border-round cursor-pointer"
            @click="selectedCodeHistory = codeHistory"
        >
          <div class="text-lg">{{ dayjs(codeHistory.createdAt).format('DD/MM/YYYY HH:mm') }}</div>
        </div>
      </div>
    </SplitterPanel>
    <SplitterPanel class="h-full">
      <div v-if="codeHistories.length === 0" class="p-2">{{ $t('program.no_code_history') }}</div>
      <div v-else-if="selectedCodeHistory" :class="{'relative': layout === 'horizontal'}" class="h-full p-2">
        <Button
            :class="{'absolute top-0 right-0 mr-2 mt-2 z-5 w-auto': layout === 'horizontal'}"
            :label="$t('program.buttons.import')"
            class="text-sm mb-2 w-full"
            icon="pi pi-download"
            icon-pos="right"
            @click="emit('onImport', selectedCodeHistory)"
        />
        <VAceEditor
            v-model:value="selectedCodeHistory.code"
            lang="javascript"
            readonly
            style="height: 10em; min-height: 100%;"
            theme="monokai"
        />
      </div>
    </SplitterPanel>
  </Splitter>
</template>

<style scoped>

</style>