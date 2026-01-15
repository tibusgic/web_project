import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import * as STAR from './star.js';
import { addPlanetWithOrbit } from './celestialBody.js';

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
const camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT, 0.0001, 100000);
camera.position.z = 50;
scene.add(camera);


// Soleil
const sun = STAR.genrateStar(0.696340, "./textures/2k_sun.jpg", "Soleil");
scene.add(sun);



// Créer le curseur fixe à l'écran pour la taille
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
      // Les planètes grossissent 30x plus vite que le soleil, mais à 1x tout est à l'échelle 1
      object.scale.setScalar(originalScale * (1 + (value - 1) * 30));
    }
  });
})

// --- INTERFACE TEMPORELLE (Date + Vitesse + Reset) ---

// Création du conteneur principal (en bas à gauche)
const timeContainer = document.createElement('div');
timeContainer.style.position = 'absolute';
timeContainer.style.bottom = '20px';
timeContainer.style.left = '20px';
timeContainer.style.zIndex = '1000';
timeContainer.style.display = 'flex';
timeContainer.style.flexDirection = 'column'; // Empiler la date et les contrôles
timeContainer.style.gap = '5px';
document.body.appendChild(timeContainer);


// Affichage de la date et de l'heure
const dateText = document.createElement('div');
dateText.style.fontFamily = "'Courier New', monospace";
dateText.style.fontWeight = 'bold';
dateText.style.color = 'var(--primary-color)';
dateText.style.textShadow = '0 0 10px var(--primary-color)';
dateText.style.marginLeft = '10px';
dateText.textContent = "DATE: --/--/----";

// Ajout de l'affichage de la date au conteneur principal
timeContainer.appendChild(dateText);


// Création d'une ligne de contrôle pour aligner le Curseur et le Bouton
const controlsRow = document.createElement('div');
controlsRow.style.display = 'flex';
controlsRow.style.alignItems = 'end'; // Aligner en bas
controlsRow.style.gap = '10px';

// Ajout de la ligne de contrôle au conteneur principal
timeContainer.appendChild(controlsRow);

// Curseur de temps
const sliderBox = document.createElement('div');
sliderBox.className = 'range';
sliderBox.style.transform = 'scale(0.85)';
sliderBox.style.marginBottom = '0';
sliderBox.innerHTML = `
  <div class="SliderValue"><span>1</span></div>
  <div class="field">
    <div class="value left">PASSE</div>
    <input type="range" min="-10" max="10" step="1" value="1" id="timeRange">
    <div class="value right">FUTUR</div>
  </div>
`;

// Ajout du curseur à la ligne de contrôle
controlsRow.appendChild(sliderBox);

// Bouton Reset
const resetBtn = document.createElement('button');
resetBtn.innerHTML = '<i class="bi bi-arrow-counterclockwise"></i> NOW';
resetBtn.style.background = 'var(--bg-transparent)';
resetBtn.style.border = 'var(--border-width) solid var(--primary-color)';
resetBtn.style.color = 'var(--primary-color)';
resetBtn.style.fontFamily = "'Courier New', monospace";
resetBtn.style.fontWeight = 'bold';
resetBtn.style.padding = '8px 12px';
resetBtn.style.marginBottom = '18px'; // Pour s'aligner avec le slider
resetBtn.style.cursor = 'pointer';

// Effet de survol du bouton
resetBtn.onmouseenter = () => { resetBtn.style.background = 'var(--primary-color)'; resetBtn.style.color = 'black'; };
resetBtn.onmouseleave = () => { resetBtn.style.background = 'var(--bg-transparent)'; resetBtn.style.color = 'var(--primary-color)'; };

// Ajout du bouton à la ligne de contrôle
controlsRow.appendChild(resetBtn);

// --- LOGIQUE DU CURSEUR DE TEMPS ET BOUTON RESET ---

const timeInput = sliderBox.querySelector('#timeRange');
const timeBubbleContainer = sliderBox.querySelector('.SliderValue');
const timeBubbleText = sliderBox.querySelector('.SliderValue span');

timeInput.oninput = () => {
  let val = parseFloat(timeInput.value);
  let absVal = Math.abs(val);
  let speed = 0;

  if (val === 0) {
    speed = 0; 
  } else {
    speed = Math.pow(10, absVal - 1);
    if (val < 0) speed = -speed;
  }

  // Mise à jour de la vitesse globale
  timeScale = speed;

  // Calcul du pourcentage (0 à 100%)
  let percent = ((val + 10) / 20) * 100;
  
  // Correction pour le positionnement de la bulle
  let thumbCorrection = 8 - (percent * 0.16);
  timeBubbleContainer.style.left = `calc(${percent}% + ${thumbCorrection}px)`;
  timeBubbleContainer.style.transform = 'translateX(-50%)';
  
  // Mise à jour du texte
  timeBubbleText.textContent = val;
};

// Initialisation de la bulle de temps
setTimeout(() => {
    timeInput.dispatchEvent(new Event('input'));
}, 0);

