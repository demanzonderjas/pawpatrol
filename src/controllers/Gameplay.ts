import type { Object3D, Scene } from "three";
import { loadModel } from "../utils/models";
import type { TActiveModel, TModelName, TModelSettings } from "../typings/models";
import { pups } from "../configs/gameplay";
import { isModelInRange, random } from "../utils/math";
import { keyboard } from "./Keyboard";
import { MoveController } from "./Move";
import { score } from "../stores/gameplay";
import { CharacterSelectController } from "./CharacterSelect";

export class GameplayController {
    scene: Scene = null;

    usedModels: TModelName[] = [];

    activeTarget: TActiveModel = null;

    player: TActiveModel = null;

    moveController: MoveController = null;

    characterSelectController: CharacterSelectController = null;

    constructor(scene: Scene) {
        this.scene = scene;
        this.setPlayer();
        this.setNewTarget();
        this.moveController = new MoveController(this);
        this.characterSelectController = new CharacterSelectController(this);
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

    async loadCharacter(settings: TModelSettings) {
        console.log("hello!", settings);
        const model = await loadModel(this.scene, settings);
        model.position.copy(this.player.model.position);
        this.player.model.parent.remove(this.player.model);
        this.player = { ...settings, model };
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
            this.activeTarget.model.parent.remove(this.activeTarget.model);
            score.increment();
            this.setNewTarget();
        }
    }
}
