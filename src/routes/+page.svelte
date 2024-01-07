<script lang="ts">
    import { onMount } from "svelte";
    import * as THREE from "three";
    import { addCameraToScene, addGridToScene, addLightToScene, createRenderer } from "../utils/scene";
    import { GameplayController } from "../controllers/Gameplay";
    import { score } from "../stores/gameplay";
    import { pups } from "../configs/gameplay";

    let gameplay: GameplayController;

    onMount(async () => {
        const scene = new THREE.Scene();
        const renderer = createRenderer();
        const camera = addCameraToScene(scene, renderer);
        addGridToScene(scene);
        addLightToScene(scene);
        gameplay = new GameplayController(scene);

        document.body.appendChild(renderer.domElement);

        function animate() {
            requestAnimationFrame(animate);
            // if (gameplay.player?.model) {
            //     camera.lookAt(gameplay.player.model.position);
            // }
            if (gameplay.activeTarget?.model) {
                gameplay.activeTarget.model.rotation.y += 0.01;
            }
            if (gameplay.jumpController) {
                gameplay.jumpController.update(performance.now());
            }
            if (gameplay.moveController) {
                gameplay.moveController.update(performance.now());
            }

            renderer.render(scene, camera);
        }
        animate();
    });
</script>

<p>Score: {$score}</p>
<button on:click={() => location.reload()}>Reset</button>
<div class="image-wrapper">
    <img src="/models/characters.png" />
    <div class="characters">
        {#each pups as { character }}
            <div>
                <span>{character.toUpperCase()}</span>
            </div>
        {/each}
    </div>
</div>

<style lang="scss">
    .image-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        max-width: 400px;

        img {
            max-width: 100%;
        }

        .characters {
            top: 0;
            left: 0;
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: 4;
            display: grid;
            grid-gap: 1px;
            grid-template-columns: auto auto auto;

            > div {
                position: relative;
                &:nth-child(7),
                &:nth-child(8),
                &:nth-child(9) {
                    top: -5px;
                    left: -2px;
                }
                &:nth-child(3),
                &:nth-child(6),
                &:nth-child(9) {
                    left: -3px;
                }
                span {
                    background-color: black;
                    padding: 10px;
                    font-size: 1.5em;
                    color: white;
                    display: inline-flex;
                    align-self: center;
                    font-family: "ArchivoBlack", "Arial Black";
                }
            }
        }
    }
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
