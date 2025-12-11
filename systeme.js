const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(WIDTH, HEIGHT);
renderer.setClearColor(0xdddddd, 1);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();


const camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT);
camera.position.z = 50;
scene.add(camera);

/*
const boxGeometry = new THREE.BoxGeometry(10, 10, 10);
const basicMaterial = new THREE.MeshBasicMaterial({ color: 0x0095dd });
const cube = new THREE.Mesh(boxGeometry, basicMaterial);
scene.add(cube);



cube.rotation.set(0.4, 0.2, 0);
*/
const sphereGeometry = new THREE.SphereGeometry(5, 32, 32);
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(0, 0, 0);
scene.add(sphere);



filePath = path.join(__dirname, 'earth.json');
let planete = JSON.parse(fs.readFileSync(filePath));

console.log(planete.name);
console.log(planete.gravity);
console.log(planete.masse);
console.log(planete.radius);
console.log(planete.orbit);


function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}
render();
