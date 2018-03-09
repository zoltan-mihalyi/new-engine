import { System } from '../../core/System';
import { Vector } from '../Vector';
import { SystemContext } from '../../core/SystemContext';
import { ListenerMap } from '../../core/ListenerMap';
import { Types } from '../../core/Types';
import { UpdateEvents } from './UpdateEvents';
import { Entity } from '../../core/Entity';


export interface Renderer {
    render(ctx: CanvasRenderingContext2D, x: number, y: number, entity: Entity<RenderComponent>): void;
}

export interface RenderComponent {
    position: Vector;
    renderer: Renderer;
}

export interface RenderEvents extends UpdateEvents{
    render: number;
}

export class RenderSystem extends System<Types<RenderComponent, RenderEvents>> {
    private ctx: CanvasRenderingContext2D;

    constructor(private canvas: HTMLCanvasElement) {
        super('renderer', 'position');
        this.ctx = canvas.getContext('2d')!;
    }

    getListeners(): ListenerMap<Types<RenderComponent, RenderEvents>> {
        return {
            render: this.render,
            update: this.update
        };
    }

    private render(ctx: SystemContext<RenderComponent>, ratio: number) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.forEachEntity(e => {
            const position = e.get('position');
            e.get('renderer').render(this.ctx, position.getInterpolatedX(ratio), position.getInterpolatedY(ratio), e);
        });
    }

    private update(ctx: SystemContext<RenderComponent>) {
        ctx.forEachEntity(e => e.get('position').swap());
    }
}
