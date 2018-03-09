export class KeyboardHandler {
    private document: Document;

    private preventKeys = new Set<number>();

    private pressedKeys = new Set<number>(); // keys currently pushed
    private lastDownKeys = new Set<number>(); // keys with pushed state since last reset()
    private lastPressedKeys = new Set<number>(); // keys pressed since last reset()
    private lastReleasedKeys = new Set<number>(); // keys released since last reset()

    isDown(key: number) {
        return this.pressedKeys.has(key);
    }

    wasPressed(key: number) {
        return this.lastPressedKeys.has(key);
    }

    wasReleased(key: number) {
        return this.lastReleasedKeys.has(key);
    }

    wasDown(key: number) {
        return this.lastDownKeys.has(key);
    }

    reset() {
        this.lastDownKeys.clear();
        this.pressedKeys.forEach(key => this.lastDownKeys.add(key));

        this.lastPressedKeys.clear();
        this.lastReleasedKeys.clear();
    }

    bind(document: Document): this {
        if (this.document) {
            throw new Error('Already bound!');
        }
        this.document = document;
        document.addEventListener('keydown', this.keyDown);
        document.addEventListener('keyup', this.keyUp);
        return this;
    }

    unbind(): this {
        if (!this.document) {
            throw new Error('Not bound!');
        }
        document.removeEventListener('keydown', this.keyDown);
        document.removeEventListener('keyup', this.keyUp);
        return this;
    }

    prevent(...keys: number[]): this {
        for (const key of keys) {
            this.preventKeys.add(key);
        }
        return this;
    }

    private keyDown = (e: KeyboardEvent) => {
        const key = e.which;
        if (this.preventKeys.has(key)) {
            e.preventDefault();
        }
        if (this.pressedKeys.has(key)) {
            return;
        }
        this.pressedKeys.add(key);
        this.lastPressedKeys.add(key);
        this.lastDownKeys.add(key);
    };

    private keyUp = (e: KeyboardEvent) => {
        this.pressedKeys.delete(e.which);
        this.lastReleasedKeys.add(e.which);
    };
}
