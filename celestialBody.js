import * as THREE from 'three';

export function generatePlanet(size, texture) {
    const geometry = new THREE.SphereGeometry(size, 128, 128);
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