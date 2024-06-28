<script lang="ts" setup>

import {Program} from "@/models";
import {onMounted, ref} from "vue";
import {dia, shapes} from "@joint/core";
import {ImageRectangle, ProgramRectangle} from "@/utils/graph.util";

interface ProgramPipelineGraphProps {
  program: Program;
}

const props = defineProps<ProgramPipelineGraphProps>()
const emit = defineEmits(['onUpdate'])

const pipelineEl = ref<HTMLDivElement>()

const filetypes = [
  {label: 'Image', value: 'image'},
  {label: 'Video', value: 'video'},
  {label: 'Audio', value: 'audio'},
  {label: 'Text', value: 'text'},
  {label: 'Other', value: 'other'},
]
const filetypeModel = ref<typeof filetypes[0]>({label: '', value: ''})

//
const selectedElement = ref<dia.ElementView>()
const filename = ref('')
const filetype = ref('')

const graph = ref<dia.Graph>()
const paper = ref<dia.Paper>()

onMounted(() => {
  // format the program into a graph
  initGraph()
})


function setLinkEventHandlers() {
  if (!graph.value || !paper.value) return


}

function setSelectedElementEventHandlers() {
  if (!graph.value || !paper.value) return

  let tempLink: dia.Link | null = null;
  paper.value.on('link:pointerdown', function (linkView) {
    tempLink = linkView.model;
  });

  paper.value.on('cell:pointermove', function (_, __, x, y) {
    if (tempLink) {
      tempLink.set('target', {x: x, y: y});
    }
  });

  // handle selecting an element
  paper.value.on('element:pointerclick', function (cellView) {
    if (cellView.model.attributes.type === 'standard.ImageRectangle') {
      selectedElement.value = cellView;
      const metadata = cellView.model.attributes.metadata || {name: '', type: ''};
      filename.value = metadata.name;
      filetype.value = metadata.type;
      filetypeModel.value = filetypes.find(f => f.value === metadata.type) || {label: '', value: ''};
    }
  });

  //handle deselecting an element
  paper.value.on('blank:pointerclick', function () {
    selectedElement.value = undefined;
    filename.value = '';
    filetype.value = '';
  });
}

function initElements() {
  if (!graph.value || !paper.value) return

  //fixme position must be inside the paper
  const programRectangle = new ProgramRectangle({x: 250, y: 150})
  const program = programRectangle.toJointJsElement();

  const images = []
  for (let i = 0; i < programRectangle.inputs + programRectangle.outputs; i++) {
    const imageRectangle = new ImageRectangle({x: 100, y: 30 + i * 100})
    images.push(imageRectangle.toJointJsElement());
  }

  // Add the area to the graph
  graph.value.addCell(program);
  graph.value.addCells(images);
}


function initPaper() {
  if (!graph.value) return

  paper.value = new dia.Paper({
    el: pipelineEl.value,
    model: graph.value,
    width: window.innerWidth - 75,
    height: window.innerHeight - 200,
    gridSize: 10,
    background: {
      color: 'rgba(214,214,214,0.1)',
    },
    // Interactive options
    interactive(cellView, event) {
      if (cellView.model.isLink()) {
        return {vertexAdd: false, labelMove: false};
      }
      return true;
    },
    // Default link options
    defaultLink: new shapes.standard.Link({
      attrs: {
        line: {
          stroke: 'white',
          strokeWidth: 1,
        }
      },
    }),
    // validate link connection
    validateConnection(cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
      if (!cellViewS || !cellViewT || !magnetS || !magnetT || cellViewS === cellViewT) {
        return false;
      }
      const portSource = magnetS.getAttribute('port');
      const portTarget = magnetT.getAttribute('port');
      if (!portSource || !portTarget) {
        return false;
      }
      // image and programs can only be connected to programs
      if (cellViewS.model.attributes.type === 'standard.ImageRectangle' && cellViewT.model.attributes.type !== 'standard.ProgramRectangle') {
        return false;
      }
      //only out can be connected to in and vice versa
      if (portSource.includes('out') && portTarget.includes('out')) {
        return false;
      }
      // if the target port is full (length === 1), return false
      const connections = graph.value!.getConnectedLinks(cellViewT.model)
      return connections.filter(link => link.get('target').port === portTarget).length !== 1;
    },
  })
}

const saveElement = () => {
  if (!selectedElement.value) return

  const cellView = selectedElement.value
  const cell = cellView.model
  if (!cellView || !cell || !filename.value || !filetype.value) return
  if (filename.value.length > 15 || filename.value.length === 0) return

  const text = filename.value.slice(0, 15);
  const metadata = {name: text, type: filetype.value}
  if (cell.attributes?.attrs?.label?.text) {
    cell.attributes.attrs.label.text = text
    cell.attributes.attrs.label.fontSize = text.length > 10 ? 10 : 14
  }
  cell.prop('metadata', metadata)
  cellView.update(cell)
  selectedElement.value = undefined
  paper.value?.update()
}

const initGraph = () => {
  graph.value = new dia.Graph()

  initPaper();
  initElements();
  setLinkEventHandlers();
  setSelectedElementEventHandlers();
}

const reloadGraph = () => {
  if (!graph.value || !paper.value) return

  graph.value.clear()
  initGraph()
}


</script>

<template>
  <div class="relative">
    <div class="flex gap-2 justify-content-end align-items-baseline absolute top-0 right-0 p-2 z-5">
      <InputText
          v-if="selectedElement"
          v-model.trim="filename"
          :invalid="filename.length > 15 || filename.length === 0"
          :placeholder="$t('program.forms.filename.placeholder')"
      />
      <dropdown
          v-if="selectedElement"
          v-model="filetypeModel"
          :options="filetypes"
          :placeholder="$t('program.forms.type.placeholder')"
          :value="filetype"
          data-key="value"
          option-label="label"
          @change="filetype = $event.value.value"
      />
      <Button v-if="selectedElement" icon="pi pi-check" severity="success" @click="saveElement()"/>
      <Button v-else icon="pi pi-sync" severity="success" @click="reloadGraph()"/>
    </div>
    <div ref="pipelineEl"></div>
  </div>
</template>

<style scoped>
Button {
  margin: 0.15em auto;
}
</style>