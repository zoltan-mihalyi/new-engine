export interface Entity<T> {
    get<K extends keyof T>(key: K): T[K];

    set<K extends keyof T>(key: K, value: T[K]): this;

    has<K extends keyof T>(key: K): boolean;

    remove<K extends keyof T>(key: K): this;
}
