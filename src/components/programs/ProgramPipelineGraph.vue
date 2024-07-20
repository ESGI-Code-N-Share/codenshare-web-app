<script lang="ts" setup>

import {Program, ProgramInstructionsInput, ProgramInstructionsOutput} from "@/models";
import {onMounted, ref} from "vue";
import {dia, shapes} from "@joint/core";
import {ImageRectangle, ProgramRectangle} from "@/utils/graph.util";
import {CodeNShareProgramApi} from "@/api/codenshare";
import {ToastService} from "@/services/toast.service";
import {useToast} from "primevue/usetoast";

interface ProgramPipelineGraphProps {
  program: Program;
}

const props = defineProps<ProgramPipelineGraphProps>()
const emit = defineEmits(['onUpdate'])

const toastNotifications = new ToastService(useToast());

const pipelineEl = ref<HTMLDivElement>()

const filetypes = [
  {label: 'PNG', value: 'image/png'},
  {label: 'JPEG', value: 'image/jpeg'},
  {label: 'JPG', value: 'image/jpg'},
  {label: 'TXT', value: 'text/plain'},
]
const filetypeModel = ref<typeof filetypes[0]>({label: '', value: ''})

const loading = ref({update: false})

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

  let tempLink: dia.Link | null = null;
  paper.value.on('link:pointerdown', function (linkView) {
    tempLink = linkView.model;
  });

  paper.value.on('cell:pointermove', function (_, __, x, y) {
    if (tempLink) {
      tempLink.set('target', {x: x, y: y});
    }
  });

  paper.value.on('link:connect', function (linkView) {
    const link = linkView.model;
    const sourceId = link.get('source').id;
    const targetId = link.get('target').id;
    const sourcePort = link.get('source').port;
    const targetPort = link.get('target').port;

    if (sourceId && targetId && sourcePort && targetPort) {
      const newLink = new shapes.standard.Link({
        source: {id: sourceId, port: sourcePort},
        target: {id: targetId, port: targetPort},
        attrs: {
          line: {
            stroke: 'white',
            strokeWidth: 1,
          }
        },
      });
      graph.value!.addCell(newLink);
    }
  });

  paper.value.on('link:mouseleave', function (linkView) {
    if (tempLink) {
      tempLink.remove();
    }
  });

}

function setSelectedElementEventHandlers() {
  if (!graph.value || !paper.value) return

  // handle selecting an element
  paper.value.on('element:pointerclick', function (cellView) {
    if (cellView.model.attributes.type === 'standard.ImageRectangle') {
      if (selectedElement.value?.model?.attributes?.attrs?.body) {
        selectedElement.value.model.attributes.attrs.body.stroke = 'black';
        selectedElement.value.model.attributes.attrs.body.strokeWidth = 1;
        selectedElement.value.update(selectedElement.value.model);
      }

      selectedElement.value = cellView;
      const metadata = cellView.model.attr('metadata') || {name: '', type: ''};
      filename.value = metadata.name;
      filetype.value = metadata.type;
      filetypeModel.value = filetypes.find(f => f.value === metadata.type) || {label: '', value: ''};

      //add a border to the selected element
      if (cellView.model.attributes?.attrs?.body) {
        cellView.model.attributes.attrs.body.stroke = 'white';
        cellView.model.attributes.attrs.body.strokeWidth = 2;
        cellView.update(cellView.model);
      }
    }
  });

  //handle deselecting an element
  paper.value.on('blank:pointerclick', function () {
    //Remove border from the selected element
    if (selectedElement.value?.model?.attributes?.attrs?.body) {
      selectedElement.value.model.attributes.attrs.body.stroke = 'black';
      selectedElement.value.model.attributes.attrs.body.strokeWidth = 1;
      selectedElement.value.update(selectedElement.value.model);
    }
    selectedElement.value = undefined;
    filename.value = '';
    filetype.value = '';
  });
}

