import { GridHelper, HemisphereLight, PerspectiveCamera, Scene, WebGLRenderer, type Renderer } from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { BASE_GRID_SCALE } from "../configs/scene";

export function addLightToScene(scene: THREE.Scene) {
    const hemiLight = new HemisphereLight(0xffffff, 0xffffff, 2);
    hemiLight.color.setHSL(0.6, 1, 0.6);
    hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    hemiLight.position.set(0, 50, 0);
    scene.add(hemiLight);
}

export function addCameraToScene(scene: Scene, renderer: Renderer): PerspectiveCamera {
    const { innerWidth: width, innerHeight: height } = window;
    const camera = new PerspectiveCamera(45, width / height, 1, 2000);
    camera.position.z = 1000;
    camera.position.y = 1000;
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.screenSpacePanning = true;
    scene.add(camera);
    return camera;
}

export function createRenderer(): WebGLRenderer {
    const renderer = new WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    return renderer;
}

export function addGridToScene(scene: Scene) {
    const grid = new GridHelper();
    grid.scale.set(BASE_GRID_SCALE, BASE_GRID_SCALE, BASE_GRID_SCALE);
    scene.add(grid);
}
