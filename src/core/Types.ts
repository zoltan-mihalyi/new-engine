export interface Types<C=any, E=any> {
    components: C;
    events: E;
}

export type CK<T extends Types> = keyof T['components'];

export type EK<T extends Types> = keyof T['events'];
