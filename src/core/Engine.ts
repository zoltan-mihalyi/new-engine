import { System } from './System';
import { Entity } from './Entity';
import { SystemContext } from './SystemContext';
import { ListenerMap } from './ListenerMap';
import { EK, SubTypes, Types } from './Types';

class SystemDescriptor<T extends Types> {
    readonly entities = new Set<Entity<T['components']>>();
    readonly systemContext: SystemContext<T['components']>;
    readonly listenerMap: ListenerMap<SubTypes<T>>;

    constructor(readonly system: System<SubTypes<T>>, allEntity: Set<Entity<any>>) {
        allEntity.forEach(e => {
            if (system.accepts(e)) {
                this.entities.add(e);
            }
        });

        this.systemContext = new SystemContext<T>(this.entities);
        this.listenerMap = system.getListeners();
    }
}

export class Engine<T extends Types=Types> {
    private entities = new Set<Entity<Partial<T['components']>>>();
    private systems = new Map<System<SubTypes<T>>, SystemDescriptor<T>>();
    private systemsByEvent = new Map<string, Set<SystemDescriptor<T>>>();

    addSystem(system: System<SubTypes<T>>) {
        if (this.systems.has(system)) {
            return;
        }

        const descriptor: SystemDescriptor<T> = new SystemDescriptor<T>(system, this.entities);

        this.systems.set(system, descriptor);
        for (const event in descriptor.listenerMap) {
            if (!descriptor.listenerMap.hasOwnProperty(event)) {
                continue;
            }
            let systems = this.systemsByEvent.get(event);
            if (!systems) {
                systems = new Set<SystemDescriptor<T>>();
                this.systemsByEvent.set(event, systems);
            }

            systems.add(descriptor);
        }
    }

    addEntity(entity: Entity<Partial<T['components']>>) {
        this.entities.add(entity);
        this.systems.forEach((descriptor, system) => {
            if (system.accepts(entity)) {
                descriptor.entities.add(entity);
            }
        });
    }

    fire<K extends EK<T>>(event: K, payload: T['events'][K]) {
        const systems = this.systemsByEvent.get(event);
        if (!systems) {
            return;
        }

        systems.forEach((d) => {
            d.listenerMap[event].call(d.system, d.systemContext, payload);
        });
    }
}
