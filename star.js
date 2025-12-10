import * as THREE from 'three';

export const genrateStar = (size, starTexture, positionX) => {
  const starGeometry = new THREE.SphereGeometry(size, 50, 50);
  const starMaterial = new THREE.MeshStandardMaterial({map: starTexture});

  const star = new THREE.Mesh(starGeometry, starMaterial);
  const starObj = new THREE.Object3D();
  star.position.set(positionX, 0, 0);

  scene.add(starObj);
  starObj.add(star);
};
