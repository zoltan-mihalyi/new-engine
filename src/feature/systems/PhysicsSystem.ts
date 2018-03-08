import { Vector } from '../Vector';
import { System } from '../../core/System';
import { SystemContext } from '../../core/SystemContext';
import { ListenerMap } from '../../core/ListenerMap';
import { Types } from '../../core/Types';
import { UpdateEvents } from './UpdateEvents';

export interface PhysicsComponent {
    position: Vector;
    velocity: Vector;
}

export class PhysicsSystem extends System<Types<PhysicsComponent, UpdateEvents>> {
    constructor() {
        super('position', 'velocity');
    }

    getListeners(): ListenerMap<Types<PhysicsComponent, UpdateEvents>> {
        return {
            update: this.update
        };
    }

    private update(ctx: SystemContext<PhysicsComponent>) {
        ctx.forEachEntity(entity => {
            const position = entity.get('position');
            const velocity = entity.get('velocity');

            position.setX(position.getX() + velocity.getX());
            position.setY(position.getY() + velocity.getY());
        });
    }
}
