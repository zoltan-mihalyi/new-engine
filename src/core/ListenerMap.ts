import { SystemContext } from './SystemContext';

export interface ListenerMap<T> {
    [key: string]: (ctx: SystemContext<T>) => void;
}
