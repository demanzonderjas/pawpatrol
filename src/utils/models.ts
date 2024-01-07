import type { Object3D, Scene } from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import type { TModelSettings } from "../typings/models";
import { getRandomValue } from "./math";
import { BASE_SIZE_SCALE } from "../configs/scene";

export const loader = new GLTFLoader();

export function loadModel(scene: Scene, { name, size = BASE_SIZE_SCALE }: TModelSettings): Promise<Object3D> {
    return new Promise((resolve) => {
        loader.load(
            `models/${name.toLowerCase()}/scene.gltf`,
            function (gltf) {
                gltf.scene.scale.set(size, size, size);
                gltf.scene.position.set(getRandomValue(0, 500), 0, getRandomValue(0, 500));
                scene.add(gltf.scene);
                resolve(gltf.scene);
            },
            undefined,
            function (error) {
                console.error(error);
            }
        );
    });
}
