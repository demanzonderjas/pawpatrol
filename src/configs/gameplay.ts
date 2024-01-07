import type { TModelSettings } from "../typings/models";
import { BASE_SIZE_SCALE } from "./scene";

export const COLLISION_RANGE = 60;

export const pups: TModelSettings[] = [
    {
        name: "Skye",
        size: BASE_SIZE_SCALE * 20,
    },
    {
        name: "Chase",
    },
    {
        name: "Rocky",
    },
    {
        name: "Everest",
    },
    {
        name: "Marshall",
    },
    {
        name: "Rubble",
    },
    {
        name: "Tracker",
    },
    {
        name: "Ryder",
    },
    {
        name: "Zuma",
    },
];

export const pupNames = pups.map((p) => p.name);
