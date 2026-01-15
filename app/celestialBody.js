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
    const segments = 2048; // Plus le chiffre est haut, plus le cercle est lisse

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

    // Conversion des données orbitales
    const semiMajorAxis = orbitData.semimajorAxis; 
    const eccentricity = orbitData.eccentricity;
    const inclination = orbitData.inclination * (Math.PI / 180);
    const argumentOfPeriapsis = orbitData.argumentOfPeriapsis * (Math.PI / 180); 
    const longitudeOfAscendingNode = orbitData.longitudeOfAscendingNode * (Math.PI / 180);

    // Création Mesh + Tag
    const planetMesh = generatePlanet(data.visual.radius, data.texture);
    
    const nameTagDiv = document.createElement('div');
    nameTagDiv.className = 'name-tag';
    nameTagDiv.textContent = data.name;
    nameTagDiv.style.cursor = 'pointer';
    const nameTag = new CSS2DObject(nameTagDiv);
    nameTag.position.set(0, data.visual.radius * 1.5, 0); 
    planetMesh.add(nameTag);
    
    // Stockage des données utilisateur
    planetMesh.userData.name = data.name;
    planetMesh.userData.planetData = data;
    
    // Groupe A: Plan Orbital (orientation dans l'espace)
    const orbitalPlaneGroup = new THREE.Group();
    orbitalPlaneGroup.rotation.y = longitudeOfAscendingNode; 
    orbitalPlaneGroup.rotation.z = inclination;     

    // Groupe B: Forme de l'orbite (ellipse)
    const orbitShapeGroup = new THREE.Group();
    orbitShapeGroup.rotation.y = argumentOfPeriapsis; 

    // Groupe C: Le Système Mobile (Planète + Lunes)
    const systemGroup = new THREE.Group();
    systemGroup.add(planetMesh); 

    // Ajout de la ligne de trajectoire (fixe dans le groupe B)
    const trajectoryLine = generateOrbit(semiMajorAxis, eccentricity);
    orbitShapeGroup.add(trajectoryLine);
    
    // Assemblage final
    orbitShapeGroup.add(systemGroup);
    orbitalPlaneGroup.add(orbitShapeGroup);
    parent.add(orbitalPlaneGroup);

    // Stockage des références pour l'animation
    nameTagDiv.userData = { mesh: planetMesh, planetData: data, systemGroup: systemGroup };

    // Enregistrement dans la liste d'animation
    const bodyEntry = { 
        mesh: planetMesh,
        system: systemGroup, 
        data: data,
        nameTagDiv: nameTagDiv,
        nameTag: nameTag // CSS2DObject pour contrôler la visibilité
    };

    if (allBodiesList) {
        allBodiesList.push(bodyEntry);
    }

    // Récursivité pour les lunes (s'il y en a)
    if (data.moons) {
        data.moons.forEach(luneData => {
            addPlanetWithOrbit(systemGroup, luneData, allBodiesList); 
        });
    }

    return bodyEntry;
}