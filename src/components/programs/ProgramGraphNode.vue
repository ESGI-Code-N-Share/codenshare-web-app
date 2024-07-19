<script lang="ts" setup>

import {Handle, Position, useHandleConnections, useNodesData} from '@vue-flow/core'

const connections = useHandleConnections({
  type: 'target',
})

const nodesData = useNodesData(() => connections.value[0]?.source)
</script>

<template>
  <div>
    <Handle
        :position="Position.Top"
        type="target"
    />
    <span>{{ 'nodeData.label' }}</span>
  </div>
</template>

<style scoped>
.program-graph-node {
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
  background-color: #f9f9f9;
}

.port {
  margin: 10px 0;
}

.port-title {
  font-weight: bold;
}

.port-name {
  font-size: 0.9em;
  color: #555;
}

.node-body {
  margin: 20px 0;
}

.node-content {
  font-size: 1.2em;
  font-weight: bold;
}
</style>