import { Vector } from '../Vector';
import { System } from '../../core/System';

interface PhysicsComponent {
    position: Vector;
    velocity: Vector;
}

export class PhysicsSystem extends System<PhysicsComponent, 'position', 'velocity'> {
    constructor() {
        super('position', 'velocity');
    }

    handle(position: Vector, velocity: Vector) {
        position.setX(position.getX() + velocity.getX());
        position.setY(position.getY() + velocity.getY());
    }
}
