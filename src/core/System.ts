import { Entity } from './Entity';
import { ListenerMap } from './ListenerMap';
import { CK, Types } from './Types';

export abstract class System<T extends Types> {
    private keys: CK<T>[];

    constructor(...keys: CK<T>[]) {
        this.keys = keys;
    }

    accepts(e: Entity<Partial<T['components']>>): boolean {
        for (const key of this.keys) {
            if (!e.has(key)) {
                return false;
            }
        }
        return true;
    }

    abstract getListeners(): ListenerMap<T>;
}
