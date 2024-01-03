<script>
    import { onMount } from "svelte";
    import * as THREE from "three";
    let camera, scene, renderer;
    let clock, mesh;

    onMount(() => {
        init();
        animate();
    });

    function init() {
        camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);
        camera.position.set(0, 4, 4);

        scene = new THREE.Scene();

        clock = new THREE.Clock();

        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshNormalMaterial();

        mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        scene.add(new THREE.GridHelper());

        mesh.add(camera);

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
    }

    function animate() {
        requestAnimationFrame(animate);

        const time = clock.getElapsedTime();

        mesh.position.x = Math.sin(time) * 2;
        mesh.position.z = Math.cos(time) * 2;

        // camera.position.x = Math.sin(time) * 2;
        // camera.position.z = Math.cos(time) * 2;

        camera.lookAt(mesh.position);

        renderer.render(scene, camera);
    }
</script>
