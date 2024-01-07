<script lang="ts">
    import { onMount } from "svelte";
    import * as THREE from "three";
    import { addCameraToScene, addGridToScene, addLightToScene, createRenderer } from "../utils/scene";
    import { GameplayController } from "../controllers/Gameplay";

    let gameplay: GameplayController;

    onMount(async () => {
        const scene = new THREE.Scene();
        const renderer = createRenderer();
        const camera = addCameraToScene(scene, renderer);
        addGridToScene(scene);
        addLightToScene(scene);
        gameplay = new GameplayController(scene);
        const { activeTarget, player } = gameplay;

        document.body.appendChild(renderer.domElement);

        function animate() {
            requestAnimationFrame(animate);
            if (player) {
                camera.lookAt(player.model.position);
            }
            if (activeTarget) {
                activeTarget.model.rotation.y += 0.01;
            }

            renderer.render(scene, camera);
        }
        animate();
    });
</script>

<p>Score: {gameplay?.score}</p>
<button on:click={() => location.reload()}>Reset</button>

<style>
    p {
        position: absolute;
        top: 0;
        right: 0;
        font-size: 3rem;
        color: white;
        text-transform: uppercase;
        padding: 1em;
        margin: 0;
    }
    button {
        background-color: red;
        color: white;
        padding: 20px;
        font-size: 1.5rem;
        position: absolute;
        top: 1em;
        left: 1em;
    }
</style>
