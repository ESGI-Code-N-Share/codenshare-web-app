export interface IO {
    id: string;
    filename: string;
    filetype: string;
}

export interface IInput extends IO {
    relatedTo: string | null;
    file: File | null;
}

export interface IOutput extends IO {
    url: string | null;
}

export class SimpleNode {
    constructor(public id: string, public inputs: IInput[], public outputs: IOutput[]) {
    }
}

export class DAG {
    private nodes: Map<string, SimpleNode> = new Map();
    private adjList: Map<string, string[]> = new Map();

    addNode(node: SimpleNode): void {
        if (this.nodes.has(node.id)) {
            throw new Error(`Node with id ${node.id} already exists.`);
        }
        this.nodes.set(node.id, node);
        this.adjList.set(node.id, []);
    }

    addEdge(fromId: string, toId: string): void {
        if (!this.nodes.has(fromId) || !this.nodes.has(toId)) {
            throw new Error("Both nodes must exist in the graph.");
        }
        this.adjList.get(fromId)?.push(toId);
    }

    getNode(id: string): SimpleNode | undefined {
        return this.nodes.get(id);
    }

    getAdjList(id: string): string[] | undefined {
        return this.adjList.get(id);
    }

    // Topological sort to ensure the DAG is valid
    topologicalSort(): string[] {
        const visited: Set<string> = new Set();
        const stack: string[] = [];
        const recStack: Set<string> = new Set();

        const dfs = (nodeId: string) => {
            if (recStack.has(nodeId)) {
                throw new Error("Graph contains a cycle.");
            }
            if (!visited.has(nodeId)) {
                visited.add(nodeId);
                recStack.add(nodeId);
                for (const neighbor of this.adjList.get(nodeId) || []) {
                    dfs(neighbor);
                }
                recStack.delete(nodeId);
                stack.push(nodeId);
            }
        };

        this.nodes.forEach((_, id) => {
            if (!visited.has(id)) {
                dfs(id);
            }
        });

        return stack.reverse();
    }

    visualize(): void {
        console.log("Nodes and their connections:");
        this.nodes.forEach((node, id) => {
            console.log(`Node ${id}`);
            console.log(`  Inputs: ${node.inputs.map(input => input.filename).join(", ")}`);
            console.log(`  Outputs: ${node.outputs.map(output => output.filename).join(", ")}`);
            const neighbors = this.adjList.get(id);
            if (neighbors && neighbors.length > 0) {
                console.log(`  Connected to: ${neighbors.join(", ")}`);
            } else {
                console.log(`  Connected to: None`);
            }
            console.log("");
        });
    }

    toJsObject(): { id: string, inputs: IInput[], outputs: IOutput[] }[] {
        this.validateConnections();

        const nodes: { id: string, inputs: IInput[], outputs: IOutput[] }[] = [];

        this.nodes.forEach((node, id) => {
            nodes.push({
                id: id,
                inputs: node.inputs.map(io => ({
                    id: io.id,
                    relatedTo: io.relatedTo,
                    filename: io.filename,
                    filetype: io.filetype,
                    file: null
                })),
                outputs: node.outputs.map(io => ({
                    id: io.id,
                    filename: io.filename,
                    filetype: io.filetype,
                    url: null
                }))
            });
        });

        return nodes;
    }

    private validateConnections(): void {
        let index = 0
        this.nodes.forEach((node, id) => {
            if (index > 0) {
                let connectedToOne = false;
                for (const input of node.inputs) {
                    if (input.relatedTo) {
                        connectedToOne = true;
                        break;
                    }
                }

                if (!connectedToOne) {
                    throw new Error(`Node ${id} is not connected to any other node.`);
                }
            }
            index++;
        });
    }
}