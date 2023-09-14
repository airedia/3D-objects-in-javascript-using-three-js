import "./styles.css";
import * as THREE from "./three.min.js";
//import * as THREE from "three";
import { OrbitControls } from "./OrbitControls.js";
//deprecated
//import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
//import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import GUI from "lil-gui";

// ///////////////////////////////////////////////////////////
// // GUI controls
const gui = new GUI({ width: 350, closed: true });
const params = {
  color: "#99ffff"
};
// ////////////////////////////////////////////////////////////////////////
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};
window.addEventListener("resize", () => {
  
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();


  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Cursor
const cursor = {
  x: 0,
  y: 0
};

window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = -(event.clientY / sizes.height - 0.5);
});

// Scene
const scene = new THREE.Scene();

// Object

// image
const textureLoader = new THREE.TextureLoader();
const hdriTexture = textureLoader.load('src/texture/forest.jpg');

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// cube render target from the HDRI texture
const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(1024);
cubeRenderTarget.fromEquirectangularTexture(renderer, hdriTexture);

scene.background = cubeRenderTarget.texture;

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshPhongMaterial()
);
floor.rotation.x = Math.PI * 1.5;
floor.position.y = -0.5;

const sphereMaterial = new THREE.MeshStandardMaterial({
  color: 0x99ffff,
  side: THREE.DoubleSide,
  metalness: 1,
  roughness: 0.2
});

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), sphereMaterial);
sphere.position.x = -1.5;

const planeMaterial = new THREE.MeshStandardMaterial({
  color: 0x99ffff,
  side: THREE.DoubleSide,
  metalness: 0,
  roughness: 0.8
});

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), planeMaterial);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 16, 32),
  sphereMaterial
);
torus.position.x = 1.5;

// dining table geometry
const tableWidth = 2; 
const tableLength = 4; 
const tableHeight = 0.2; 
const tableGeometry = new THREE.BoxGeometry(tableWidth, tableHeight, tableLength);

// dining table material
const tableMaterial = new THREE.MeshStandardMaterial({
  color: 0x8B4513, 
  metalness: 0.2, 
  roughness: 0.7,
});

//  dining table mesh
const diningTable = new THREE.Mesh(tableGeometry, tableMaterial);

// Position of the table
diningTable.position.set(0, -tableHeight / 2, 0);


scene.add(floor, sphere, plane, torus, diningTable);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(3, 5, 3);

const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  1
);

scene.add(ambientLight, directionalLight, directionalLightHelper);

scene.add(directionalLight);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);

camera.position.z = 3;
camera.aspect = sizes.width / sizes.height;
scene.add(camera);

// TransformControls for the directional light
const transformControls = new TransformControls(camera, canvas);
transformControls.attach(directionalLight);

scene.add(transformControls);

// GUI color
/////////
gui.addColor(params, "color").onChange(() => {
  sphereMaterial.color.set(params.color);
});

gui.add(torus, "visible").name("torus visible");
gui.add(sphere, "visible").name("sphere visible");
gui.add(plane, "visible").name("plane visible");

gui.add(sphereMaterial, "wireframe");
gui.add(planeMaterial, "wireframe");
//////
//////////////////////////////////////////////////////////////

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableZoom = true;
controls.enableDamping = true;
controls.update(true);

// Animate
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  
  plane.rotation.y = 0.1 * elapsedTime;
  plane.rotation.x = 0.15 * elapsedTime;

 
  controls.update();


  renderer.render(scene, camera);


  window.requestAnimationFrame(tick);
};

tick();