resetBtn.onclick = () => {
  // Calculer le temps réel actuel par rapport à l'an 2000
  const now = new Date();
  simulatedTime = (now - startJ2000) / 1000;

  // Remettre le curseur à 1 (Temps réel)
  timeInput.value = 1;
  timeInput.dispatchEvent(new Event('input')); // Forcer la mise à jour
};

// Référence globale pour mise à jour dans la boucle de rendu
window.dateDisplayElement = dateText;



//import la fonction des cartes d'information
import { createPlanetCard } from './card.js';



// charger les planètes depuis un fichier JSON
const body = []; //liste des corps célestes
fetch('./celestialBody.json')
  .then(response => response.json())
  .then(data => {
    data.forEach(planetData => {
      //générer la planète et son orbite
      addPlanetWithOrbit(scene, planetData, body); 
    }); 
    //échelle initiale après le chargement
    inputSlider.dispatchEvent(new Event('input'));
  })
  .catch(error => console.error("Erreur chargement JSON:", error));



// background avec des étoiles
scene.background = new THREE.Color(0x000000); // couleur noire



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
controls.minDistance = 0.01;  
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

    console.log(clickedElement.userData);

    // Récupérer les bonnes données selon le type (planète ou étoile)
    if (clickedElement.userData) {
      targetMesh = clickedElement.userData.mesh;
      planetData = clickedElement.userData.planetData || clickedElement.userData.starData;
    }

    if (targetMesh && planetData) {

      // Créer et afficher la carte d'information
      if (planetData.type === 'planet' || planetData.type === 'moon') {
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

// Initialisation de l'horloge
const clock = new THREE.Clock(); // Pour la gestion du temps

// Facteurs de vitesse
let timeScale = 1; // Facteur de vitesse temporelle
let rotationSpeed = 1; // Vitesse de rotation
let revolutionSpeed = 1; // Vitesse de revolution

// Calcul du temps depuis J2000
const now = new Date();
const startJ2000 = new Date('2000-01-01T12:00:00Z'); // Date de référence standard
const realSecondsSinceJ2000 = (now - startJ2000) / 1000; 

// Initialiser le temps simulé sur le temps réel actuel
let simulatedTime = realSecondsSinceJ2000;

// Rendu
function render() {
  requestAnimationFrame(render);

  // Mise à jour de l'affichage de la date
  let currentSimDate = new Date(startJ2000.getTime() + simulatedTime * 1000);
  if (window.dateDisplayElement) {
      window.dateDisplayElement.textContent = "DATE: " + currentSimDate.toLocaleString('fr-FR');
  }
  
  // Gestion du temps
  const delta = clock.getDelta(); // Temps écoulé en secondes depuis la dernière frame
  simulatedTime += delta * timeScale; // Met à jour le temps simulé

  // Mise à jour de la position et rotation des planètes
  // Parcours la liste des planètes
  for (let i = 0; i < body.length; i++) {
    let obj = body[i];

    // Vérifie que la planète a bien ses données et son objet 3D
    if (obj.data && obj.mesh && obj.system) {
      
      let data = obj.data;
      let mesh = obj.mesh;

      // Temps simulé global pour tout le monde
      let t = simulatedTime;

      // --- Partie 1 : Rotation ---
      
      // Période de rotation (en secondes)
      let rotP = data.physical.rotationPeriod;
      
      if (rotP) {
        // Calcul de l'angle de rotation
        let angleRotation = ((t % rotP) / rotP) * (Math.PI * 2);
        
        // Appliquer la rotation autour de l'axe Y
        mesh.rotation.y = angleRotation * rotationSpeed;
      }

      // Inclinaison de l'axe (obliquité)
      if (data.physical.obliquity) {
         mesh.rotation.z = data.physical.obliquity * (Math.PI / 180); 
      }

      // --- Partie 2 : Révolution ---

      let orbit = data.orbit;

      // Variables mathématiques
      let a = orbit.semimajorAxis;    // Demi-grand axe
      let e = orbit.eccentricity;     // Excentricité
      let T = orbit.orbitalPeriod;    // Période orbitale
      
      // Anomalie moyenne initiale (convertie en radians)
      let M0 = orbit.meanAnomaly0 * (Math.PI / 180);

      // Mouvement moyen n (vitesse angulaire moyenne)
      let n = (2 * Math.PI) / T;

      // Calcul de l'Anomalie Moyenne M à l'instant t
      let M = M0 + (n * t * revolutionSpeed);

      // Anomalie Excentrique E (approximation)
      let E = M;
      for (let k = 0; k < 5; k++) {
          E = E - (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
      }

      // Calcul de la coordonnée x
      let x = a * (Math.cos(E) - e);

      // Calcul de la coordonnée z
      let z = a * Math.sqrt(1 - e * e) * Math.sin(E);

      // Nouvelles positions (x, 0, z)
      obj.system.position.set(x, 0, z);
    }
  }

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