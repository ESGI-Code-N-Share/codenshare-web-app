<script lang="ts" setup>
import {ref} from 'vue';
import {Edge, MarkerType, Node, Panel, useVueFlow, VueFlow} from '@vue-flow/core'
import {Background} from '@vue-flow/background'
import {Controls} from '@vue-flow/controls'
import {Program} from "@/models";
import {IInput, IOutput} from "@/utils/dag.util";
import {ToastService} from "@/services/toast.service";
import {useToast} from "primevue/usetoast";

const programs = defineModel('programs', {type: Array as () => Program[], default: []})
const props = defineProps<{ readonly?: boolean }>()
const emit = defineEmits(['onInstructions', 'onBack'])

const toastNotifications = new ToastService(useToast());

const {
  onInit,
  onConnect,
  fitViewOnInitDone,
  fitView,
  onEdgesChange,
  addNodes,
  getNodes,
  getEdges,
  setEdges,
  addEdges,
  toObject,
  setCenter,
} = useVueFlow()

const nodes = ref<Node[]>([])

const edges = ref<Edge[]>([])

/**
 * This is a Vue Flow event-hook which can be listened to from anywhere you call the composable, instead of only on the main component
 * Any event that is available as `@event-name` on the VueFlow component is also available as `onEventName` on the composable and vice versa
 *
 * onInit is called when the VueFlow viewport is initialized
 */
onInit(() => {
  fitViewOnInitDone.value = true
  initElements()
  fitView({padding: 100})

  if (props.readonly) {
    //center the graph
    setCenter(100, 50, {zoom: 0.75})
    logToObject()
  }
})


onEdgesChange((param) => {
  if (props.readonly) return;

  nodes.value = getNodes.value.filter((node) => node.type !== 'input' && node.type !== 'output')
  edges.value = getEdges.value.filter((edge) => edge.source !== 'input' && edge.target !== 'output')
  // every edges set to animate
  setEdges(getEdges.value.map(edge => {
    return {
      ...edge,
      animated: false
    }
  }));
})

function initElements() {
  let counter = 0;
  let xOffset = 0; // Horizontal offset to space out different programs

  //bleu ciel, bleu rouge et bleu vert
  programs.value.forEach((program, index) => {
    const inputYOffset = -100;  // Vertical offset for inputs
    const outputYOffset = 200;  // Vertical offset for outputs
    const nodeWidth = 200;      // Width of each node for horizontal spacing
    const spaceBetweenPrograms = 300; // Space between programs

    const colors = ['#1dafec', '#d59622', '#13c61c'];
    // Create inputs
    const inputs = program.instructions.inputs.map((input, idx) => {
      counter++;
      return {
        id: counter.toString(),
        type: 'default',
        position: {x: xOffset + (idx * outputYOffset), y: inputYOffset},
        data: {
          label: input.name,
          filename: input.name,
          filetype: input.type,
          nodeType: 'input',
        },
        deletable: false,
        style: {
          // backgroundColor: colors[index],
        }
      };
    });

    // Create outputs
    const outputs = program.instructions.outputs.map((output, idx) => {
      counter++;
      return {
        id: counter.toString(),
        type: 'default',
        position: {x: xOffset + (idx * outputYOffset), y: (outputYOffset / 2)},
        data: {
          label: output.name,
          filename: output.name,
          filetype: output.type,
          nodeType: 'output',
        },
        deletable: false,
        style: {
          // backgroundColor: colors[index],
        }
      };
    });

    // Create program node
    addNodes({
      id: program.programId,
      type: 'program',
      position: {x: (outputYOffset / 2) + xOffset, y: 0},
      data: {
        label: program.name.slice(0, 20) + (program.name.length > 20 ? '...' : ''),
      },
      connectable: false,
      deletable: false,
      style: {
        // backgroundColor: colors[index],
      }
    });

    // Add nodes to graph
    inputs.forEach(input => addNodes(input));
    outputs.forEach(output => addNodes(output));

    // Create edges
    inputs.forEach(input => addEdges({
      deletable: false,
      source: input.id,
      target: program.programId,
      markerEnd: MarkerType.ArrowClosed,
      label: input.data.filetype,
      labelStyle: {
        fill: 'white',
      },
      labelShowBg: false
    }));
    outputs.forEach(output => addEdges({
      deletable: false,
      source: program.programId,
      target: output.id,
      markerEnd: MarkerType.ArrowClosed,
      label: output.data.filetype,
      labelStyle: {
        fill: 'white',
      },
      labelShowBg: false,
    }));

    // Update xOffset for the next program
    xOffset += nodeWidth + spaceBetweenPrograms;
  });
}

