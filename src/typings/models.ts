import type { Object3D } from "three";

export type TModelSettings = {
    size?: number;
    name: TModelName;
};

export type TActiveModel = TModelSettings & {
    model: Object3D;
};

export type TModelName = "Skye" | "Chase" | "Marshall" | "Everest" | "Rubble" | "Tracker" | "Ryder" | "Zuma" | "Rocky";
