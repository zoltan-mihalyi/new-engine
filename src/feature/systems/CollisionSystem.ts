import { System } from '../../core/System';
import { Types } from '../../core/Types';
import { UpdateEvents } from './UpdateEvents';
import { ListenerMap } from '../../core/ListenerMap';
import { SystemContext } from '../../core/SystemContext';
import { Entity } from '../../core/Entity';
import { Vector } from '../Vector';

const GRID_SIZE = 128;

interface Bounds {
    getLeft(x:number):number;

    getTop(y:number):number;

    getWidth():number;

    getHeight():number;
}

export class SimpleBounds implements Bounds {
    constructor(private width:number, private height:number) {
    }

    getLeft(x:number):number {
        return x;
    }

    getTop(y:number):number {
        return y;
    }

    getWidth():number {
        return this.width;
    }

    getHeight():number {
        return this.height;
    }
}

interface GridItem {
    entity:Entity<CollidableComponent>;
    left:number;
    right:number;
    top:number;
    bottom:number;
}

export interface CollidableComponent {
    position:Vector;
    bounds:Bounds;
    onCollision?:(me:Entity<CollidableComponent>, other:Entity<CollidableComponent>) => void;

    // categoryBits?:number;
    // maskBits?:number;
}

export class CollisionSystem extends System<Types<CollidableComponent, UpdateEvents>> {
    constructor() {
        super('position', 'bounds');
    }

    getListeners():ListenerMap<Types<CollidableComponent, UpdateEvents>> {
        return {
            update: this.update,
        };
    }

    private update(ctx:SystemContext<CollidableComponent>) {
        const grid:{ [key:string]:GridItem[] } = {};
        ctx.forEachEntity(e => {
            const bounds = e.get('bounds');
            const position = e.get('position');
            const left = bounds.getLeft(position.getX());
            const top = bounds.getTop(position.getY());

            const right = left + bounds.getWidth();
            const rightCell = Math.floor(right / GRID_SIZE);
            const bottom = top + bounds.getHeight();
            const bottomCell = Math.floor(bottom / GRID_SIZE);
            const topCell = Math.floor(top / GRID_SIZE);

            const newItem:GridItem = { entity: e, left, top, right, bottom };

            const visited = new Set<Entity<CollidableComponent>>();

            for (let i = Math.floor(left / GRID_SIZE); i <= rightCell; i++) {
                for (let j = topCell; j <= bottomCell; j++) {
                    const key = i + ',' + j;
                    let items;
                    if ((items = grid[key])) {
                        for (const otherItem of items) {
                            const otherEntity = otherItem.entity;
                            if (visited.has(otherEntity)) {
                                continue;
                            }
                            visited.add(otherEntity);

                            if (intersects(newItem, otherItem)) {
                                handleCollision(otherItem, newItem);
                                handleCollision(newItem, otherItem);
                            }
                        }

                        items.push(newItem);
                    } else {
                        grid[key] = [newItem];
                    }
                }
            }
        });
    }
}

function handleCollision(i1:GridItem, i2:GridItem) {
    const e1 = i1.entity;
    const onCollision = e1.get('onCollision');
    if (onCollision) {
        onCollision(e1, i2.entity);
    }
}

function intersects(i1:GridItem, i2:GridItem):boolean {
    return i1.left < i2.right && i2.left < i1.right && i1.top < i2.bottom && i2.top < i1.bottom;
}
