import type { Object3D } from "three";
import type { TActiveModel } from "../typings/models";
import { COLLISION_RANGE } from "../configs/gameplay";

export function getRandomValue(min, max) {
    const outcome = Math.min(max * Math.random() + min, max);
    const multiplier = Math.random() > 0.5 ? 1 : -1;
    return outcome * multiplier;
}

export function random(array: Array<unknown>): unknown {
    return array[(Math.random() * array.length) | 0];
}

export function isModelInRange(player: TActiveModel, target: TActiveModel) {
    const xIsInRange = isValueInRange(target.model.position.x, player.model.position.x, COLLISION_RANGE);
    const zIsInRange = isValueInRange(target.model.position.z, player.model.position.z, COLLISION_RANGE);
    return xIsInRange && zIsInRange;
}

function isValueInRange(modelValue, objectValue, offset) {
    return modelValue + offset > objectValue - offset / 2 && modelValue - offset < objectValue + offset;
}
