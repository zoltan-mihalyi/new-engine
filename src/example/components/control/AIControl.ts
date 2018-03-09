import { Control } from './Control';

export class AIControl implements Control {
    needsTeleport(): boolean {
        return Math.random() < 0.1;
    }

    getXDir() {
        return Math.random() * 2 - 1;
    }

    getYDir() {
        return 0;
    }
}
