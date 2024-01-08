import { BoxGeometry, Mesh, MeshBasicMaterial, Raycaster, Vector3 } from "three";
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
        const { collider: line } = this.gameplay;
        console.log(this.obstacles.length);
        for (let obstacle of this.obstacles) {
            const vertices = obstacle.geometry.attributes.position.array;
            const directionVector = new Vector3();
            for (let i = 0; i < vertices.length; i += 3) {
                const startPoint = new Vector3(vertices[i], vertices[i + 1], vertices[i + 2]);
                startPoint.applyMatrix4(line.matrixWorld);
                for (let j = i + 3; j < vertices.length; j += 3) {
                    const endPoint = new Vector3(vertices[j], vertices[j + 1], vertices[j + 2]);
                    endPoint.applyMatrix4(line.matrixWorld);
                    directionVector.subVectors(endPoint, startPoint);
                    const ray = new Raycaster(startPoint, directionVector.normalize(), 0, directionVector.length());
                    const intersects = ray.intersectObject(obstacle);
                    if (intersects.length > 0) {
                        console.log("Collision detected");
                        return true;
                    }
                }
            }
        }

        return false;
    }
}
