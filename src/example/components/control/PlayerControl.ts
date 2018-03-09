import { Control } from './Control';
import { KeyboardHandler } from '../../../feature/KeyboardHandler';

export interface KeySet {
    up: number;
    down: number;
    left: number;
    right: number;
    fire: number;
}

export class PlayerControl implements Control {
    constructor(private keyboardHandler: KeyboardHandler, private keySet: KeySet) {
    }

    needsTeleport(): boolean {
        return this.keyboardHandler.wasPressed(this.keySet.fire);
    }

    getXDir(): number {
        if (this.keyboardHandler.wasDown(37)) {
            return -1;
        }
        if (this.keyboardHandler.wasDown(39)) {
            return 1;
        }
        return 0;
    }

    getYDir(): number {
        if (this.keyboardHandler.wasDown(38)) {
            return -1;
        }
        if (this.keyboardHandler.wasDown(40)) {
            return 1;
        }
        return 0;
    }
}
