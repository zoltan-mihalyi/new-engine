import { SystemContext } from './SystemContext';
import { EK, Types } from './Types';

export type ListenerMap<T extends Types> = {
    [K in EK<T>]: (ctx: SystemContext<T['components']>, payload: T['events'][K]) => void;
    };
