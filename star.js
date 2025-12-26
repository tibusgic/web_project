//import * as THREE from 'three';

export const genrateStar = (size, starTexturePath) => {
  const starGeometry = new THREE.SphereGeometry(size, 50, 50);
  const starTextureLoader = new THREE.TextureLoader();
  const starTexture = starTextureLoader.load(starTexturePath);
  const starMaterial = new THREE.MeshStandardMaterial({
    map: starTexture,
    emissive: 0xff0000,  // Fait briller l'étoile
    emissiveIntensity: 0.5
  });

  const star = new THREE.Mesh(starGeometry, starMaterial);
  const starObj = new THREE.Object3D();
  star.position.set(0, 0, 0);

  const sunLight = new THREE.PointLight(0xFFFFFF, 2, 300); //Ajuster au besoin
  sunLight.castShadow = true;

  starObj.add(star);
  starObj.add(sunLight);
  

  return starObj;
};
