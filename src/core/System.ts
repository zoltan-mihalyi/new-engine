import { Entity } from './Entity';

export abstract class System<C, K1 extends keyof C = never, K2 extends keyof C = never, K3 extends keyof C=never> {
    private keys: (keyof C)[];

    constructor(k1?: K1, k2?: K2, k3?: K3);
    constructor(...keys: (keyof C)[]) {
        this.keys = keys;
    }

    canHandle(e: Entity<any>):e is Entity<C> {
        for (const key of this.keys) {
            if (!e.has(key)) {
                return false;
            }
        }
        return true;
    }

    update(e: Entity<C>) {
        (this.handle as any)(...this.keys.map(key => e.get(key)));
    }

    abstract handle(t1: C[K1], t2: C[K2], t3: C[K3]);
}
