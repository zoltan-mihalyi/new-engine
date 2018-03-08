import { Engine } from '../core/Engine';
import { Render, RenderComponent, RenderSystem } from '../feature/systems/RenderSystem';
import { Vector, VectorImpl } from '../feature/Vector';
import { Entity } from '../core/Entity';
import { PhysicsSystem } from '../feature/systems/PhysicsSystem';


interface MyComponents {
    position: Vector;
    velocity: Vector;
    render: Render;
}

const engine = new Engine<MyComponents>();
const canvas = document.getElementById('canvas') as HTMLCanvasElement;


engine.addSystem(new RenderSystem(canvas));
engine.addSystem(new PhysicsSystem());

engine.addEntity(new Entity<Partial<MyComponents>>({
    position: new VectorImpl(10, 20),
    velocity: new VectorImpl(0, 3),
    render: (ctx: CanvasRenderingContext2D, position: Vector) => {
        ctx.fillStyle = 'red';
        ctx.fillRect(position.getX(), position.getY(), 20, 20)
    }
}));

setInterval(() => {
    engine.update();
}, 200);