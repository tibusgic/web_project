import * as THREE from 'three';

export const genratePlanet = (size, planetTexture, positionX, ring) => {
  const planetGeometry = new THREE.SphereGeometry(size, 50, 50);
  const planetMaterial = new THREE.MeshStandardMaterial({map: planetTexture});

  const planet = new THREE.Mesh(planetGeometry, planetMaterial);
  const planetObj = new THREE.Object3D();
  planet.position.set(positionX, 0, 0);

  if (ring) {
    const ringGeo = new THREE.RingGeometry(
      ring.innerRadius,
      ring.outerRadius,
      32
    );
    const ringMat = new THREE.MeshBasicMaterial({
      map: ring.ringmat,
      side: THREE.DoubleSide,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    planetObj.add(ringMesh);
    ringMesh.position.set(positionX, 0, 0);
    ringMesh.rotation.positionX = -0.5 * Math.PI;
  }

  scene.add(planetObj);
  planetObj.add(planet);
};
