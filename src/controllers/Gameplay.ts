import type { Object3D, Scene } from "three";
import { loadModel } from "../utils/models";
import type { TActiveModel, TModelName, TModelSettings } from "../typings/models";
import { pups } from "../configs/gameplay";
import { isModelInRange, random } from "../utils/math";
import { keyboard } from "./Keyboard";
import { MoveController } from "./Move";

export class GameplayController {
    scene: Scene = null;

    usedModels: TModelName[] = [];

    activeTarget: TActiveModel = null;

    player: TActiveModel = null;

    score: number = 0;

    moveController: MoveController = null;

    constructor(scene: Scene) {
        this.scene = scene;
        this.setPlayer();
        this.setNewTarget();
        this.moveController = new MoveController(this);
        keyboard.addListener({ event: "keydown", callback: this.checkCollision.bind(this) });
    }

    get allowedModels() {
        return pups.filter((pup) => this.usedModels.every((_pup) => pup.name !== _pup));
    }

    async addRandomModel(): Promise<TActiveModel> {
        const randomModel = random(this.allowedModels) as TModelSettings;
        const model = await loadModel(this.scene, randomModel);
        this.usedModels.push(randomModel.name);
        return { ...randomModel, model };
    }

    async setPlayer() {
        const model = await this.addRandomModel();
        this.player = model;
    }

    async setNewTarget() {
        const model = await this.addRandomModel();
        this.activeTarget = model;
    }

    checkCollision() {
        if (isModelInRange(this.player, this.activeTarget)) {
            this.score += 1;
            this.activeTarget.model.parent.remove(this.activeTarget.model);
            this.setNewTarget();
        }
    }
}
