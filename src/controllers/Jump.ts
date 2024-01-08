import { Vector3, type Object3D, MathUtils } from "three";
import type { TDirection } from "../typings/gameplay";
import { JUMP_DISTANCE, JUMP_DURATION, JUMP_HEIGHT } from "../configs/gameplay";
import type { MoveController } from "./Move";

export class JumpController {
    private mesh: Object3D;
    public isJumping: boolean;
    private jumpStartTime: number;
    private startPosition: THREE.Vector3;
    private endPosition: THREE.Vector3;
    public moveController: MoveController;

    constructor(moveController: MoveController) {
        this.moveController = moveController;
        this.isJumping = false;
        this.startPosition = new Vector3();
        this.endPosition = new Vector3();
    }

    setModel(model: Object3D) {
        this.mesh = model;
    }

    update(time: number) {
        if (this.isJumping) {
            const elapsedTime = time - this.jumpStartTime;
            if (elapsedTime < JUMP_DURATION) {
                const progress = elapsedTime / JUMP_DURATION;
                const jumpY = -4 * JUMP_HEIGHT * progress * (progress - 1); // Quadratic easing for jump
                this.mesh.position.y = this.startPosition.y + jumpY;
                this.mesh.position.x = MathUtils.lerp(this.startPosition.x, this.endPosition.x, progress);
                this.mesh.position.z = MathUtils.lerp(this.startPosition.z, this.endPosition.z, progress);
            } else {
                this.mesh.position.set(this.endPosition.x, this.startPosition.y, this.endPosition.z);
                this.isJumping = false;
            }
            this.moveController.gameplay.checkCollision();
            const isHit = this.moveController.gameplay.obstacleController.checkCollision();
            if (isHit) {
                this.endPosition.set(this.startPosition.x, this.startPosition.y, this.startPosition.z);
            }
        }
    }

    jump(direction: TDirection) {
        if (!this.isJumping) {
            this.isJumping = true;
            this.jumpStartTime = performance.now();
            this.startPosition.copy(this.mesh.position);
            this.endPosition.set(
                Math.min(Math.max(this.startPosition.x + this.getXDistance(direction), -420), 420),
                this.startPosition.y,
                Math.min(Math.max(this.startPosition.z + this.getZDistance(direction), -420), 420)
            );
        }
    }

    getXDistance(direction: TDirection) {
        if (direction === "left") {
            return -JUMP_DISTANCE;
        } else if (direction === "right") {
            return JUMP_DISTANCE;
        } else {
            return 0;
        }
    }

    getZDistance(direction: TDirection) {
        if (direction === "up") {
            return -JUMP_DISTANCE;
        } else if (direction === "down") {
            return JUMP_DISTANCE;
        } else {
            return 0;
        }
    }
}
