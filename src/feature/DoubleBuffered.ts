export class DoubleBuffered<T> {
    private previous: T;
    private current: T;

    constructor(t: T) {
        this.current = t;
        this.previous = t;
    }

    get(): T {
        return this.previous;
    }

    set(t: T) {
        this.current = t;
    }

    apply() {
        this.previous = this.current;
    }
}