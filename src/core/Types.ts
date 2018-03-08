export interface Types<C=any, E=any> {
    components: C;
    events: E;
}

export interface SubTypes<T extends Types> extends Types<Partial<T['components']>, Partial<T['events']>> {
}

export type CK<T extends Types> = keyof T['components'];

export type EK<T extends Types> = keyof T['events'];
