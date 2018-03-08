import { Vector } from '../Vector';
import { System } from '../../core/System';
import { SystemContext } from '../../core/SystemContext';

interface PhysicsComponent {
    position: Vector;
    velocity: Vector;
}

export class PhysicsSystem extends System<PhysicsComponent, 'position', 'velocity'> {
    constructor() {
        super('position', 'velocity');
    }

    update(ctx: SystemContext<PhysicsComponent>) {
        ctx.forEachEntity(entity => {
            const position = entity.get('position');
            const velocity = entity.get('velocity');

            position.setX(position.getX() + velocity.getX());
            position.setY(position.getY() + velocity.getY());
        });
    }
}