/**
 * onConnect is called when a new connection is created.
 *
 * You can add additional properties to your new edge (like a type or label) or block the creation altogether by not calling `addEdges`
 */
onConnect((connection) => {
  const source = getNodes.value.find((node) => node.id === connection.source)
  const target = getNodes.value.find((node) => node.id === connection.target)

  if (source?.data?.filetype !== target?.data?.filetype) {
    toastNotifications.showError('Cannot connect nodes with different file types')
    return;
  }

  //if the source is an output, we can't connect it to another output
  if (source?.data?.nodeType === 'output' && target?.data?.nodeType === 'output') {
    toastNotifications.showError('Cannot connect output to output')
    return;
  }

  addEdges(connection)
})


/**
 * toObject transforms your current graph data to an easily persist-able object
 */
function logToObject() {
  try {
    const object = transformVueFlowObject(toObject())
    const formattedInstructions = object.map(instruction => {
      return {
        program: programs.value.find(program => program.programId === instruction.id),
        inputs: instruction.inputs,
        outputs: instruction.outputs,
      }
    })
    console.log(formattedInstructions)
    emit('onInstructions', formattedInstructions)
  } catch (e) {
    console.error(e);
    toastNotifications.showError('An error occurred while transforming the graph to instructions');
  }
}


function transformVueFlowObject(vueFlowObject: any): { id: string, inputs: IInput[], outputs: IOutput[] }[] {
  const n = vueFlowObject.nodes.filter((node: any) => node.type !== 'input' && node.type !== 'output');
  const e = vueFlowObject.edges.filter((edge: any) => edge.source !== 'input' && edge.target !== 'output');

  const programs = new Map<string, { inputs: IInput[], outputs: IOutput[] }>();

  // format the data
  for (const node of n) {
    if (node.type === 'program') continue;

    const source = e.find((edge: any) => edge.source === node.id);
    const target = e.find((edge: any) => edge.target === node.id);
    console.log(`${node.id} -> ${source?.target} | ${node.id} <- ${target?.source}`)

    if (!source?.target && !target.source) {
      continue;
    }

    // utils methods
    const isProgram = (nodeId: string) => n?.find((node: any) => node.id === nodeId)?.type === 'program';

    if (isProgram(target?.source)) {
      const output = {
        id: node.id,
        filetype: node.data.filetype,
        filename: node?.data?.filename,
        url: null
      };
      if (!programs.has(target.source)) {
        programs.set(target.source, {inputs: [], outputs: [output]});
      } else {
        const program = programs.get(target.source)!;
        program.outputs.push(output);
      }
    }

    // source
    if (source?.target && isProgram(source.target)) {
      const input = {
        id: node.id,
        filetype: node?.data?.filetype,
        filename: node?.data?.filename,
        relatedTo: null,
        file: null
      };
      if (!programs.has(source.target)) {
        programs.set(source.target, {inputs: [input], outputs: []});
      } else {
        const program = programs.get(source.target)!;
        program.inputs.push(input);
      }
    }

    // target
    if (target?.source && isProgram(source?.target)) {
      const input = {
        id: node.id,
        filetype: node?.data?.filetype,
        filename: node?.data?.filename,
        relatedTo: target.source,
        file: null
      };
      if (!programs.has(source.target)) {
        programs.set(source.target, {inputs: [input], outputs: []});
      } else {
        const program = programs.get(source.target)!;
        const index = program.inputs.findIndex(i => i.id === node.id);
        if (index === -1) {
          program.inputs.push(input);
        } else {
          program.inputs[index] = input;
        }
      }
    }
  }

  if (programs.size === 0) {
    toastNotifications.showError('No program found in the graph');
    throw new Error("No program found in the graph");
  }

  const inputWithProgramWhoDontHaveRelatedTo = Array
      .from(programs.values())
      .find(program => program.inputs.every(input => input.relatedTo === null));

  if (!inputWithProgramWhoDontHaveRelatedTo) {
    toastNotifications.showError('No input found without a related output');
    throw new Error("The graph is not a DAG - it has at least one cycle!");
  }

  const input1 = getNodes.value.find(node => node.id === inputWithProgramWhoDontHaveRelatedTo.inputs[0].id)!;
  addNodes([{
    id: 'input',
    type: 'input',
    position: {x: input1.position.x, y: input1.position.y - 100},
    deletable: false,
    data: {
      label: 'Début'
    },
    style: {
      backgroundColor: '#14c82f',
    }
  }]);
  // relié ce noeud à chaque input de inputWithProgramWhoDontHaveRelatedTo
  inputWithProgramWhoDontHaveRelatedTo.inputs.forEach(input => {
    addEdges({
      source: 'input',
      target: input.id,
      markerEnd: MarkerType.ArrowClosed,
    });
  });

  // define order
  const orders = determineExecutionOrder(programs);

  const instructions = orders.map(order => {
    const program = programs.get(order)!;
    return {id: order, inputs: program.inputs, outputs: program.outputs};
  });

  const output1 = getNodes.value.find(node => node.id === instructions[orders.length - 1].outputs[0].id)!;
  addNodes([{
    id: 'output',
    type: 'output',
    position: {x: output1.position.x, y: output1.position.y + 100},
    deletable: false,
    data: {
      label: 'Fin'
    },
    style: {
      backgroundColor: 'rgb(223,60,35)',
    }
  }]);
  // relié ce noeud à chaque output de instructions[orders.length - 1]
  instructions[orders.length - 1].outputs.forEach(output => {
    addEdges({
      source: output.id,
      target: 'output',
      markerEnd: MarkerType.ArrowClosed,
    });
  });

  // every edges set to animate
  setEdges(getEdges.value.map(edge => {
    return {
      ...edge,
      animated: true
    }
  }));

  return instructions;
}


