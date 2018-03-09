import { System } from '../core/System';
import { Types } from '../core/Types';
import { Vector } from '../feature/Vector';
import { ListenerMap } from '../core/ListenerMap';
import { SystemContext } from '../core/SystemContext';
import { Control } from './components/control/Control';
import { UpdateEvents } from '../feature/systems/UpdateEvents';

export interface ControlComponent {
    position: Vector;
    control: Control;
}

export class ControlSystem extends System<Types<ControlComponent, UpdateEvents>> {
    constructor() {
        super('position', 'control');
    }

    getListeners(): ListenerMap<Types<ControlComponent, UpdateEvents>> {
        return {
            update: this.update
        };
    }

    private update(ctx: SystemContext<ControlComponent>) {
        ctx.forEachEntity(e => {
            const position = e.get('position');

            const control = e.get('control');
            position.increaseX(control.getXDir() * 10);
            position.increaseY(control.getYDir() * 10);

            if (control.needsTeleport()) {
                position.setX(Math.random() * 200);
                position.setY(0);
                position.noInterpolate();
            }
        });
    }
}