import type { TModelSettings } from "../typings/models";
import { BASE_SIZE_SCALE } from "./scene";

export const COLLISION_RANGE = 60;

export const pups: TModelSettings[] = [
    {
        name: "Skye",
        size: BASE_SIZE_SCALE * 10,
        character: "s",
    },
    {
        name: "Chase",
        character: "c",
    },
    {
        name: "Rocky",
        size: BASE_SIZE_SCALE / 2.5,
        character: "r",
    },
    {
        name: "Everest",
        character: "e",
    },
    {
        name: "Marshall",
        character: "m",
    },
    {
        name: "Rubble",
        size: BASE_SIZE_SCALE / 1.5,
        character: "u",
    },
    {
        name: "Tracker",
        size: BASE_SIZE_SCALE / 2,
        character: "t",
    },
    {
        name: "Ryder",
        size: BASE_SIZE_SCALE / 2,
        character: "y",
    },
    {
        name: "Zuma",
        character: "z",
    },
];

export const pupNames = pups.map((p) => p.name);