function determineExecutionOrder(programs: Map<string, { inputs: IInput[], outputs: IOutput[] }>): string[] {
  const buildGraph = (programs: Map<string, {
    inputs: IInput[],
    outputs: IOutput[]
  }>): [Map<string, Set<string>>, Set<string>] => {
    const graph = new Map<string, Set<string>>();
    const allOutputs = new Set<string>();

    programs.forEach((program: any, name) => {
      if (!graph.has(name)) {
        graph.set(name, new Set<string>());
      }

      program.outputs.forEach(output => {
        allOutputs.add(output.id);
      });
    });

    programs.forEach((program: any, name: string) => {
      program.inputs.forEach(input => {
        if (input.relatedTo && allOutputs.has(input.relatedTo)) {
          programs.forEach((otherProgram, otherName) => {
            if (otherProgram.outputs.some(output => output.id === input.relatedTo)) {
              let dependencies = graph.get(otherName);
              dependencies?.add(name);
              graph.set(otherName, dependencies!);
            }
          });
        }
      });
    });

    return [graph, allOutputs];
  };

  // Helper function to perform topological sorting
  const topologicalSort = (graph: Map<string, Set<string>>): string[] => {
    const sorted = [];
    const visited = new Set<string>();
    const tempMarked = new Set<string>();

    const visit = (node: string) => {
      if (tempMarked.has(node)) {
        throw new Error("The graph is not a DAG - it has at least one cycle!");
      }
      if (!visited.has(node)) {
        tempMarked.add(node);
        graph.get(node)?.forEach(visit);
        tempMarked.delete(node);
        visited.add(node);
        sorted.push(node);
      }
    };

    graph.forEach((_, node) => {
      if (!visited.has(node)) {
        visit(node);
      }
    });

    return sorted.reverse(); // reverse to get the correct order
  };

  const [graph, _] = buildGraph(programs);
  return topologicalSort(graph);
}

</script>

<template>
  <VueFlow
      :connection-radius="50"
      :default-viewport="{ zoom: 0.75, x: 300, y: 200 }"
      :edges="edges"
      :max-zoom="4"
      :min-zoom="0.2"
      :nodes="nodes"
      class="basic-flow"
  >
    <Background :gap="16" pattern-color="#aaa"/>

    <Controls position="top-left"/>

    <Panel v-if="!readonly" position="top-right">
      <Button class="z-5" icon="pi pi-save" @click="logToObject"/>
    </Panel>
  </VueFlow>
</template>

<style scoped>

</style>