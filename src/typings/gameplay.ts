export type TListener = {
    event: TActiveEventName;
    callback: Function;
};

export type TActiveEventName = "keydown" | "keyup" | "keypress";

export type TDirection = "up" | "down" | "left" | "right";
