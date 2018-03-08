import { Entity } from './Entity';
import { SystemContext } from './SystemContext';

export abstract class System<C, K1 extends keyof C = never, K2 extends keyof C = never, K3 extends keyof C=never> {
    private keys: (keyof C)[];

    constructor(k1?: K1, k2?: K2, k3?: K3);
    constructor(...keys: (keyof C)[]) {
        this.keys = keys;
    }

    accepts(e: Entity<any>): e is Entity<C> {
        for (const key of this.keys) {
            if (!e.has(key)) {
                return false;
            }
        }
        return true;
    }

    abstract update(ctx:SystemContext<C>);
}
