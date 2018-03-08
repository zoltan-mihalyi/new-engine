import { Entity } from './Entity';

export class SystemContext<T> {
    constructor(private entities: Set<Entity<T>>) {
    }

    forEachEntity(callback: (e: Entity<T>) => void) {
        this.entities.forEach(callback);
    }
}
