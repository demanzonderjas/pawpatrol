import { MathUtils, Vector3 } from "three";
import { ACC_SPEED, BASE_SPEED } from "../configs/scene";
import type { GameplayController } from "./Gameplay";
import { keyboard } from "./Keyboard";
import { MOVE_DISTANCE, MOVE_DURATION } from "../configs/gameplay";
import type { TDirection } from "../typings/gameplay";

export class MoveController {
    gameplay: GameplayController = null;

    acc: number = 0;

    isMoving: boolean;

    moveStartTime: number;

    private startPosition: THREE.Vector3;
    private endPosition: THREE.Vector3;

    constructor(gameplay: GameplayController) {
        this.gameplay = gameplay;
        this.isMoving = false;
        this.moveStartTime = 0;
        this.startPosition = new Vector3();
        this.endPosition = new Vector3();

        keyboard.addListener({
            event: "keydown",
            callback: this.handleMove.bind(this),
        });
    }

    get player() {
        return this.gameplay.player;
    }

    handleMove(e: KeyboardEvent) {
        if (e.key.match("Arrow") && !this.isMoving && this.player) {
            this.isMoving = true;
            this.moveStartTime = performance.now();
            this.startPosition.copy(this.player.model.position);
        } else {
            return;
        }
        if (e.key === "ArrowLeft") {
            if (this.player.model.position.x < -420) {
                return;
            }
            this.player.model.rotation.y = MathUtils.degToRad(-90);
            this.gameplay.setActiveDirection("left");
        } else if (e.key === "ArrowRight") {
            if (this.player.model.position.x > 420) {
                return;
            }
            this.player.model.rotation.y = MathUtils.degToRad(90);
            this.gameplay.setActiveDirection("right");
        } else if (e.key === "ArrowDown") {
            if (this.player.model.position.z > 420) {
                return;
            }
            this.player.model.rotation.y = 0;
            this.gameplay.setActiveDirection("down");
        } else if (e.key === "ArrowUp") {
            if (this.player.model.position.z < -420) {
                return;
            }
            this.player.model.rotation.y = MathUtils.degToRad(180);
            this.gameplay.setActiveDirection("up");
        }
        this.endPosition.set(
            this.startPosition.x + this.getXDistance(this.gameplay.activeDirection),
            this.startPosition.y,
            this.startPosition.z + this.getZDistance(this.gameplay.activeDirection)
        );
    }

    getXDistance(direction: TDirection) {
        if (direction === "left") {
            return -MOVE_DISTANCE;
        } else if (direction === "right") {
            return MOVE_DISTANCE;
        } else {
            return 0;
        }
    }

    getZDistance(direction: TDirection) {
        if (direction === "up") {
            return -MOVE_DISTANCE;
        } else if (direction === "down") {
            return MOVE_DISTANCE;
        } else {
            return 0;
        }
    }

    update(time: number) {
        if (this.isMoving && !this.gameplay.jumpController.isJumping) {
            const elapsedTime = time - this.moveStartTime;
            if (elapsedTime < MOVE_DURATION) {
                const progress = elapsedTime / MOVE_DURATION;
                this.player.model.position.x = MathUtils.lerp(this.startPosition.x, this.endPosition.x, progress);
                this.player.model.position.z = MathUtils.lerp(this.startPosition.z, this.endPosition.z, progress);
            } else {
                this.player.model.position.set(this.endPosition.x, this.startPosition.y, this.endPosition.z);
                this.isMoving = false;
            }
        }
    }
}
