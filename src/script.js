import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// THREE.ColorManagement.enabled = false;

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

const manager = new THREE.LoadingManager();

manager.onLoad = () => initScene();
const texLoader = new THREE.TextureLoader(manager);

const matcap = texLoader.load("/tex/matcap.jpg");
const normals = texLoader.load("/tex/normals.jpg");
const bumpMap = texLoader.load("/tex/bump.jpg");
const earthTex = new THREE.TextureLoader().load("/tex/globe-tex.jpg");

let sphere;

function initScene() {
  const sphereGeo = new THREE.SphereGeometry(2);
  /*   
  // alt material
  const sphereMat = new THREE.MeshStandardMaterial({
    map: earthTex,
  }); */
  const matCapMaterial = new THREE.MeshMatcapMaterial({
    matcap,
    map: earthTex,
    normalMap: normals,
    displacementMap: bumpMap,
    displacementScale: 0.1,
  });
  sphere = new THREE.Mesh(sphereGeo, matCapMaterial);
  scene.add(sphere);
  tick();
}

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(40, sizes.width / sizes.height, 0.1, 100);
camera.position.set(9, 5, -5);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0, 0);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.outputColorSpace = THREE.NoToneMapping;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;
  sphere.rotation.y += 0.1 * deltaTime;
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};
