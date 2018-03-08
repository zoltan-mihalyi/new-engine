export interface Vector {
    getX(): number;

    getY(): number;

    setX(x: number);

    setY(y: number);
}

export class VectorImpl implements Vector {
    constructor(private x: number, private y: number) {
    }

    getX(): number {
        return this.x;
    }

    getY(): number {
        return this.y;
    }

    setX(x: number) {
        this.x = x;
    }

    setY(y: number) {
        this.y = y;
    }
}