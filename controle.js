// controls

controls = new THREE.OrbitControls( camera, renderer.domElement );

//controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
controls.dampingFactor = 0.05;

//zoom molette
controls.enableZoom = true;
controls.zoomSpeed = 1.0;

// rotation à 350°
controls.enableRotate = true;
controls.rotateSpeed = 0.5;

//déplacement
controls.enablePan = true;
controls.panSpeed = 0.8;

//limit distance
controls.minDistance = 100;
controls.maxDistance = 5000;


window.addEventListener( 'resize', onWindowResize );



function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {
    requestAnimationFrame(animate);
    controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
    render();

}

function render() {

    renderer.render( scene, camera );

}