import * as THREE from './three.module.js';

main();

function main() {
    // create the context
    const canvas = document.querySelector("#c");
    const gl = new THREE.WebGLRenderer({ canvas, antialias: true });

    // Set initial size
    gl.setSize(window.innerWidth, window.innerHeight);

    // create and set the camera
    const angleOfView = 55;
    const aspectRatio = canvas.clientWidth / canvas.clientHeight;
    const nearPlane = 0.1;
    const farPlane = 100;
    const camera = new THREE.PerspectiveCamera(angleOfView, aspectRatio, nearPlane, farPlane);
    camera.position.set(0, 8, 30);

    // create the scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0.3, 0.5, 0.8);

    // MATERIALS and TEXTURES
    const textureLoader = new THREE.TextureLoader();
    const planeTextureMap = textureLoader.load('textures/cement.jpg');
    planeTextureMap.wrapS = THREE.RepeatWrapping;
    planeTextureMap.wrapT = THREE.RepeatWrapping;
    planeTextureMap.repeat.set(16, 50);

    // Use renderer capabilities to get max anisotropy
    const maxAnisotropy = gl.capabilities.getMaxAnisotropy();

    const planeMaterial = new THREE.MeshLambertMaterial({ map: planeTextureMap, side: THREE.DoubleSide });
    planeTextureMap.anisotropy = maxAnisotropy;

    const fog = new THREE.Fog("gray", 1, 100);
    scene.fog = fog;

    const sphereNormalMap = textureLoader.load('textures/cement.jpg');
    sphereNormalMap.wrapS = THREE.RepeatWrapping;
    sphereNormalMap.wrapT = THREE.RepeatWrapping;

    const sphereMaterial = new THREE.MeshStandardMaterial({ color: 'tan', normalMap: sphereNormalMap });

    // GEOMETRY
    // Cube
    const cubeSize = 4;
    const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    const cubeMaterial = new THREE.MeshPhongMaterial({ color: 'pink' });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(cubeSize + 1, cubeSize + 1, 0);
    scene.add(cube);

    // Create the Sphere
    const sphereRadius = 3;
    const sphereWidthSegments = 32;
    const sphereHeightSegments = 16;
    const sphereGeometry = new THREE.SphereGeometry(sphereRadius, sphereWidthSegments, sphereHeightSegments);

    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
    scene.add(sphere);

    // Upright Plane
    const planeWidth = 256;
    const planeHeight = 128;
    const planeGeometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2; // Rotasi untuk menjadikannya horizontal
    scene.add(plane);

    // LIGHTS
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(0, 30, 30);
    scene.add(light);

    const ambientColor = 0xffffff;
    const ambientIntensity = 0.2;
    const ambientLight = new THREE.AmbientLight(ambientColor, ambientIntensity);
    scene.add(ambientLight);

    // DRAW
    function draw(time) {
        time *= 0.001;
        if (resizeGLToDisplaySize(gl)) {
            const canvas = gl.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        cube.rotation.z += 0.01;

        sphere.rotation.x += 0.01;
        sphere.rotation.y += 0.01;

        light.position.x = 20 * Math.cos(time);
        light.position.y = 20 * Math.sin(time);

        gl.render(scene, camera);
        requestAnimationFrame(draw);
    }

    // SET ANIMATION LOOP
    requestAnimationFrame(draw);

    // Update on window resize
    window.addEventListener('resize', () => {
        resizeGLToDisplaySize(gl);
    });

    // UPDATE RESIZE
    function resizeGLToDisplaySize(gl) {
        const canvas = gl.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            gl.setSize(width, height, false);
        }
        return needResize;
    }
}
