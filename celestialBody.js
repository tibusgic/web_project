import * as THREE from 'three';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

export function generatePlanet(size, texture) {
    const geometry = new THREE.SphereGeometry(size, 128, 128);
    const planetTextureLoader = new THREE.TextureLoader();
    const planetMaterial = new THREE.MeshStandardMaterial({
        map: planetTextureLoader.load(texture)
    });

    const planetMesh = new THREE.Mesh(geometry, planetMaterial);

    planetMesh.userData.celestialBody = true;
    planetMesh.userData.originalScale = 1;

    return planetMesh;
}

function generateOrbit(a, e) {
    // a = demi-grand axe (semimajorAxis)
    // e = excentricité (eccentricity)
    const points = [];
    const segments = 256; // Plus le chiffre est haut, plus le cercle est lisse

    for (let i = 0; i <= segments; i++) {
        // Angle de 0 à 360 degrés (en radians)
        const theta = (i / segments) * Math.PI * 2;

        // Formule mathématique de l'ellipse (Kepler)
        // r = distance du soleil
        const r = (a * (1 - e * e)) / (1 + e * Math.cos(theta));

        // Conversion polaire -> cartésien (X, Z) - plan horizontal
        const x = r * Math.cos(theta);
        const z = r * Math.sin(theta);

        points.push(new THREE.Vector3(x, 0, z));
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5, linewidth: 5 });
    return new THREE.Line(geometry, material);
}

export function addPlanetWithOrbit(parent, data, allBodiesList) {
    const orbitData = data.orbit;

    // Extraction et conversion des angles en radians
    const semiMajorAxis = orbitData.semimajorAxis; 
    const eccentricity = orbitData.eccentricity;
    const inclination = orbitData.inclination * (Math.PI / 180);
    const argumentOfPeriapsis = orbitData.argumentOfPeriapsis * (Math.PI / 180); 
    const longitudeOfAscendingNode = orbitData.longitudeOfAscendingNode * (Math.PI / 180);

    // Création des objets visuels (Mesh et Line)
    const planetMesh = generatePlanet(data.visual.radius, data.texture);
    planetMesh.position.set(0, 0, 0);

    //contenu tag HTML
    const nameTagDiv = document.createElement('div');
    nameTagDiv.className = 'name-tag';
    nameTagDiv.textContent = data.name;
    nameTagDiv.style.cursor = 'pointer';

    // Création name-tag pour la planète CSS2
    const nameTag = new CSS2DObject(nameTagDiv);
    nameTag.position.set(0, data.visual.radius, 0); 
    planetMesh.add(nameTag);
    
    // Stocker les données de la planète dans userData
    planetMesh.userData.name = data.name;
    planetMesh.userData.planetData = data;
    
    const trajectoryLine = generateOrbit(semiMajorAxis, eccentricity);

    // GROUPE 1 : Orientation du plan orbital (Inclinaison i et Noeud Omega)
    const orbitalPlaneGroup = new THREE.Group();
    orbitalPlaneGroup.rotation.y = longitudeOfAscendingNode; 
    orbitalPlaneGroup.rotation.z = inclination;     

    // GROUPE 2 : Orientation de la forme de l'ellipse (Argument de Périapse omega)
    const orbitShapeGroup = new THREE.Group();
    orbitShapeGroup.rotation.y = argumentOfPeriapsis; 

    // GROUPE 3 : Contient la planète (et autres éléments liés)
    const systemGroup = new THREE.Group();
    systemGroup.add(planetMesh); // Le Mesh est dans le wagon

    // On met à jour le userData du tag pour que la caméra suive le BON objet (le système, pas juste le mesh)
    nameTagDiv.userData = { mesh: planetMesh, planetData: data, systemGroup: systemGroup };

    // Si dans le JSON, il y a une liste "moons"
    if (data.moons) {
        data.moons.forEach(luneData => {
            addPlanetWithOrbit(systemGroup, luneData, allBodiesList);  // récursivité pour les lunes
        });
    }
    
    // Assemblage de la hiérarchie : ShapeGroup -> PlaneGroup -> Scene
    orbitShapeGroup.add(trajectoryLine);
    orbitShapeGroup.add(systemGroup); // Le wagon est sur le rail
    orbitalPlaneGroup.add(orbitShapeGroup);
    
    parent.add(orbitalPlaneGroup);

    const bodyEntry = { 
        mesh: planetMesh,
        system: systemGroup, // On ajoute le system pour que render() puisse le bouger
        data: data,
        nameTagDiv: nameTagDiv
    };

    // On ajoute cet objet (Planète OU Lune) à la liste globale pour l'animation
    if (allBodiesList) {
        allBodiesList.push(bodyEntry);
    }

    return bodyEntry;
}