import { System } from './System';
import { Entity } from './Entity';

interface SystemDescriptor<T> {
    system: System<T>;
    entities: Set<Entity<T>>;
}

export class Engine<T> {
    private entities = new Set<Entity<Partial<T>>>();
    private systems = new Map<System<Partial<T>>, SystemDescriptor<Partial<T>>>();

    addSystem(system: System<Partial<T>>) {
        if (this.systems.has(system)) {
            return;
        }

        const entities = new Set<Entity<Partial<T>>>();
        this.entities.forEach(e => {
            if (system.canHandle(e)) {
                entities.add(e);
            }
        });

        const descriptor: SystemDescriptor<Partial<T>> = {
            system,
            entities
        };

        this.systems.set(system, descriptor);
    }

    addEntity(entity: Entity<Partial<T>>) {
        this.entities.add(entity);
        this.systems.forEach((descriptor, system) => {
            if (system.canHandle(entity)) {
                descriptor.entities.add(entity);
            }
        });
    }

    update() {
        this.systems.forEach((descriptor, system) => {
            descriptor.entities.forEach((entity) => {
                system.update(entity);
            });
        });
    }
}
