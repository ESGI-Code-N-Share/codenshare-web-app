<script lang="ts" setup>

import {Program, ProgramInstructionsInput, ProgramInstructionsOutput} from "@/models";
import {onMounted, ref} from "vue";
import {dia, shapes} from "@joint/core";
import {ImageRectangle, ProgramRectangle} from "@/utils/graph.util";
import {ToastService} from "@/services/toast.service";
import {useToast} from "primevue/usetoast";
import {CodeNShareProgramApi} from "@/api/codenshare";

interface ProgramPipelinesGraphProps {
  instructions: { programId: string, inputs: ProgramInstructionsInput, outputs: ProgramInstructionsOutput }[]
}

const props = defineProps<ProgramPipelinesGraphProps>()
const emit = defineEmits(['onUpdate'])

const toastNotifications = new ToastService(useToast());

const pipelineEl = ref<HTMLDivElement>()

const programs = ref<Program[]>([])
const graph = ref<dia.Graph>()
const paper = ref<dia.Paper>()

onMounted(async () => {
  try {
    const promises = props.instructions.map((instruction) => CodeNShareProgramApi.get(instruction.programId))
    programs.value = await Promise.all(promises);
    if (programs.value.length > 0) {
      toastNotifications.showSuccess("Programs fetched successfully");
      initGraph()
    }
  } catch (e) {
    console.error(e);
    toastNotifications.showError("Failed to fetch programs");
  }
})


function setLinkEventHandlers() {
  if (!graph.value || !paper.value) return

  let tempLink: dia.Link | null = null;
  paper.value.on('link:pointerdown', function (linkView) {
    //if the link is image to program then it's indestructible
    if (linkView.model.id) {
      if (String(linkView.model.id).includes('indestructible')) {
        return
      }
    }
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

function initElements() {
  if (!graph.value || !paper.value) return

  //fixme position must be inside the paper
  let offset = 0
  for (const program of programs.value) {
    const programRectangle = new ProgramRectangle({x: 200, y: 125 + (offset * 3)})
    const p = programRectangle.toJointJsElement();
    graph.value.addCell(p);


    const inputs = program.instructions.inputs.map((input, index) => {
      const imageRectangle = new ImageRectangle(
          {x: 100 + index * 200, y: 50 + (offset * 3)},
          input.name || '',
          {name: program.instructions.inputs[index].name, type: program.instructions.inputs[index].type}
      )
      const image = imageRectangle.toJointJsElement();
      image.prop('metadata', {name: input.name || '', type: input.type || ''})
      return image
    })
    const outputs = program.instructions.outputs.map((output, index) => {
      const imageRectangle = new ImageRectangle(
          {x: 100 + index * 200, y: 200 + (offset * 3)},
          output.name || '',
          {name: program.instructions.outputs[index].name, type: program.instructions.outputs[index].type}
      )
      const image = imageRectangle.toJointJsElement();
      image.prop('metadata', {name: output.name || '', type: output.type || ''})
      return image
    })

    graph.value.addCells(inputs);
    graph.value.addCells(outputs);
    offset += 100

    // link program to inputs and outputs (indestructible)
    for (const [index, input] of Object.entries(inputs)) {
      const link = new shapes.standard.Link({
        id: `indestructible-${input.id}-${p.id}-${index}`,
        source: {id: input.id, port: 'out0'},
        target: {id: p.id, port: `in${index}`},
        attrs: {
          line: {
            stroke: 'white',
            strokeWidth: 1,
          }
        },
      });
      graph.value.addCells([link]);
    }

    for (const [index, output] of Object.entries(outputs)) {
      const link = new shapes.standard.Link({
        id: `indestructible-${p.id}-${output.id}-${index}`,
        source: {id: p.id, port: `out${index}`},
        target: {id: output.id, port: 'in0'},
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

      // image "out" can be linked to image "in" only
      if (portSource.includes('out') && portTarget.includes('out')) {
        return false
      }
      // only one link to "in" port
      if (portTarget.includes('in') && graph.value!.getConnectedLinks(cellViewT.model, {inbound: true}).length > 0) {
        return false
      }
      return true;
    },
  })
}

const mapToJsObject = async () => {
  if (!graph.value) {
    toastNotifications.showError("Une erreur s'est produite lors de la sauvegarde du programme");
    return;
  }

  const cells = graph.value!.getCells()
  const programCells = cells.filter(cell => cell.attributes.type === 'standard.ProgramRectangle')

  //objectif d'avoir ce format la
  type ProgramInstructionsInputOutput = {
    name: string,
    type: string,
    file: null,
  }
  type ProgramInstructions = {
    programId: string,
    inputs: ProgramInstructionsInputOutput[],
    outputs: ProgramInstructionsInputOutput[],
  }

  const instructions: ProgramInstructions[] = []
  let index = 0
  for (const program of programCells) {
    //récupérer les inputs des rectangles qui sont connectés à ce program

    const programLinkInputs = graph.value!.getConnectedLinks(program, {inbound: true})
    const inputs = programLinkInputs.map(programLink => {
      const source = programLink.get('source').id
      const sourceCell = graph.value!.getCell(source)

      if (index === 0) {
        const metadata = sourceCell?.prop('metadata')
        return {
          name: metadata?.name || '',
          type: metadata?.type || '',
          file: null,
        }
      }

      const _inputs = graph.value?.getConnectedLinks(sourceCell, {inbound: true})
      if (_inputs && _inputs.length > 0) {
        const _sourceCell = _inputs[0].get('source').id
        const _source = graph.value!.getCell(_sourceCell)
        const metadata = _source?.prop('metadata')
        return {
          name: metadata?.name || '',
          type: metadata?.type || '',
          file: null,
        }
      }

      //todo cannot continue
      return {
        name: '',
        type: '',
        file: null,
      }
    })

    const programLinkOutputs = graph.value!.getConnectedLinks(program, {outbound: true})
    const outputs = programLinkOutputs.map(programLink => {
      const target = programLink.get('target').id
      const targetCell = graph.value!.getCell(target)
      const metadata = targetCell?.prop('metadata')
      return {
        name: metadata?.name || '',
        type: metadata?.type || '',
        file: null,
      }
    })

    console.log(inputs)
    console.log(outputs)

    instructions.push({
      programId: programs.value[index].programId,
      inputs: inputs,
      outputs: outputs,
    })
    index += 1
  }

  console.log(instructions)

  emit('onUpdate', instructions)
}

const initGraph = () => {
  graph.value = new dia.Graph()

  initPaper();
  initElements();
  setLinkEventHandlers();
}

const reloadGraph = () => {
  if (!graph.value || !paper.value) return

  graph.value.clear()
  initGraph()
}

const saveElement = () => {
  mapToJsObject()
}


</script>

<template>
  <div class="relative">
    <div class="flex gap-2 justify-content-end align-items-baseline absolute top-0 right-0 p-2 z-5">
      <Button icon="pi pi-save" severity="success" @click="saveElement()"/>
    </div>
    <div ref="pipelineEl"></div>
  </div>
</template>

<style scoped>
Button {
  margin: 0.15em auto;
}
</style>