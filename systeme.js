import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import * as STAR from './star.js';
import * as CelestialBody from './celestialBody.js';

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(WIDTH, HEIGHT);
renderer.setClearColor(0xdddddd, 1);
document.body.appendChild(renderer.domElement);

// CCS2D Renderer pour les élements html
const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(WIDTH, HEIGHT);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0';
labelRenderer.domElement.style.pointerEvents = 'none';
labelRenderer.domElement.querySelectorAll('.name-tag').forEach(tag => {
  tag.style.pointerEvents = 'auto';
});
document.body.appendChild(labelRenderer.domElement);

// Scène principale
const scene = new THREE.Scene();

const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

// Caméra
const camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT, 0.1, 100000);
camera.position.z = 50;
scene.add(camera);

// Soleil
const sun = STAR.genrateStar(0.696340, "./textures/2k_sun.jpg", "Soleil");
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


//import la fonction des cartes d'information
import { createPlanetCard } from './card.js';







// charger les planètes depuis un fichier JSON
const body = []; //liste des corps célestes
fetch('./celestialBody.json')
    .then(response => response.json())
    .then(data => {
        data.forEach(planetData => {
          //générer la planète et son orbite
            const res = CelestialBody.addPlanetWithOrbit(scene, planetData); 
            body.push(res);      
        }); 
        //échelle initiale après le chargement
        inputSlider.dispatchEvent(new Event('input'));
    })
    .catch(error => console.error("Erreur chargement JSON:", error));









// background avec des étoiles
// couleur noire
scene.background = new THREE.Color(0x000000);

// creer star sky avec particules
const starGeometry = new THREE.BufferGeometry();
const starCount = 8000;
const starPositions = [];
const minDistance = 4500;
const maxDistance = 12000;
for (let i = 0; i < starCount; i++) {
  const range = 20000;
  const x = (Math.random() - 0.5) * range;
  const y = (Math.random() - 0.5) * range;
  const z = (Math.random() - 0.5) * range;
  if (Math.sqrt(x*x + y*y + z*z) < minDistance || Math.sqrt(x*x + y*y + z*z) > maxDistance) {
    i--;
  } 
  else {
    starPositions.push(x, y, z);
  }
}
starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff });
const starPoints = new THREE.Points(starGeometry, starMaterial);
scene.add(starPoints);





// Variables pour l'animation de la caméra
let isAnimating = false;
let animationProgress = 0;
let startCameraPosition = new THREE.Vector3();
let startControlsTarget = new THREE.Vector3();
let targetCameraPosition = new THREE.Vector3();
let targetControlsTarget = new THREE.Vector3();






// Contrôles de la caméra
const controls = new OrbitControls(camera, renderer.domElement);

// Rotation fluide et libre à 360°
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.rotateSpeed = 0.5;

// Zoom adapté
controls.enableZoom = true;
controls.zoomSpeed = 1.2;
controls.minDistance = 1;  
controls.maxDistance = 2000;

// Pan libre (déplacement)
controls.enablePan = true;
controls.panSpeed = 1.0;
controls.screenSpacePanning = true;

//controls.minPolarAngle = 0;
//controls.maxPolarAngle = Math.PI;

// Empêcher le blocage : la caméra peut traverser le centre
controls.enableKeys = true;
controls.keys = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  BOTTOM: 40
};

// Le point autour duquel on tourne (le soleil au centre)
controls.target.set(0, 0, 0);
controls.update();



// Redimensionnement
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
});


//Event clique
document.addEventListener('click', (event) => {
  const clickedElement = event.target;

  // on vérifie si c'est un name-tag
  if (clickedElement.classList.contains('name-tag')) {
    // init des variables
    let targetMesh = null;
    let planetData = null;

    // Récupérer les bonnes données selon le type (planète ou étoile)
    if (clickedElement.userData) {
      targetMesh = clickedElement.userData.mesh;
      planetData = clickedElement.userData.planetData || clickedElement.userData.starData;
    }

    if (targetMesh && planetData) {

      // Créer et afficher la carte d'information
      if (planetData.type === 'planet') {
        createPlanetCard(planetData);
      }



      const pose = new THREE.Vector3(); // position cible
      targetMesh.getWorldPosition(pose);

      // Calculer direction depuis l'origine vers le corps céleste
      const direction = pose.clone().normalize();
      if (direction.length() === 0) {
        direction.set(1, 0, 0); // éviter la division par zéro
      }

      // Créer l'offset pour la caméra
      const sliderValue = parseFloat(inputSlider.value);
      const distanceFactor = clickedElement.textContent === "Soleil" ? 5 : 10;
      const scaledRadius = clickedElement.textContent === "Soleil" ? planetData.visual.radius * sliderValue : planetData.visual.radius * sliderValue * 30;
      const offset = direction.multiplyScalar(distanceFactor * scaledRadius);
      offset.y += scaledRadius * 2; // ajustement en Y
      
      const newPose = pose.clone().add(offset);

      //activer l'animation de transfert de la caméra
      startCameraPosition.copy(camera.position);
      startControlsTarget.copy(controls.target);
      targetCameraPosition.copy(newPose);
      targetControlsTarget.copy(pose);

      animationProgress = 0;
      isAnimating = true;
    }
  
  }

});





function render() {
  requestAnimationFrame(render);
  


  // Animation de la caméra /////////////////
  if (isAnimating) {
    animationProgress += 0.02; // Vitesse
    
    // Easing function
    const t = Math.min(animationProgress, 1);
    const easeT = t * (2 - t); // Ease out quad
    
    // Interpolation de la position de la caméra
    camera.position.lerpVectors(startCameraPosition, targetCameraPosition, easeT);
    
    // Interpolation de la cible des contrôles
    controls.target.lerpVectors(startControlsTarget, targetControlsTarget, easeT);
    
    // Arrêter de l'animation
    if (animationProgress >= 1) {
      camera.position.copy(targetCameraPosition);
      controls.target.copy(targetControlsTarget);
      isAnimating = false;
    }
    /////////////////////////////////////////
  }
  
  controls.update();
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
}
render();
