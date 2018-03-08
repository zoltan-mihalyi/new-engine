import { System } from '../../core/System';
import { Vector } from '../Vector';
import { SystemContext } from '../../core/SystemContext';
import { ListenerMap } from '../../core/ListenerMap';


export interface Render {
    (ctx: CanvasRenderingContext2D, position: Vector): void;
}

export interface RenderComponent {
    position: Vector;
    render: Render;
}

export class RenderSystem extends System<RenderComponent, 'render', 'position'> {
    private ctx: CanvasRenderingContext2D;

    constructor(private canvas: HTMLCanvasElement) {
        super('render', 'position');
        this.ctx = canvas.getContext('2d');
    }

    getListeners(): ListenerMap<RenderComponent> {
        return {
            render: this.render
        };
    }

    private render(ctx: SystemContext<RenderComponent>) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.forEachEntity(e => {
            e.get('render')(this.ctx, e.get('position'));
        });
    }
}
