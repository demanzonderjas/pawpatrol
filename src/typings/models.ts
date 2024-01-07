import type { Object3D } from "three";

export type TModelSettings = {
    size?: number;
    name: TModelName;
    character: TModelCharacter;
};

export type TActiveModel = TModelSettings & {
    model: Object3D;
};

export type TModelCharacter = "s" | "c" | "m" | "e" | "u" | "t" | "y" | "z" | "r";

export type TModelName = "Skye" | "Chase" | "Marshall" | "Everest" | "Rubble" | "Tracker" | "Ryder" | "Zuma" | "Rocky";
