import { Engine } from '../core/Engine';
import { Render, RenderComponent, RenderSystem } from '../feature/systems/RenderSystem';
import { Vector, VectorImpl } from '../feature/Vector';
import { Entity } from '../core/Entity';


interface MyComponents {
    position: Vector;
    velocity: Vector;
    render: Render;
}

const engine = new Engine<MyComponents>();
const canvas = document.getElementById('canvas') as HTMLCanvasElement;


const renderSystem = new RenderSystem(canvas);
engine.addSystem(renderSystem);

engine.addEntity(new Entity<RenderComponent>({
    position: new VectorImpl(10, 20),
    render: (ctx: CanvasRenderingContext2D, position: Vector) => {
        ctx.fillStyle = 'red';
        ctx.fillRect(position.getX(), position.getY(), 20, 20)
    }
}));

setInterval(() => {
    engine.update();
}, 200);