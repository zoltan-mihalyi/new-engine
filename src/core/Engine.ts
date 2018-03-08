import { System } from './System';
import { Entity } from './Entity';
import { SystemContext } from './SystemContext';
import { ListenerMap } from './ListenerMap';

class SystemDescriptor<T> {
    readonly entities = new Set<Entity<T>>();
    readonly systemContext: SystemContext<T>;
    readonly listenerMap: ListenerMap<T>;

    constructor(readonly system: System<T>, allEntity: Set<Entity<any>>) {
        allEntity.forEach(e => {
            if (system.accepts(e)) {
                this.entities.add(e);
            }
        });

        this.systemContext = new SystemContext<T>(this.entities);
        this.listenerMap = system.getListeners();
    }
}

export class Engine<T> {
    private entities = new Set<Entity<Partial<T>>>();
    private systems = new Map<System<Partial<T>>, SystemDescriptor<Partial<T>>>();
    private systemsByEvent = new Map<string, Set<SystemDescriptor<Partial<T>>>>();

    addSystem(system: System<Partial<T>>) {
        if (this.systems.has(system)) {
            return;
        }

        const descriptor: SystemDescriptor<Partial<T>> = new SystemDescriptor<Partial<T>>(system, this.entities);

        this.systems.set(system, descriptor);
        for (const event in descriptor.listenerMap) {
            let systems = this.systemsByEvent.get(event);
            if (!systems) {
                systems = new Set<SystemDescriptor<Partial<T>>>();
                this.systemsByEvent.set(event, systems);
            }

            systems.add(descriptor);
        }
    }

    addEntity(entity: Entity<Partial<T>>) {
        this.entities.add(entity);
        this.systems.forEach((descriptor, system) => {
            if (system.accepts(entity)) {
                descriptor.entities.add(entity);
            }
        });
    }

    fire(event: string) {
        const systems = this.systemsByEvent.get(event);
        if (!systems) {
            return;
        }

        systems.forEach((d) => {
            d.listenerMap[event].call(d.system, d.systemContext);
        });
    }
}
