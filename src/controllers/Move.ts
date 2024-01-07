import { MathUtils } from "three";
import { ACC_SPEED, BASE_SPEED } from "../configs/scene";
import type { GameplayController } from "./Gameplay";
import { keyboard } from "./Keyboard";

export class MoveController {
    gameplay: GameplayController = null;

    acc: number = 0;

    constructor(gameplay: GameplayController) {
        this.gameplay = gameplay;
        keyboard.addListener({
            event: "keydown",
            callback: this.handleMove.bind(this),
        });
    }

    get player() {
        return this.gameplay.player;
    }

    handleMove(e: KeyboardEvent) {
        if (!this.player) {
            return;
        }
        if (e.key === "ArrowLeft") {
            if (this.player.model.position.x < -420) {
                return;
            }
            this.acc += this.acc + ACC_SPEED;
            this.player.model.position.x -= BASE_SPEED + Math.min(this.acc, 20);
            this.player.model.rotation.y = MathUtils.degToRad(-90);
        } else if (e.key === "ArrowRight") {
            if (this.player.model.position.x > 420) {
                return;
            }
            this.acc += this.acc + ACC_SPEED;
            this.player.model.position.x += BASE_SPEED + Math.min(this.acc, 20);
            this.player.model.rotation.y = MathUtils.degToRad(90);
        } else if (e.key === "ArrowDown") {
            if (this.player.model.position.z > 420) {
                return;
            }
            this.acc += this.acc + ACC_SPEED;
            this.player.model.position.z += BASE_SPEED + Math.min(this.acc, 20);
            this.player.model.rotation.y = 0;
        } else if (e.key === "ArrowUp") {
            if (this.player.model.position.z < -420) {
                return;
            }
            this.acc += this.acc + ACC_SPEED;
            this.player.model.position.z -= BASE_SPEED + Math.min(this.acc, 20);
            this.player.model.rotation.y = MathUtils.degToRad(180);
        }
    }
}
