export class Vector {
    constructor(protected x: number, protected y: number) {
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

    increaseX(dx: number) {
        this.x += dx;
    }

    increaseY(dy: number) {
        this.y += dy;
    }

    noInterpolate() {
    }

    getInterpolatedX(ratio: number): number {
        return this.x;
    }

    getInterpolatedY(ratio: number): number {
        return this.y;
    }

    swap() {
    }
}

export class DoubleBufferedVector extends Vector {
    private interpolate = true;

    constructor(private nextX: number, private nextY: number) {
        super(nextX, nextY);
    }

    increaseX(dx: number) {
        this.nextX += dx;
    }

    increaseY(dy: number) {
        this.nextY += dy;
    }

    setX(x: number) {
        this.nextX = x;
    }

    setY(y: number) {
        this.nextY = y;
    }

    noInterpolate() {
        this.interpolate = false;
    }

    swap() {
        this.x = this.nextX;
        this.y = this.nextY;
        this.interpolate = true;
    }

    getInterpolatedX(ratio: number): number {
        if (this.interpolate) {
            return this.x + (this.nextX - this.x) * ratio;
        }
        return this.x;
    }

    getInterpolatedY(ratio: number): number {
        if (this.interpolate) {
            return this.y + (this.nextY - this.y) * ratio;
        }
        return this.y;
    }
}
