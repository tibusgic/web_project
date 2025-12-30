//import * as THREE from 'three';

export const genrateStar = (size, starTexturePath, name) => {
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
  star.userData.name = name;

  const sunLight = new THREE.PointLight(0xFFFFFF, 2, 300); //Ajuster au besoin
  sunLight.castShadow = true;

  //contenu tag HTML
  const nameTagDiv = document.createElement('div');
  nameTagDiv.className = 'name-tag';
  nameTagDiv.textContent = star.userData.name;
  nameTagDiv.style.cursor = 'pointer';

  // Création name-tag pour la planète CSS2
  const nameTag = new THREE.CSS2DObject(nameTagDiv);
  nameTag.position.set(0, size, 0); 
  star.add(nameTag);

  starObj.add(star);
  starObj.add(sunLight);
  

  return starObj;
};
