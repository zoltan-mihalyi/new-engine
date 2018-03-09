export interface Control {
    needsTeleport(): boolean;

    getXDir(): number;

    getYDir(): number;
}
