import { System } from './System';
import { Entity } from './Entity';
import { SystemContext } from './SystemContext';

class SystemDescriptor<T> {
    readonly entities = new Set<Entity<T>>();
    readonly systemContext: SystemContext<T>;

    constructor(private system: System<T>, allEntity: Set<Entity<any>>) {
        allEntity.forEach(e => {
            if (system.accepts(e)) {
                this.entities.add(e);
            }
        });

        this.systemContext = new SystemContext<T>(this.entities);
    }
}

export class Engine<T> {
    private entities = new Set<Entity<Partial<T>>>();
    private systems = new Map<System<Partial<T>>, SystemDescriptor<Partial<T>>>();

    addSystem(system: System<Partial<T>>) {
        if (this.systems.has(system)) {
            return;
        }

        const descriptor: SystemDescriptor<Partial<T>> = new SystemDescriptor<Partial<T>>(system, this.entities);

        this.systems.set(system, descriptor);
    }

    addEntity(entity: Entity<Partial<T>>) {
        this.entities.add(entity);
        this.systems.forEach((descriptor, system) => {
            if (system.accepts(entity)) {
                descriptor.entities.add(entity);
            }
        });
    }

    update() {
        this.systems.forEach((descriptor, system) => {
            system.update(descriptor.systemContext);
        });
    }
}
