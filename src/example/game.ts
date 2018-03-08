import { Engine } from '../core/Engine';
import { RenderComponent, RenderEvents, RenderSystem } from '../feature/systems/RenderSystem';
import { Vector, VectorImpl } from '../feature/Vector';
import { Entity } from '../core/Entity';
import { PhysicsComponent, PhysicsSystem } from '../feature/systems/PhysicsSystem';
import { UpdateEvents } from '../feature/systems/UpdateEvents';


interface MyComponents extends RenderComponent, PhysicsComponent {
}

interface MyEvents extends RenderEvents, UpdateEvents {
}

interface MyTypes {
    components: MyComponents;
    events: MyEvents;
}

const engine = new Engine<MyTypes>();
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
    engine.fire('update', void 0);
}, 200);

function render() {
    engine.fire('render', 0);
    requestAnimationFrame(render);
}

render();