import * as THREE from 'three';

export const genrateStar = (size, starTexture) => {
  const starGeometry = new THREE.SphereGeometry(size, 50, 50);
  const starMaterial = new THREE.MeshStandardMaterial({map: starTexture});

  const star = new THREE.Mesh(starGeometry, starMaterial);
  const starObj = new THREE.Object3D();
  star.position.set(0, 0, 0);

  const sunLight = new THREE.PointLight(0xFFFFFF, 2, 3000); //Ajuster au besoin
  sunLight.castShadow = true;

  starObj.add(star);
  starObj.add(sunLight);
  scene.add(starObj);

  return starObj;
};
