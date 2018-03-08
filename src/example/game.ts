import { Engine } from '../core/Engine';
import { RenderComponent, RenderEvents, RenderSystem } from '../feature/systems/RenderSystem';
import { DoubleBufferedVector, Vector } from '../feature/Vector';
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

function createBox(x, y, vx, vy): Entity<Partial<MyComponents>> {
    return new Entity<Partial<MyComponents>>({
        position: new DoubleBufferedVector(x, y),
        velocity: new Vector(vx, vy),
        render: (ctx: CanvasRenderingContext2D, x, y) => {
            ctx.fillStyle = 'red';
            ctx.fillRect(x, y, 20, 20)
        }
    });
}

engine.addEntity(createBox(10, 20, 0, 8));

let lastUpdate = new Date().getTime();
setInterval(() => {
    lastUpdate = new Date().getTime();
    engine.fire('swap', void 0);
    engine.fire('update', void 0);
}, 200);

function render() {
    const ratio = Math.min((new Date().getTime() - lastUpdate) / 200, 1);
    engine.fire('render', ratio);
    requestAnimationFrame(render);
}

render();