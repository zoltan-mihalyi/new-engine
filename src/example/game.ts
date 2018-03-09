import { Engine } from '../core/Engine';
import { RenderComponent, RenderEvents, RenderSystem } from '../feature/systems/RenderSystem';
import { DoubleBufferedVector, Vector } from '../feature/Vector';
import { Entity } from '../core/Entity';
import { PhysicsComponent, PhysicsSystem } from '../feature/systems/PhysicsSystem';
import { UpdateEvents } from '../feature/systems/UpdateEvents';
import { ControlComponent, ControlSystem } from './ControlSystem';
import { Control } from './components/control/Control';
import { KeyboardHandler } from '../feature/KeyboardHandler';
import { KeySet, PlayerControl } from './components/control/PlayerControl';
import { AIControl } from './components/control/AIControl';


interface MyComponents extends RenderComponent, PhysicsComponent, ControlComponent {
}

interface MyEvents extends RenderEvents, UpdateEvents {
}

interface MyTypes {
    components: MyComponents;
    events: MyEvents;
}

const engine = new Engine<MyTypes>();
const keyboardHandler = new KeyboardHandler().prevent(38, 40).bind(document);
const canvas = document.getElementById('canvas') as HTMLCanvasElement;

engine.addSystem(new RenderSystem(canvas));
engine.addSystem(new PhysicsSystem());
engine.addSystem(new ControlSystem());

function createBox(x, y, vx, vy, control: Control): Partial<MyComponents> {
    return {
        position: new DoubleBufferedVector(x, y),
        velocity: new Vector(vx, vy),
        render: (ctx: CanvasRenderingContext2D, x, y) => {
            ctx.fillStyle = 'red';
            ctx.fillRect(x, y, 20, 20)
        },
        control
    };
}

const keySet: KeySet = {
    left: 37,
    up: 38,
    right: 39,
    down: 40,
    fire: 17
};

engine.addEntity(createBox(10, 20, 0, 8, new AIControl()));
const player = engine.addEntity(createBox(100, 20, 0, 8, new PlayerControl(keyboardHandler, keySet)));

setTimeout(() => player.remove('control'), 2000);

let lastUpdate = new Date().getTime();
setInterval(() => {
    lastUpdate = new Date().getTime();
    engine.fire('swap', void 0);
    engine.fire('update', void 0);
    keyboardHandler.reset();
}, 200);

function render() {
    const ratio = Math.min((new Date().getTime() - lastUpdate) / 200, 1);
    engine.fire('render', ratio);
    requestAnimationFrame(render);
}

render();