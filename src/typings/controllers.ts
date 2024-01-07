export type TListener = {
    event: TActiveEventName;
    callback: Function;
};

export type TActiveEventName = "keydown" | "keyup";
