<script lang="ts" setup>

import {Program, ProgramInstructionsInput, ProgramInstructionsOutput} from "@/models";
import {onMounted, ref} from "vue";
import {dia, shapes} from "@joint/core";
import {ImageRectangle, ProgramRectangle} from "@/utils/graph.util";
import {ToastService} from "@/services/toast.service";
import {useToast} from "primevue/usetoast";

interface ProgramPipelinesGraphProps {
  programs: Program[];
}

const props = defineProps<ProgramPipelinesGraphProps>()
const emit = defineEmits(['onUpdate'])

const toastNotifications = new ToastService(useToast());

const pipelineEl = ref<HTMLDivElement>()

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

function initElements() {
  if (!graph.value || !paper.value) return

  //fixme position must be inside the paper
  const programs = []
  let offset = 0
  for (const program of props.programs) {
    const programRectangle = new ProgramRectangle({x: 250, y: 50 + offset})
    const p = programRectangle.toJointJsElement();
    programs.push(p)

    const inputs = program.instructions.inputs.map((input, index) => {
      const imageRectangle = new ImageRectangle({x: 100, y: 50 + (offset * 2) + index * 100})
      const image = imageRectangle.toJointJsElement();
      image.prop('metadata', {name: input.name || '', type: input.type || ''})
      return image
    })
    const outputs = program.instructions.outputs.map((output, index) => {
      const imageRectangle = new ImageRectangle({x: 400, y: 50 + (offset * 2) + index * 100})
      const image = imageRectangle.toJointJsElement();
      image.prop('metadata', {name: output.name || '', type: output.type || ''})
      return image
    })

    graph.value.addCells(inputs);
    graph.value.addCells(outputs);
    offset += 100
  }
  graph.value.addCells(programs);
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
    const metadata = graph.value!.getCell(cell)?.prop('metadata')
    return {
      name: metadata?.name || '',
      type: metadata?.type || '',
    }
  })
  const outputs: ProgramInstructionsOutput[] = graph.value.getConnectedLinks(program, {outbound: true}).map(link => {
    const cell = link.get('target').id
    const metadata = graph.value!.getCell(cell)?.prop('metadata')
    return {
      name: metadata?.name || '',
      type: metadata?.type || '',
    }
  })

  // console.log({
  //   programId: props.program.programId,
  //   inputs: inputs,
  //   outputs: outputs,
  // })
  //
  // if (inputs.length !== props.program.instructions.inputs.length || outputs.length !== props.program.instructions.outputs.length) {
  //   toastNotifications.showError("Le programme doit avoir le même nombre d'entrées et de sorties");
  //   return;
  // }
  //
  // try {
  //   loading.value.update = true;
  //   await CodeNShareProgramApi.updateInstructions(props.program.programId, {
  //     inputs: inputs,
  //     outputs: outputs,
  //   })
  //   toastNotifications.showSuccess("Modifications enregistrées");
  // } catch (e) {
  //   console.error(e);
  //   toastNotifications.showError("Une erreur s'est produite lors de la sauvegarde du programme");
  // } finally {
  //   loading.value.update = false;
  // }
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