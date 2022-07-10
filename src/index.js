import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "lil-gui";
import vertexShader from "./shaders/vertexShader";
import fragmentShader from "./shaders/fragmentShader";


/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Canvas
const canvas = document.querySelector(".webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

// Geometry
const geometry = new THREE.PlaneGeometry(2, 2, 256, 256);

// Color
const colorObject = {};
colorObject.depthColor = "#2d81ae";
colorObject.surfaceColor = "#66c1f9";

// Material
const material = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  uniforms: {
    uWaveLength: { value: 0.38 },
    uFrequency: { value: new THREE.Vector2(6.6, 3.5) },
    uTime: { value: 0.0 },
    uWaveSpeed: { value: 0.75 },
    uDepthColor: { value: new THREE.Color(colorObject.depthColor) },
    uSurfaceColor: { value: new THREE.Color(colorObject.surfaceColor) },
    uColorOffset: { value: 0.03 },
    uColorMultiplier: { value: 9.0 },
    uSmallWaveElevation: { value: 0.15 },
    uSmallWaveFrequency: { value: 3.0 },
    uSmallWaveSpeed: { value: 0.2 },
  },
});

// デバック
const gui = new dat.GUI({ width: 300 });
gui.add(material.uniforms.uWaveLength, "value").min(0).max(1).step(0.001).name("波の高さ");
gui.add(material.uniforms.uFrequency.value, "x").min(1).max(10).step(0.001).name("周波数x");
gui.add(material.uniforms.uFrequency.value, "y").min(1).max(10).step(0.01).name("周波数y");
gui.add(material.uniforms.uWaveSpeed, "value").min(0).max(4).step(0.01).name("波の速さ");
gui.addColor(colorObject, "depthColor").onChange(() => {
  material.uniforms.uDepthColor.value.set(colorObject.depthColor);
});
gui.addColor(colorObject, "surfaceColor").onChange(() => {
  material.uniforms.uSurfaceColor.value.set(colorObject.surfaceColor);
});
gui.add(material.uniforms.uColorOffset, "value").min(0).max(1).step(0.001).name("uColorOffset");
gui.add(material.uniforms.uColorMultiplier, "value").min(0).max(10).step(0.001).name("uColorMultiplier");
gui.add(material.uniforms.uSmallWaveElevation, "value").min(0).max(1).step(0.001).name("uSmallWaveElevation");
gui.add(material.uniforms.uSmallWaveFrequency, "value").min(0).max(30).step(0.001).name("uSmallWaveFrequency");
gui.add(material.uniforms.uSmallWaveSpeed, "value").min(0).max(4).step(0.001).name("uSmallWaveSpeed");

// Mesh
const mesh = new THREE.Mesh(geometry, material);
mesh.rotation.x = -Math.PI / 2;
scene.add(mesh);



// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(0.25, 0.25, 1);
gui.add(camera.position, "z").min(0).max(10).step(0.01).name("cameraPositionZ");
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Animate
 */
const clock = new THREE.Clock();

const animate = () => {
  //時間取得
  const elapsedTime = clock.getElapsedTime();
  material.uniforms.uTime.value = elapsedTime;

  controls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(animate);
};

animate();