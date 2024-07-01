<script lang="ts" setup>

import {Program} from "@/models";
import {nextTick, onMounted, ref} from "vue";
import {dia, shapes} from "@joint/core";
import {useToast} from "primevue/usetoast";
import {ToastService} from "@/services/toast.service";
import {ImageRectangle, ProgramRectangle} from "@/utils/graph.util";
import {DAG, IInput, IOutput, SimpleNode} from "@/utils/dag.util";


const programs = defineModel('programs', {type: Array as () => Program[], default: []})
const props = defineProps()
const emit = defineEmits(['onInstructions'])

const toastNotifications = new ToastService(useToast());

const pipelineEl = ref<HTMLDivElement>()

const graph = ref<dia.Graph>()
const paper = ref<dia.Paper>()

onMounted(async () => {
  try {
    initGraph()
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
  if (!graph.value || !paper.value) return;

  // Constants for grid layout
  const horizontalSpacing = 400;
  const verticalSpacing = 250;
  const programYOffset = 125;

  let offsetX = 0;
  let offsetY = 0;

  for (const [index, program] of Object.entries(programs.value)) {
    // Calculate grid positions
    const row = Math.floor(parseInt(index) / 2);
    const col = parseInt(index) % 2;
    offsetX = col * horizontalSpacing;
    offsetY = row * verticalSpacing;

    // Position for program
    const programRectangle = new ProgramRectangle(
        program.programId,
        {x: 150 + offsetX, y: programYOffset + offsetY},
        program.name || '',
        program.instructions.inputs.length,
        program.instructions.outputs.length
    );
    const p = programRectangle.toJointJsElement();
    graph.value.addCell(p);

    const inputs = program.instructions.inputs.map((input, index) => {
      const x = 100 + index * 200 + offsetX;
      const y = 50 + offsetY;
      const randomId = Date.now() + '-' + index;
      const imageRectangle = new ImageRectangle(`input-${randomId}`, {x, y}, input.name || '', {
        name: input.name,
        type: input.type
      });
      const image = imageRectangle.toJointJsElement();
      image.prop('metadata', {name: input.name || '', type: input.type || ''});
      return image;
    });

    const outputs = program.instructions.outputs.map((output, index) => {
      const x = 100 + index * 200 + offsetX;
      const y = 200 + offsetY;
      const randomId = Date.now() + '-' + index;
      const imageRectangle = new ImageRectangle(`output-${randomId}`, {x, y}, output.name || '', {
        name: output.name,
        type: output.type
      });
      const image = imageRectangle.toJointJsElement();
      image.prop('metadata', {name: output.name || '', type: output.type || ''});
      return image;
    });

    graph.value.addCells(inputs);
    graph.value.addCells(outputs);

    // Link program to inputs and outputs (indestructible)
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
    width: pipelineEl.value?.offsetWidth,
    height: '100%',
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

  const instructions = new DAG()
  const cells = graph.value!.getCells()

  for (const [index, program] of Object.entries(programs.value)) {
    const programCell = cells.find(cell => cell.id === program.programId)
    if (!programCell) {
      toastNotifications.showError("Une erreur s'est produite lors de la sauvegarde du programme");
      return;
    }

    // inputs
    const programLinkInputs = graph.value!.getConnectedLinks(programCell, {inbound: true})
    const inputs: IInput[] = programLinkInputs.map(programLink => {
      const source = programLink.get('source').id
      const sourceCell = graph.value!.getCell(source)
      const metadata = sourceCell?.prop('metadata')

      if (!metadata?.type || !metadata?.name) {
        toastNotifications.showError(`Le programme ${program.name} a une entrée invalide`)
        throw new Error("Entrée de programme invalide")
      }

      const _inputs = graph.value?.getConnectedLinks(sourceCell, {inbound: true})
      // first program has on "in" port
      if (parseInt(index) === 0 || !_inputs || _inputs.length === 0) {
        return {
          id: source,
          filename: metadata.name || '',
          filetype: metadata.type || '',
          file: null,
          relatedTo: null,
        }
      }
      const _sourceCell = _inputs[0].get('source').id
      const _source = graph.value!.getCell(_sourceCell)
      const _metadata = _source?.prop('metadata')

      if (!_metadata?.type || !_metadata?.name) {
        toastNotifications.showError(`Program ${program.name} has invalid input`)
        throw new Error("Invalid program input")
      }

      return {
        id: source,
        relatedTo: _sourceCell,
        filename: _metadata.name || '',
        filetype: _metadata.type || '',
        file: null,
      }
    })

    // outputs
    const programLinkOutputs = graph.value!.getConnectedLinks(programCell, {outbound: true})
    const outputs: IOutput[] = programLinkOutputs.map(programLink => {
      const target = programLink.get('target').id
      const targetCell = graph.value!.getCell(target)
      const metadata = targetCell?.prop('metadata')

      if (!metadata?.type || !metadata?.name) {
        toastNotifications.showError(`Program ${program.name} has invalid output`)
        throw new Error("Invalid program output")
      }

      return {
        id: target,
        filename: metadata.name || '',
        filetype: metadata.type || '',
        url: null,
      }
    })

    instructions.addNode(new SimpleNode(program.programId, inputs, outputs))
  }

  //check if programs are connected

  try {
    instructions.topologicalSort()
    instructions.visualize()

    const object = instructions.toJsObject()
    try {
      const formattedInstructions = object.map(instruction => {
        return {
          program: programs.value.find(program => program.programId === instruction.id),
          inputs: instruction.inputs,
          outputs: instruction.outputs,
        }
      })
      emit('onInstructions', formattedInstructions)
    } catch (e) {
      console.error(e);
      toastNotifications.showError("Failed to save program");
    }
  } catch (e) {
    toastNotifications.showError("Les programmes ne sont pas connectés")
  }
}

const initGraph = () => {
  graph.value = new dia.Graph()

  nextTick(() => {
    initPaper();
    initElements();
    setLinkEventHandlers();
    paper.value?.transformToFitContent({padding: 25, maxScale: 1})
  })
}

const saveElement = () => {
  mapToJsObject()
}


</script>

<template>
  <div class="parent-container">
    <div class="flex gap-2 justify-content-end align-items-baseline absolute top-0 right-0 p-2 z-5">
      <Button icon="pi pi-arrow-right" severity="success" @click="saveElement()"/>
    </div>
    <div ref="pipelineEl" class="paper-container"></div>
  </div>
</template>

<style scoped>
Button {
  margin: 0.15em auto;
}

.parent-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.paper-container {
  width: 100%;
  height: 100%;
}
</style>