import { BoxGeometry, Mesh, MeshBasicMaterial } from "three";
import type { GameplayController } from "./Gameplay";
import { NUMBER_OF_OBSTACLES } from "../configs/gameplay";
import { getRandomValue, isModelInRange } from "../utils/math";

export class ObstacleController {
    gameplay: GameplayController = null;

    obstacles: Mesh[] = [];

    constructor(gameplay: GameplayController) {
        this.gameplay = gameplay;

        for (let i = 0; i < NUMBER_OF_OBSTACLES; i++) {
            this.createObstacle();
        }
    }

    createObstacle() {
        const geometry = new BoxGeometry(125, 50, 10);
        const material = new MeshBasicMaterial({ color: 0xff0000 });
        const obstacle = new Mesh(geometry, material);
        obstacle.position.set(getRandomValue(0, 500), 25, getRandomValue(0, 500));
        this.obstacles.push(obstacle);

        this.gameplay.scene.add(obstacle);
    }

    checkCollision() {
        // for(let obstacle of this.obstacles) {
        // 	if (isModelInRange(this.gameplay.player, obstacle) && !this.hasCollided) {
        // 		console.log("boom!")
        // 	}
        // }
    }
}
