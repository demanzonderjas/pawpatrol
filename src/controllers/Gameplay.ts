import type { Object3D, Scene } from "three";
import { loadModel } from "../utils/models";
import type { TActiveModel, TModelName, TModelSettings } from "../typings/models";
import { pups } from "../configs/gameplay";
import { isModelInRange, random } from "../utils/math";
import { keyboard } from "./Keyboard";
import { MoveController } from "./Move";
import { score } from "../stores/gameplay";
import { CharacterSelectController } from "./CharacterSelect";
import { JumpController } from "./Jump";
import type { TDirection } from "../typings/gameplay";

export class GameplayController {
    scene: Scene = null;

    usedModels: TModelName[] = [];

    activeTarget: TActiveModel = null;

    player: TActiveModel = null;

    moveController: MoveController = null;

    activeDirection: TDirection = "down";

    hasCollided: boolean = false;

    characterSelectController: CharacterSelectController = null;

    jumpController: JumpController = null;

    constructor(scene: Scene) {
        this.scene = scene;
        this.setPlayer();
        this.setNewTarget();
        this.moveController = new MoveController(this);
        this.jumpController = new JumpController(this.moveController);
        this.characterSelectController = new CharacterSelectController(this);
        keyboard.addListener({ event: "keydown", callback: this.checkCollision.bind(this) });
        keyboard.addListener({ event: "keypress", callback: this.checkJump.bind(this) });
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
        const model = await loadModel(this.scene, settings);
        model.position.copy(this.player.model.position);
        this.player.model.parent.remove(this.player.model);
        this.player = { ...settings, model };
        this.jumpController.setModel(this.player.model);
    }

    async setPlayer() {
        const model = await this.addRandomModel();
        this.player = model;
        this.jumpController.setModel(this.player.model);
    }

    async setNewTarget() {
        const model = await this.addRandomModel();
        this.activeTarget = model;
        this.hasCollided = false;
    }

    checkCollision() {
        if (isModelInRange(this.player, this.activeTarget) && !this.hasCollided) {
            this.hasCollided = true;
            this.activeTarget.model.parent?.remove(this.activeTarget.model);
            score.increment();
            this.setNewTarget();
        }
    }

    setActiveDirection(direction: TDirection) {
        this.activeDirection = direction;
    }

    checkJump(event: KeyboardEvent) {
        console.log("jump!?");
        if (event.key === " ") {
            console.log("go!");
            this.jumpController.jump(this.activeDirection);
        }
    }
}
