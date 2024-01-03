<script lang="ts">
    import { onMount } from "svelte";
    import * as THREE from "three";
    import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
    import { OrbitControls } from "three/addons/controls/OrbitControls.js";

    let score: number = 0;

    onMount(() => {
        const scene = new THREE.Scene();
        const { innerWidth: width, innerHeight: height } = window;
        const camera = new THREE.PerspectiveCamera(45, width / height, 1, 2000);
        scene.add(camera);
        const loader = new GLTFLoader();
        let model: any;
        let chaseModel: any;
        let mesh;

        const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 2);
        hemiLight.color.setHSL(0.6, 1, 0.6);
        hemiLight.groundColor.setHSL(0.095, 1, 0.75);
        hemiLight.position.set(0, 50, 0);
        scene.add(hemiLight);
        const size = 20;
        const cubeSize = size * 3;
        const gridSize = size * 5;
        let speed = 100;
        let acc = 0;
        camera.position.z = 1000;
        camera.position.y = 1000;

        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshNormalMaterial();

        mesh = new THREE.Mesh(geometry, material);
        mesh.scale.set(cubeSize, cubeSize, cubeSize);
        mesh.position.set(300, cubeSize / 2, 300);
        // scene.add(mesh);

        const grid = new THREE.GridHelper();
        grid.scale.set(gridSize, gridSize, gridSize);
        scene.add(grid);

        loader.load(
            "models/skye/scene.gltf",
            function (gltf) {
                model = gltf.scene;
                gltf.scene.scale.set(size, size, size);

                scene.add(gltf.scene);
            },
            undefined,
            function (error) {
                console.error(error);
            }
        );

        loader.load(
            "models/ryder/scene.gltf",
            function (gltf) {
                chaseModel = gltf.scene;
                gltf.scene.scale.set(size, size, size);
                chaseModel.position.set(getRandomValue(0, 500), 0, getRandomValue(0, 500));

                scene.add(gltf.scene);
            },
            undefined,
            function (error) {
                console.error(error);
            }
        );

        // loader.load(
        //     "models/chase/scene.gltf",
        //     function (gltf) {
        //         chaseModel = gltf.scene;
        //         gltf.scene.scale.set(size, size, size);
        //         chaseModel.position.set(getRandomValue(0, 500), 0, getRandomValue(0, 500));

        //         scene.add(gltf.scene);
        //     },
        //     undefined,
        //     function (error) {
        //         console.error(error);
        //     }
        // );

        const renderer = new THREE.WebGLRenderer({ antialias: true });

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.screenSpacePanning = true;

        //controls.update() must be called after any manual changes to the camera's transform
        // camera.position.set(0, 20, 1000);
        // controls.update();

        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
        window.addEventListener("keydown", handleKeydown);
        window.addEventListener("keyup", handleKeyup);

        function animate() {
            requestAnimationFrame(animate);
            if (model) {
                camera.lookAt(model.position);
            }
            if (chaseModel) {
                chaseModel.rotation.y += 0.01;
            }

            controls.update();
            renderer.render(scene, camera);
        }
        animate();

        function handleKeydown(e: any) {
            if (e.key === "ArrowLeft") {
                if (model.position.x < -500) {
                    return;
                }
                acc += acc + 0.1;
                model.position.x -= speed + Math.min(acc, 20);
                model.rotation.y = THREE.MathUtils.degToRad(-90);
            } else if (e.key === "ArrowRight") {
                if (model.position.x > 500) {
                    return;
                }
                acc += acc + 0.1;
                model.position.x += speed + Math.min(acc, 20);
                model.rotation.y = THREE.MathUtils.degToRad(90);
            } else if (e.key === "ArrowDown") {
                if (model.position.z > 500) {
                    return;
                }
                acc += acc + 0.1;
                model.position.z += speed + Math.min(acc, 20);
                model.rotation.y = 0;
            } else if (e.key === "ArrowUp") {
                if (model.position.z < -500) {
                    return;
                }
                acc += acc + 0.1;
                model.position.z -= speed + Math.min(acc, 20);
                model.rotation.y = THREE.MathUtils.degToRad(180);
            }
            isInRange();
        }

        function handleKeyup(e: any) {
            console.log(model.position.x);
            console.log(mesh.position.x);
            acc = 0;
        }

        function isInRange() {
            const range = 60;
            const xIsInRange = isValueInRange(model.position.x, chaseModel.position.x, range);
            const zIsInRange = isValueInRange(model.position.z, chaseModel.position.z, range);
            if (xIsInRange && zIsInRange) {
                console.log("passed it!");
                score += 1;
                chaseModel.position.set(getRandomValue(0, 500), 0, getRandomValue(0, 500));
            }
        }

        function isValueInRange(modelValue, objectValue, offset) {
            return modelValue + offset > objectValue - offset / 2 && modelValue - offset < objectValue + offset;
        }
        function getRandomValue(min, max) {
            const outcome = Math.min(max * Math.random() + min, max);
            const multiplier = Math.random() > 0.5 ? 1 : -1;
            return outcome * multiplier;
        }

        return () => document.body.removeChild(renderer.domElement);
    });
</script>

<p>Score: {score}</p>

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
</style>
