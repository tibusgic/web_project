function generatePlanet(size, texture) {
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    
    const planetTextureLoader = new THREE.TextureLoader();
    const planetMaterial = new THREE.MeshStandardMaterial({
        map: planetTextureLoader.load(texture)
    }); 
    
    const planetMesh = new THREE.Mesh(geometry, planetMaterial);
    
    // Marquer comme corps céleste et stocker la taille originale
    planetMesh.userData.celestialBody = true;
    planetMesh.userData.originalScale = 1;
    
    return planetMesh;
}

function generateOrbit(a, e) {
    // a = demi-grand axe (semimajorAxis)
    // e = excentricité (eccentricity)
    const points = [];
    const segments = 128; // Plus le chiffre est haut, plus le cercle est lisse

    for (let i = 0; i <= segments; i++) {
        // Angle de 0 à 360 degrés (en radians)
        const theta = (i / segments) * Math.PI * 2;

        // Formule mathématique de l'ellipse (Kepler)
        // r = distance du soleil
        const r = (a * (1 - e * e)) / (1 + e * Math.cos(theta));

        // Conversion polaire -> cartésien (X, Y)
        const x = r * Math.cos(theta);
        const y = r * Math.sin(theta);

        points.push(new THREE.Vector3(x, y, 0));
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
    
    return new THREE.Line(geometry, material);
}

export function addPlanetWithOrbit(scene, data) {
    const orbitData = data.orbit;
    
    // Extraction et conversion des angles en radians
    const semiMajorAxis = orbitData.semimajorAxis; 
    const eccentricity = orbitData.eccentricity;
    const inclination = orbitData.inclination * (Math.PI / 180);
    const argumentOfPeriapsis = orbitData.argumentOfPeriapsis * (Math.PI / 180); 
    const longitudeOfAscendingNode = orbitData.longitudeOfAscendingNode * (Math.PI / 180);

    // Création des objets visuels (Mesh et Line)
    const planetMesh = generatePlanet(data.visual.radius, data.texture); 
    const trajectoryLine = generateOrbit(semiMajorAxis, eccentricity);

    // GROUPE 1 : Orientation du plan orbital (Inclinaison i et Noeud Omega)
    const orbitalPlaneGroup = new THREE.Group();
    orbitalPlaneGroup.rotation.z = longitudeOfAscendingNode; 
    orbitalPlaneGroup.rotation.x = inclination;     

    // GROUPE 2 : Orientation de la forme de l'ellipse (Argument de Périapse omega)
    const orbitShapeGroup = new THREE.Group();
    orbitShapeGroup.rotation.z = argumentOfPeriapsis; 
    
    // Assemblage de la hiérarchie : ShapeGroup -> PlaneGroup -> Scene
    orbitShapeGroup.add(trajectoryLine);
    orbitShapeGroup.add(planetMesh); 
    orbitalPlaneGroup.add(orbitShapeGroup);
    
    scene.add(orbitalPlaneGroup);

    // Positionnement initial (Périhélie)
    const initialDistance = semiMajorAxis * (1 - eccentricity);
    planetMesh.position.set(initialDistance, 0, 0);

    return { 
        mesh: planetMesh,
        data: data
    };
}