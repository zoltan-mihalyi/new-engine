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

class EntityImpl<T> implements Entity<T> {
    constructor(private entityChanged: (e: Entity<T>) => void, private components: T) {
    }

    get<K extends keyof T>(key: K): T[K] {
        return this.components[key];
    }

    set<K extends keyof T>(key: K, value: T[K]): this {
        this.components[key] = value;
        this.entityChanged(this);
        return this;
    }

    has<K extends keyof T>(key: K): boolean {
        return this.components.hasOwnProperty(key);
    }

    remove<K extends keyof T>(key: K): this {
        delete this.components[key];
        this.entityChanged(this);
        return this;
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

    addEntity<C extends Partial<T['components']>>(components: C): Entity<C> {
        const entity = new EntityImpl(this.entityChanged, components);

        this.entities.add(entity);
        this.systems.forEach((descriptor, system) => {
            if (system.accepts(entity)) {
                descriptor.entities.add(entity);
            }
        });

        return entity;
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

    private entityChanged = <C>(entity: Entity<C>) => {
        this.systems.forEach((descriptor, system) => {
            const hasEntity = descriptor.entities.has(entity);
            const accepts = system.accepts(entity);
            if (hasEntity && !accepts) {
                descriptor.entities.delete(entity);
            } else if (!hasEntity && accepts) {
                descriptor.entities.add(entity);
            }
        });
    };
}
