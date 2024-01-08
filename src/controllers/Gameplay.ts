import {
    BoxGeometry,
    EdgesGeometry,
    LineBasicMaterial,
    LineSegments,
    Mesh,
    MeshBasicMaterial,
    type Object3D,
    type Scene,
} from "three";
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
import { ObstacleController } from "./Obstacle";
import { BASE_SIZE_SCALE } from "../configs/scene";

export class GameplayController {
    scene: Scene = null;

    usedModels: TModelName[] = [];

    activeTarget: TActiveModel = null;

    player: TActiveModel = null;

    collider: LineSegments = null;

    moveController: MoveController = null;

    activeDirection: TDirection = "down";

    hasCollided: boolean = false;

    characterSelectController: CharacterSelectController = null;

    jumpController: JumpController = null;

    obstacleController: ObstacleController;

    constructor(scene: Scene) {
        this.scene = scene;
        this.setPlayer();
        this.setNewTarget();
        this.moveController = new MoveController(this);
        this.jumpController = new JumpController(this.moveController);
        this.characterSelectController = new CharacterSelectController(this);
        this.obstacleController = new ObstacleController(this);
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
        model.rotation.copy(this.player.model.rotation);
        this.player.model.parent.remove(this.player.model);
        this.player = { ...settings, model };
        this.createCollider();
        this.jumpController.setModel(this.player.model);
    }

    async setPlayer() {
        const model = await this.addRandomModel();
        this.player = model;
        this.createCollider();
        this.jumpController.setModel(this.player.model);
    }

    async setNewTarget() {
        const model = await this.addRandomModel();
        this.activeTarget = model;
        this.hasCollided = false;
    }

    createCollider() {
        const scaleFactor = this.player.model.scale.x / BASE_SIZE_SCALE;
        const boxSize = 5 / scaleFactor;
        const boxGeometry = new BoxGeometry(boxSize, boxSize, boxSize);
        const boxMaterial = new MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0 });
        const box = new Mesh(boxGeometry, boxMaterial);
        this.player.model.add(box);

        const edges = new EdgesGeometry(boxGeometry);
        const line = new LineSegments(edges, new LineBasicMaterial({ color: 0xffff00 }));
        this.player.model.add(line);
        this.collider = line;

        line.position.set(0, boxSize / 2, 0);
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
        if (event.key === " ") {
            this.jumpController.jump(this.activeDirection);
        }
    }
}
