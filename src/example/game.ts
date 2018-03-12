import { Engine } from '../core/Engine';
import { RenderComponent, RenderEvents, RenderSystem } from '../feature/systems/RenderSystem';
import { DoubleBufferedVector, Vector } from '../feature/Vector';
import { PhysicsComponent, PhysicsSystem } from '../feature/systems/PhysicsSystem';
import { UpdateEvents } from '../feature/systems/UpdateEvents';
import { ControlComponent, ControlSystem } from './ControlSystem';
import { KeyboardHandler } from '../feature/KeyboardHandler';
import { KeySet, PlayerControl } from './components/control/PlayerControl';
import { AIControl } from './components/control/AIControl';
import { CharacterRenderer } from './components/CharacterRenderer';
import { Control } from './components/control/Control';
import { CollidableComponent, CollisionSystem, SimpleBounds } from '../feature/systems/CollisionSystem';
import { Entity } from '../core/Entity';


interface MyComponents extends RenderComponent, PhysicsComponent, ControlComponent, CollidableComponent {
}

interface MyEvents extends RenderEvents, UpdateEvents {
}

interface MyTypes {
    components:MyComponents;
    events:MyEvents;
}

const engine = new Engine<MyTypes>();
const keyboardHandler = new KeyboardHandler().prevent(38, 40).bind(document);
const canvas = document.getElementById('canvas') as HTMLCanvasElement;

engine.addSystem(new RenderSystem(canvas));
engine.addSystem(new PhysicsSystem());
engine.addSystem(new ControlSystem());
engine.addSystem(new CollisionSystem());

function createCharacter(x:number, y:number, vx:number, vy:number, control:Control):Partial<MyComponents & { renderer:CharacterRenderer }> {
    const renderer = new CharacterRenderer();

    return {
        position: new DoubleBufferedVector(x, y),
        velocity: new Vector(vx, vy),
        bounds: new SimpleBounds(10, 10),
        onCollision: (me:Entity<Partial<MyComponents>>, other:Entity<Partial<MyComponents>>) => {
            console.log(other)
        },
        renderer,
        control,
    };
}

const keySet:KeySet = {
    left: 37,
    up: 38,
    right: 39,
    down: 40,
    fire: 17,
};

const ai = engine.addEntity(createCharacter(10, 20, 0, 0, new AIControl()));
const player = engine.addEntity(createCharacter(100, 20, 0, 0, new PlayerControl(keyboardHandler, keySet)));

setInterval(() => {
    const playerControl = player.get('control');
    const aiControl = ai.get('control');

    player.set('control', aiControl);
    ai.set('control', playerControl);
}, 5000);

let lastUpdate = new Date().getTime();
setInterval(() => {
    lastUpdate = new Date().getTime();
    engine.fire('update', void 0);
    keyboardHandler.reset();
}, 200);

function render() {
    const ratio = Math.min((new Date().getTime() - lastUpdate) / 200, 1);
    engine.fire('render', ratio);
    requestAnimationFrame(render);
}

render();