function initElements() {
  if (!graph.value || !paper.value) return

  //fixme position must be inside the paper
  const programRectangle = new ProgramRectangle(
      props.program.programId,
      {x: 100, y: 200},
      props.program.name || '',
      props.program.instructions.inputs.length,
      props.program.instructions.outputs.length
  )
  const program = programRectangle.toJointJsElement();
  graph.value.addCell(program);

  const inputs = props.program.instructions.inputs.map((input, index) => {
    const random = Math.floor(100 + Math.random() * 1000)
    const imageRectangle = new ImageRectangle(
        `input-${random}`,
        {x: 100 + index * 200, y: 50},
        input.name || '',
        {name: props.program.instructions.inputs[index].name, type: props.program.instructions.inputs[index].type}
    )
    const image = imageRectangle.toJointJsElement();
    image.prop('metadata', {name: input.name || '', type: input.type || ''})
    return image
  })
  const outputs = props.program.instructions.outputs.map((output, index) => {
    const random = Math.floor(100 + Math.random() * 1000)
    const imageRectangle = new ImageRectangle(
        `output-${random}`,
        {x: 100 + index * 200, y: 300},
        output.name || '',
        {name: props.program.instructions.outputs[index].name, type: props.program.instructions.outputs[index].type}
    )
    const image = imageRectangle.toJointJsElement();
    image.prop('metadata', {name: output.name || '', type: output.type || ''})
    return image
  })

  graph.value.addCells(inputs);
  graph.value.addCells(outputs);

  // link program to inputs and outputs
  for (const [index, input] of Object.entries(inputs)) {
    const metadataSource = input.prop('metadata')
    const link = new shapes.standard.Link({
      source: {id: input.id, port: 'out0'},
      target: {id: program.id, port: `in${index}`},
      attrs: {
        line: {
          stroke: 'white',
          strokeWidth: 1,
        }
      },
    });
    link.labels([
      {
        attrs: {
          text: {
            text: metadataSource?.type || '',
            fill: 'black'
          }
        },
        position: {
          distance: 0.5
        }
      },
    ]);
    graph.value.addCells([link]);
  }

  for (const [index, output] of Object.entries(outputs)) {
    const metadataSource = output.prop('metadata')
    const link = new shapes.standard.Link({
      source: {id: program.id, port: `out${index}`},
      target: {id: output.id, port: 'in0'},
      attrs: {
        line: {
          stroke: 'white',
          strokeWidth: 1,
        }
      },
    });
    link.labels([
      {
        attrs: {
          text: {
            text: metadataSource?.type || '',
            fill: 'black'
          }
        },
        position: {
          distance: 0.5
        }
      },
    ]);
    graph.value.addCells([link]);
  }
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
      //image "out" can be only connected to program "in"
      if (cellViewS.model.attributes.type === 'standard.ImageRectangle' && cellViewT.model.attributes.type === 'standard.ProgramRectangle') {
        if (portSource.includes('out') && portTarget.includes('in')) {
          return true;
        }
      }
      // image out can be connected to image in
      if (cellViewS.model.attributes.type === 'standard.ImageRectangle' && cellViewT.model.attributes.type === 'standard.ImageRectangle') {
        if (portSource.includes('out') && portTarget.includes('in')) {
          return true;
        }
      }

      //only out can be connected to in and vice versa
      if (portSource.includes('out') && portTarget.includes('out')) {
        return false;
      }
      // if the target port is full (length === 1), return false
      const connections = graph.value!.getConnectedLinks(cellViewT.model)
      if (connections.filter(link => link.get('target').port === portTarget).length === 1) {
        return false;
      }
      // // if the source port is already connected to a port, return false
      // if(connections.filter(link => link.get('source').port === portSource).length === 1) {
      //   return false;
      // }
      return true
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
    cell.attributes.attrs.metadata = metadata
  }
  cellView.update(cell)
  selectedElement.value = undefined
  paper.value?.update()
}


const addPort = (type: 'in' | 'out') => {
  if (!graph.value || !paper.value) return

  const program = graph.value.getCells().find(cell => cell.attributes.type === 'standard.ProgramRectangle')
  if (!program) return

  const ports = graph.value.getConnectedLinks(program, {inbound: type === 'in', outbound: type === 'out'}).length
  const text = type === 'in' ? 'input' : 'output'
  const imageRectangle = new ImageRectangle(
      `${text}-${ports + 1}`,
      {x: 100 + ports * 200, y: type === 'in' ? 50 : 300},
      `${text}_${ports + 1}`,
      {name: `${text}_${ports + 1}`, type: 'image/png'} //default to image
  )
  const image = imageRectangle.toJointJsElement();
  graph.value.addCell(image)

  //get program element
  const programElement = graph.value!.getElements().find(cell => cell.id === program.id)
  programElement?.addPort({group: type, id: `${type}${ports}`})

  if (type == 'in') {
    const link = new shapes.standard.Link({
      source: {id: image.id, port: 'out0'},
      target: {id: program.id, port: `${type}${ports}`},
      attrs: {
        line: {
          stroke: 'white',
          strokeWidth: 1,
        }
      },
    });
    graph.value.addCells([link]);
  } else if (type == 'out') {
    const link = new shapes.standard.Link({
      source: {id: program.id, port: `${type}${ports}`},
      target: {id: image.id, port: 'in0'},
      attrs: {
        line: {
          stroke: 'white',
          strokeWidth: 1,
        }
      },
    });
    graph.value.addCells([link]);
  }
}


