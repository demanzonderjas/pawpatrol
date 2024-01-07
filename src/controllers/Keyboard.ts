import type { TListener } from "../typings/controllers";

class KeyboardController {
    listeners: TListener[] = [];

    constructor() {
        if (typeof window !== "undefined") {
            window.addEventListener("keydown", this.handleKeyDown.bind(this));
            window.addEventListener("keyup", this.handleKeyUp.bind(this));
        }
    }

    addListener(listener: TListener) {
        this.listeners.push(listener);
    }

    handleKeyDown(event: KeyboardEvent) {
        this.listeners.filter((listener) => listener.event === "keydown").forEach(({ callback }) => callback(event));
    }

    handleKeyUp(event: KeyboardEvent) {
        this.listeners.filter((listener) => listener.event === "keyup").forEach(({ callback }) => callback(event));
    }
}

export const keyboard = new KeyboardController();
