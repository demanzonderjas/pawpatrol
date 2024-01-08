import { Box3, BoxGeometry, Mesh, MeshBasicMaterial, Raycaster, SphereGeometry, Vector3 } from "three";
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
        const geometry = new BoxGeometry(125, 50, 30);
        const material = new MeshBasicMaterial({ color: 0x51087e });
        const obstacle = new Mesh(geometry, material);

        obstacle.position.set(getRandomValue(0, 500), 25, getRandomValue(0, 500));
        this.obstacles.push(obstacle);
        obstacle.updateMatrixWorld(true);
        this.gameplay.scene.add(obstacle);
        // this.visualizeVertices(obstacle.geometry, obstacle.matrixWorld);
    }

    // Function to visualize vertices
    visualizeVertices(geometry, meshMatrixWorld) {
        const material = new MeshBasicMaterial({ color: 0x0000ff });
        const vertices = geometry.attributes.position.array;

        for (let i = 0; i < vertices.length; i += 3) {
            const localVertex = new Vector3(vertices[i], vertices[i + 1], vertices[i + 2]);
            const globalVertex = localVertex.clone().applyMatrix4(meshMatrixWorld);
            const vertexGeometry = new SphereGeometry(6, 6, 6);
            const vertexMesh = new Mesh(vertexGeometry, material);
            vertexMesh.position.copy(globalVertex);
            this.gameplay.scene.add(vertexMesh);
        }
    }

    checkCollision() {
        const { player } = this.gameplay;
        for (let obstacle of this.obstacles) {
            if (!obstacle.geometry.boundingBox) {
                obstacle.geometry.computeBoundingBox();
            }
            const worldBoundingBox = new Box3().copy(obstacle.geometry.boundingBox).applyMatrix4(obstacle.matrixWorld);
            const isColliding = worldBoundingBox.containsPoint(player.model.position);
            if (isColliding) {
                return true;
            }
        }

        return false;
    }
}
