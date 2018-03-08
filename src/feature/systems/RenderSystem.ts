import { System } from '../../core/System';
import { Vector } from '../Vector';


export interface Render {
    (ctx: CanvasRenderingContext2D, position: Vector): void;
}

export interface RenderComponent {
    position: Vector;
    render: Render;
}

export class RenderSystem extends System<RenderComponent, 'render', 'position'> {
    private ctx:CanvasRenderingContext2D;

    constructor(private canvas: HTMLCanvasElement) {
        super('render', 'position');
        this.ctx = canvas.getContext('2d');
    }

    handle(render: Render, position: Vector) {
        render(this.ctx, position);
    }
}