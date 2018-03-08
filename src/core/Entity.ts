export class Entity<T> {
    constructor(private components: T) {

    }

    get<K extends keyof T>(key: K): T[K] {
        return this.components[key];
    }

    set<K extends keyof T>(key: K, value: T[K]): this {
        this.components[key] = value;
        return this;
    }

    has<K extends keyof T>(key: K) {
        return this.components.hasOwnProperty(key);
    }

    remove<K extends keyof T>(key: K) {
        delete this.components[key];
    }
}
