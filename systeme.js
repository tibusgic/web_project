import * as STAR from './star.js';
import * as CelestialBody from './celestialBody.js';

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(WIDTH, HEIGHT);
renderer.setClearColor(0xdddddd, 1);
document.body.appendChild(renderer.domElement);

// CCS2D Renderer pour les élements html
const labelRenderer = new THREE.CSS2DRenderer();
labelRenderer.setSize(WIDTH, HEIGHT);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0';
labelRenderer.domElement.style.pointerEvents = 'none';
document.body.appendChild(labelRenderer.domElement);




const scene = new THREE.Scene();

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT);
camera.position.z = 50;
scene.add(camera);


const sun = STAR.genrateStar(0.696_340, "./textures/2k_sun.jpg");
scene.add(sun);

// Créer le curseur fixe à l'écran
const sliderDiv = document.createElement('div');
sliderDiv.className = 'range';
sliderDiv.innerHTML = `
  <div class="SliderValue">
    <span>1</span>
  </div>
  <div class="field">
    <div class="value left">1</div>
    <input type="range" min="1" max="20" step="0.1" value="1" class="slider" id="myRange" />
    <div class="value right">20</div>
  </div>
`;
sliderDiv.style.position = 'absolute';
sliderDiv.style.bottom = '20px';
sliderDiv.style.left = '50%';
sliderDiv.style.transform = 'translateX(-50%)';
sliderDiv.style.zIndex = '1000';
document.body.appendChild(sliderDiv);
const slideValue = sliderDiv.querySelector('.SliderValue span');
const inputSlider = sliderDiv.querySelector('#myRange');
inputSlider.oninput = (()=>{
  let value = parseFloat(inputSlider.value);
  slideValue.textContent = value.toFixed(1);
  let percentage = ((value - 1) / 19) * 100;
  slideValue.style.left = `calc(${percentage}% + (${8 - percentage * 0.16}px))`;
  //update sun size on slider change
  sun.scale.setScalar(value); // Ajuste l'échelle du soleil
  //update celestial body size on slider change
  scene.traverse((object) => {
    if (object.userData.celestialBody) {
      // Utiliser la taille originale stockée
      const originalScale = object.userData.originalScale || 1;
      object.scale.setScalar(originalScale * value * 30);
    }
  });
})



fetch('./celestialBody.json')
    .then(response => response.json())
    .then(data => {
        data.forEach(planetData => {
            CelestialBody.addPlanetWithOrbit(scene, planetData);
        });
    })
    .catch(error => console.error("Erreur chargement JSON:", error));

// Contrôles de la caméra
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 20;
controls.maxDistance = 200;

// Redimensionnement
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
});


function render() {
  requestAnimationFrame(render);
  controls.update();
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
}
render();
