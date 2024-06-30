import {shapes} from "@joint/core";


interface IPosition {
    x: number;
    y: number;
}

interface IShape {
    position: IPosition;

    toJointJsElement(): shapes.standard.Rectangle;
}

abstract class Shape implements IShape {
    abstract readonly width: number;
    abstract readonly height: number;
    abstract readonly color: string;
    abstract readonly fontSize: number;
    text: string;
    position: IPosition;
    metadata: { name: string, type: string };
    id: string | undefined;

    protected constructor(id: string | undefined, position: IPosition, text: string, metadata = {name: "", type: ""}) {
        this.id = id;
        this.position = position;
        this.text = text;
        this.metadata = metadata;
    }

    toJointJsElement(): shapes.standard.Rectangle {
        const text = this.text.length > 20 ? this.text.slice(0, 20) + "..." : this.text;
        const rectangle = new shapes.standard.Rectangle({
            id: this.id,
            type: `standard.${this.constructor.name}`,
            position: {x: this.position.x, y: this.position.y},
            size: {width: this.width, height: this.height},
            attrs: {
                body: {
                    fill: this.color,
                    stroke: '#3c3c3c',
                    strokeWidth: 2,
                    rx: 3,
                    ry: 3,
                },
                label: {
                    text: text,
                    fill: '#000000',
                    fontSize: this.fontSize,
                    fontWeight: 'bold',
                },
                metadata: this.metadata,
            },
        });

        if (this.text === "Image") {
            rectangle.prop('metadata', {name: this.text, type: 'image'});
        }

        return this.addPorts(rectangle);
    }

    protected abstract addPorts(rectangle: shapes.standard.Rectangle): shapes.standard.Rectangle;
}

class Rectangle extends Shape {
    width = 100;
    readonly height = 40;
    readonly fontSize = 14;
    readonly color: string;
    inputs = 1;
    outputs = 1;

    constructor(id: string | undefined, position: IPosition, text: string, color: string, metadata = {
        name: "",
        type: ""
    }, inputs = 1, outputs = 1) {
        super(id, position, text, metadata);
        this.color = color;
        this.inputs = inputs;
        this.outputs = outputs;
    }

    protected addPorts(rectangle: shapes.standard.Rectangle): shapes.standard.Rectangle {
        const ports = {
            items: [] as { id: string, group: string }[],
            groups: {
                'in': {
                    position: {name: 'top'},
                    attrs: {
                        circle: {
                            magnet: 'passive',
                            r: 6,
                            fill: '#FFFFFF',
                            stroke: '#000000',
                            strokeWidth: 2
                        }
                    }
                },
                'out': {
                    position: {name: 'bottom'},
                    attrs: {
                        circle: {
                            magnet: true,
                            r: 6,
                            fill: '#FFFFFF',
                            stroke: '#000000',
                            strokeWidth: 2
                        }
                    }
                }
            }
        };

        for (let i = 0; i < this.inputs; i++) {
            ports.items.push({id: `in${i}`, group: 'in'});
        }

        for (let i = 0; i < this.outputs; i++) {
            ports.items.push({id: `out${i}`, group: 'out'});
        }

        rectangle.set('ports', ports);

        return rectangle;
    }
}

class ImageRectangle extends Rectangle {
    constructor(id: string, position: IPosition, text: string, metadata: { name: string, type: string }) {
        super(id, position, text, "#2ECC71", metadata);
    }
}

class ProgramRectangle extends Rectangle {
    width = 200;

    constructor(id: string, position: IPosition, text = "Program", input: number, output: number) {
        super(id, position, text, "#3498DB", {name: '', type: ''}, input, output);
    }
}

export {IPosition, IShape, Shape, Rectangle, ImageRectangle, ProgramRectangle};