import type { TListener } from "../typings/gameplay";

class KeyboardController {
    listeners: TListener[] = [];

    constructor() {
        if (typeof window !== "undefined") {
            window.addEventListener("keydown", this.handleKeyDown.bind(this));
            window.addEventListener("keyup", this.handleKeyUp.bind(this));
            window.addEventListener("keypress", this.handleKeyPress.bind(this));
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

    handleKeyPress(event: KeyboardEvent) {
        this.listeners.filter((listener) => listener.event === "keypress").forEach(({ callback }) => callback(event));
    }
}

export const keyboard = new KeyboardController();