const removeElement = () => {
  if (!graph.value || !selectedElement.value) return

  const program = graph.value.getCells().find(cell => cell.attributes.type === 'standard.ProgramRectangle')
  if (!program) return

  //1. get the port of the program it is connected to
  const links = graph.value.getConnectedLinks(selectedElement.value.model)
  links.forEach(link => {
    const source = link.get('source')
    const target = link.get('target')
    if (source.id === program.id) {
      const port = source.port
      const programElement = graph.value!.getElements().find(cell => cell.id === program.id)
      programElement?.removePort(port)
    } else if (target.id === program.id) {
      const port = target.port
      const programElement = graph.value!.getElements().find(cell => cell.id === program.id)
      programElement?.removePort(port)
    }
  })

  //2. remove the element
  selectedElement.value.model.remove()
  selectedElement.value = undefined
  paper.value?.update()
}

const mapToJsObject = async () => {
  if (!graph.value) {
    toastNotifications.showError("Une erreur s'est produite lors de la sauvegarde du programme");
    return;
  }

  const cells = graph.value!.getCells()
  const program = cells.find(cell => cell.attributes.type === 'standard.ProgramRectangle')
  if (!program) {
    toastNotifications.showError("Une erreur s'est produite lors de la sauvegarde du programme");
    return;
  }

  const inputs: ProgramInstructionsInput[] = graph.value.getConnectedLinks(program, {inbound: true}).map(link => {
    const cell = link.get('source').id
    const metadata = graph.value!.getCell(cell)?.attr('metadata')
    return {
      name: metadata?.name || '',
      type: metadata?.type || '',
    }
  })
  const outputs: ProgramInstructionsOutput[] = graph.value.getConnectedLinks(program, {outbound: true}).map(link => {
    const cell = link.get('target').id
    const metadata = graph.value!.getCell(cell)?.attr('metadata')
    return {
      name: metadata?.name || '',
      type: metadata?.type || '',
    }
  })

  if (inputs.length === 0 && outputs.length > 0) {
    toastNotifications.showError("Un programme doit avoir au moins un port d'entrée");
    return;
  } else if (inputs.length > 0 && outputs.length === 0) {
    toastNotifications.showError("Un programme doit avoir au moins un port de sortie");
    return;
  }

  try {
    loading.value.update = true;
    await CodeNShareProgramApi.updateInstructions(props.program.programId, {
      inputs: inputs,
      outputs: outputs,
    })
    toastNotifications.showSuccess("Modifications enregistrées");
    emit('onUpdate')
    await reloadGraph()
  } catch (e) {
    console.error(e);
    toastNotifications.showError("Une erreur s'est produite lors de la sauvegarde du programme");
  } finally {
    loading.value.update = false;
  }
}

const initGraph = () => {
  graph.value = new dia.Graph()

  initPaper();
  initElements();
  setLinkEventHandlers();
  setSelectedElementEventHandlers();
  paper.value?.transformToFitContent({padding: 100, maxScale: 1})
}

const reloadGraph = async () => {
  if (!graph.value || !paper.value) return

  try {
    const program = await CodeNShareProgramApi.get(props.program.programId)
    props.program.instructions = program.instructions

    graph.value.clear()
    initGraph()
  } catch (e) {
    console.error(e);
  }
}


</script>

<template>
  <div class="relative">
    <div class="flex gap-2 justify-content-start absolute top-0 left-0 p-2 z-5">
      <Button
          :label="$t('program.buttons.add_in_port')"
          icon="pi pi-plus"
          severity="primary"
          @click="addPort('in')"
      />
      <Button
          :label="$t('program.buttons.add_out_port')"
          icon="pi pi-plus"
          severity=""
          style="background: #dc7a00; border-color: #dc7a00"
          @click="addPort('out')"
      />
    </div>
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
      <Button
          v-if="selectedElement"
          icon="pi pi-trash"
          severity="danger"
          @click="removeElement()"
      />
      <Button
          v-if="!selectedElement"
          icon="pi pi-sync"
          severity="secondary"
          @click="reloadGraph()"
      />
      <Button
          v-if="!selectedElement"
          :loading="loading.update"
          icon="pi pi-save"
          severity="secondary"
          style="background: #4ade80; color: #000;"
          @click="mapToJsObject()"
      />
      <Button v-else icon="pi pi-check" severity="success" @click="saveElement()"/>

    </div>
    <div ref="pipelineEl"></div>
  </div>
</template>

<style scoped>
Button {
  margin: 0.15em auto;
}
</style>