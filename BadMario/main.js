import * as THREE from 'https://unpkg.com/three@0.108.0/build/three.module.js';
import {OrbitControls} from 'https://unpkg.com/three@0.108.0/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'https://unpkg.com/three@0.108.0/examples/jsm/loaders/FBXLoader';
import { OBJLoader } from 'https://unpkg.com/three@0.108.0/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'https://unpkg.com/three@0.108.0/examples/jsm/loaders/MTLLoader';
import { GUI } from 'https://unpkg.com/three@0.108.0/examples/jsm/libs/dat.gui.module'

import Stats from 'https://unpkg.com/three@0.108.0/examples/jsm/libs/stats.module'

// import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'

// Models from https://www.models-resource.com/nintendo_64/supermario64/
// Textures from https://www.smwcentral.net/?p=section&s=sm64textures


const fov = 75;
const aspect = 2;  // the canvas default
const near = 0.1;
const far = 250;

let shapes;
let renderer;
let scene;
let camera;
var mapCamera;
var mapWidth = 1;
var mapHeight = 1;

let controls;
let stats;
let keys = {};

let walkVector = new THREE.Vector3();

let star;
let mario;
let boulder
let trees;
let castle;
let toad;

let playerPos = [0, 0, 0];
// let playerPos = [-25, -3, 40]
let StarPos = [-22, -4.5, 43.9];

let grass;
let redBox;
let orangeBox;
let pipeSide;
let pipeTop;
let skyTexture;
let boulderTexture;
function loadTextures(){
    const loader = new THREE.TextureLoader();
    grass = loader.load('./textures/grass.png');
    redBox = loader.load('./textures/RedBox.png');
    orangeBox = loader.load('./textures/orangeBox.png');
    pipeSide = loader.load('./textures/pipeSide.png');
    pipeTop = loader.load('./textures/PipeTop.png');
    skyTexture = loader.load('./textures/sky.png');
    boulderTexture = loader.load('./textures/boulder.png');
}

function loadStar(){
    const mtlloader = new MTLLoader();
    const objLoader = new OBJLoader();

    const shinymaterial = new THREE.MeshPhongMaterial({
        color: 0xffff00,
        shininess: 100,
        specular: 0xffffff,
        emissive: 0x000000,
        emissiveIntensity: 1,
        reflectivity: 1,
        side: THREE.DoubleSide,
        flatShading: true
    });
    mtlloader.load('./objects/Nintendo 64 - Super Mario 64 - Power Star/star.mtl', (materials) => {
        materials.preload();
        for(const material of Object.values(materials.materials)){
            material.side = THREE.DoubleSide;
        }
        objLoader.setMaterials(materials);
        objLoader.load('./objects/Nintendo 64 - Super Mario 64 - Power Star/star.obj', (object) => {
            object.children[0].material = shinymaterial;
            object.position.set(StarPos[0], StarPos[1], StarPos[2]);
            object.scale.set(0.5, 0.5, 0.5);

            star = object;

            scene.add(object);
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        (error) => {
            console.log(error);
        } 
        );
    });
}

function loadMario(){
    const fbxLoader = new FBXLoader();
    fbxLoader.load('./objects/Nintendo 64 - Super Mario 64 - Mario/mario.fbx', (object) => {
        object.remove(...object.children.filter((child) => 
        child.name === 'mario_cap_off'
        || child.name === 'mario_right_hand_peace'
        || child.name === 'mario_cap_wings'
        || child.name === 'mario_right_hand_cap_wings'
        || child.name === 'mario_right_hand_cap'
        || child.name === 'mario_left_hand_open'
        || child.name === 'mario_right_hand_open'
        ));

        mario = object;
        object.scale.set(0.005, 0.005, 0.005);
        object.position.set(playerPos[0], playerPos[1], playerPos[2]);
        object.rotation.set(0, Math.PI, 0);

        object.children.forEach((child) => {
            if(child.isMesh){
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        scene.add(object);
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    (error) => {
        console.log(error);
    } 
    );
}

function loadcastle(){
    const mtlloader = new MTLLoader();
    const objLoader = new OBJLoader();
    mtlloader.load('./objects/Peachs Castle Exterior/Peaches Castle.mtl', (materials) => {
        materials.preload();
        for(const material of Object.values(materials.materials)){
            material.side = THREE.DoubleSide;
        }
        objLoader.setMaterials(materials);
        objLoader.load('./objects/Peachs Castle Exterior/Peaches Castle.obj', (object) => {
            object.scale.set(10, 10, 10);
            object.position.set(0, -4, 0);
            object.rotation.set(0, Math.PI, 0);

            object.children.forEach((child) => {
                if(child.isMesh){
                    // child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            castle = object;
            scene.add(object);
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        (error) => {
            console.log(error);
        } 
        );
    });
}

function loadObj(mtl, obj, scale = [0,0,0], position = [0,0,0], rotation = [0,0,0]){
    const mtlloader = new MTLLoader();
    const objLoader = new OBJLoader();
    mtlloader.load(mtl, (materials) => {
        materials.preload();
        for(const material of Object.values(materials.materials)){
            material.side = THREE.DoubleSide;
        }
        objLoader.setMaterials(materials);
        objLoader.load(obj, (object) => {
            object.position.set(position[0], position[1], position[2]);
            object.scale.set(scale[0], scale[1], scale[2]);
            object.rotation.set(rotation[0], rotation[1], rotation[2]);

            object.children.forEach((child) => {
                if(child.isMesh){
                    child.castShadow = true;
                }
            });
            scene.add(object);
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        (error) => {
            console.log(error);
        }
        );
    });
}

function makeLabelCanvas(size, name) {
    const borderSize = 2;
    const ctx = document.createElement('canvas').getContext('2d');
    const font =  `${size}px bold sans-serif`;
    ctx.font = font;
    // measure how long the name will be
    const doubleBorderSize = borderSize * 2;
    const width = ctx.measureText(name).width + doubleBorderSize;
    const height = size + doubleBorderSize;
    ctx.canvas.width = width;
    ctx.canvas.height = height;
   
    // need to set font again after resizing canvas
    ctx.font = font;
    ctx.textBaseline = 'top';
   
    ctx.fillStyle = 'blue';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = 'white';
    ctx.fillText(name, borderSize, borderSize);
   
    return ctx.canvas;
  }

function loadToad(){
    const mtlloader = new MTLLoader();
    const objLoader = new OBJLoader();
    mtlloader.load('./objects/Toad/Toad.mtl', (materials) => {
        materials.preload();
        for(const material of Object.values(materials.materials)){
            material.side = THREE.DoubleSide;
        }
        objLoader.setMaterials(materials);
        objLoader.load('./objects/Toad/Toad.obj', (object) => {
            object.scale.set(0.005, 0.005, 0.005);
            object.position.set(-4, -0.3, 0);

            const canvas = makeLabelCanvas(10000, 'Toad');
            const texture = new THREE.CanvasTexture(canvas);
            texture.minFilter = THREE.LinearFilter;
            texture.wrapS = THREE.ClampToEdgeWrapping;
            texture.wrapT = THREE.ClampToEdgeWrapping;

            const labelMaterial = new THREE.SpriteMaterial({
                map: texture,
                transparent: true,
            });

            const toadObject = new THREE.Object3D();
            object.children.forEach((child) => {
                if(child.isMesh){
                    child.castShadow = true;
                    // child.receiveShadow = true;
                    toadObject.add(child);
                }
            });
            toadObject.scale.set(0.005, 0.005, 0.005);
            
            const labelBaseScale = 0.01;
            const label = new THREE.Sprite(labelMaterial);
            toadObject.add(label);
            label.position.y = object.position.y + 300;

            label.scale.x = canvas.width  * labelBaseScale;
            label.scale.y = canvas.height * labelBaseScale;

            toadObject.position.set(-4,-0.3,0);

            scene.add(toadObject);

        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        (error) => {
            console.log(error);
        }
        );
    });
}

function loadMIPS(){
    const mtlloader = new MTLLoader();
    const objLoader = new OBJLoader();
    mtlloader.load('./objects/Nintendo 64 - Super Mario 64 - MIPS/MIPS.mtl', (materials) => {
        materials.preload();
        for(const material of Object.values(materials.materials)){
            material.side = THREE.DoubleSide;
        }
        objLoader.setMaterials(materials);
        objLoader.load('./objects/Nintendo 64 - Super Mario 64 - MIPS/MIPS.obj', (object) => {
            object.scale.set(0.05, 0.05, 0.05);
            object.position.set(-25, -3.5, 10.29);
            object.rotation.set(0, Math.PI, 0);

            object.children.forEach((child) => {
                if(child.isMesh){
                    child.castShadow = true;
                }
            });
            scene.add(object);
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        (error) => {
            console.log(error);
        }
        );
    });
}

function loadChainChomp(){
    const mtlloader = new MTLLoader();
    const objLoader = new OBJLoader();
    mtlloader.load('./objects/Nintendo 64 - Super Mario 64 - Chain Chomp/ChainChomp.mtl', (materials) => {
        materials.preload();
        for(const material of Object.values(materials.materials)){
            material.side = THREE.DoubleSide;
        }
        objLoader.setMaterials(materials);
        objLoader.load('./objects/Nintendo 64 - Super Mario 64 - Chain Chomp/ChainChomp.obj', (object) => {
            object.scale.set(0.05, 0.05, 0.05);
            object.position.set(-48.2, -4.3, 10.55);
            // object.rotation.set(0, Math.PI, 0);

            object.children.forEach((child) => {
                if(child.isMesh){
                    child.castShadow = true;
                }
            });
            scene.add(object);
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        (error) => {
            console.log(error);
        }
        );
    });
}


function makeGround(){
    const planeGeometry = new THREE.PlaneGeometry(100,100,2,2);
    // planeGeometry.translate(0, -3, 0);
    grass.wrapS = THREE.RepeatWrapping;
    grass.wrapT = THREE.RepeatWrapping;
    grass.repeat.set(100,100);

    const planeMaterial = new THREE.MeshPhongMaterial({
        color: 0x00ff00,
        map: grass,
        side: THREE.DoubleSide});
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotateX(Math.PI / 2);
    // plane.position.y = -1;
    // plane.translateY(-1);

    // scene.add(plane);
}

function addTree(x, y, z){
    const treeCylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
    const treeCylinderMaterial = new THREE.MeshPhongMaterial({color: 0x8B4513});
    const treeCylinder = new THREE.Mesh(treeCylinderGeometry, treeCylinderMaterial);
    treeCylinder.position.set(0,1,0);
    treeCylinder.scale.set(0.5, 4, 0.5);
    treeCylinder.castShadow = true;
    treeCylinder.receiveShadow = true;

    const treeLeaveGeometry = new THREE.SphereGeometry(.9, 8, 8);
    const treeLeaveMaterial = new THREE.MeshPhongMaterial({color: 0x228B22});
    const treeLeave = new THREE.Mesh(treeLeaveGeometry, treeLeaveMaterial);
    treeLeave.position.set(0,1.7,0);
    treeLeave.castShadow = true;
    treeLeave.receiveShadow = true;

    const treeLeaveGeometry2 = new THREE.SphereGeometry(.7, 8, 8);
    const treeLeave2 = new THREE.Mesh(treeLeaveGeometry2, treeLeaveMaterial);
    treeLeave2.position.set(0,2.3,0);
    treeLeave2.castShadow = true;
    treeLeave2.receiveShadow = true;

    const treeLeaveGeometry3 = new THREE.SphereGeometry(.5, 8, 8);
    const treeLeave3 = new THREE.Mesh(treeLeaveGeometry3, treeLeaveMaterial);
    treeLeave3.position.set(0,2.9,0);
    treeLeave3.castShadow = true;
    treeLeave3.receiveShadow = true;

    const tree = new THREE.Object3D();
    tree.add(treeCylinder);
    tree.add(treeLeave);
    tree.add(treeLeave2);
    tree.add(treeLeave3);

    tree.position.set(x, y, z);

    scene.add(tree);
    return tree;
}

function makeshapes(){
    const BoxGeometry = new THREE.BoxGeometry(1,1,1);

    const redBoxMaterial = new THREE.MeshPhongMaterial({map: redBox});
    const redBoxMesh = new THREE.Mesh(BoxGeometry, redBoxMaterial);
    redBoxMesh.position.set(-25,-4, 55);
    redBoxMesh.castShadow = true;
    redBoxMesh.receiveShadow = true;
    scene.add(redBoxMesh);

    const orangeBoxMaterial = new THREE.MeshPhongMaterial({map: orangeBox});
    const orangeBoxMesh = new THREE.Mesh(BoxGeometry, orangeBoxMaterial);
    orangeBoxMesh.position.set(-20,-4, 55);
    orangeBoxMesh.castShadow = true;
    orangeBoxMesh.receiveShadow = true;
    scene.add(orangeBoxMesh);

    const CylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
    const pipeSideMaterial = new THREE.MeshPhongMaterial({map: pipeSide});
    const pipeTopMaterial = new THREE.MeshPhongMaterial({map: pipeTop});
    const pipe = new THREE.Mesh(CylinderGeometry, [pipeSideMaterial, pipeTopMaterial, pipeTopMaterial]);
    pipe.position.set(-15,-5.5, 55);
    pipe.castShadow = true;
    pipe.receiveShadow = true;
    scene.add(pipe);

    loadStar();

    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    boulderTexture.wrapS = THREE.RepeatWrapping;
    boulderTexture.wrapT = THREE.RepeatWrapping;
    boulderTexture.repeat.set(3,3);
    const sphereMaterial = new THREE.MeshPhongMaterial({map: boulderTexture});
    
    boulder = new THREE.Mesh(sphereGeometry, sphereMaterial);
    boulder.position.set(-10,-5, 45);
    boulder.castShadow = true;
    boulder.receiveShadow = true;
    scene.add(boulder);

    trees = [
        addTree(-2, -6, 50),
        addTree(-6, -0.8, 17),
        addTree(-18, -2, 13),
        addTree(-25, -4, 28),
        addTree(-40.5, -5.3, 44.4),
        addTree(-54, -4.6, 28.128),
        addTree(-62, -5, 11.5),
        addTree(-51, -4.79, -2.48),
        addTree(0.489, -1.5, 31.32),
        addTree(15.27, -3.6, 12.516),
    ]
    
}



function makeInstance(geometry, color, x, y, z) {
    const material = new THREE.MeshPhongMaterial({color});
   
    const shape = new THREE.Mesh(geometry, material);
    scene.add(shape);

    shape.castShadow = true;
    shape.receiveShadow = true;
   
    shape.position.x = x;
    shape.position.y = y;
    shape.position.z = z;
   
    return shape;
}

function addDocumentListeners(){
    document.addEventListener('keydown', ({ keyCode }) => { keys[keyCode] = true });
    document.addEventListener('keyup', ({ keyCode }) => { keys[keyCode] = false });
}

function main(){
    addDocumentListeners();
    const canvas = document.querySelector('#threejs');
    
    renderer = new THREE.WebGLRenderer({canvas, antialias: true});
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize( window.innerWidth, window.innerHeight);

    scene = new THREE.Scene();
    const background = new THREE.TextureLoader().load('./textures/sky.png');
    background.magFilter = THREE.LinearFilter;
    background.minFilter = THREE.LinearFilter;
    scene.background = background;

    camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera.position.set( 1, 2, 1 );

    // mapCamera based on https://www.youtube.com/watch?v=_TtVdWAc9Sc
    mapCamera = new THREE.PerspectiveCamera( 90, aspect, 0.01, 500 );
    mapCamera.position.set( 0, 40, 0 );
    mapCamera.lookAt( 0, 0, 0 );

    scene.add(camera);    

    loadTextures();
    loadcastle();
    loadMario();
    loadToad();
    loadMIPS();
    loadChainChomp();

    // Add Goomba
    loadObj(
        './objects/Nintendo 64 - Super Mario 64 - Goomba/goomba.mtl',
        './objects/Nintendo 64 - Super Mario 64 - Goomba/goomba.obj',
        [0.04, 0.04, 0.04],
        [-44.14, -5.3, 25],
        [0, 0, 0]
    );

    // Add Boo
    loadObj(
        './objects/Nintendo 64 - Super Mario 64 - Boo/boo.mtl',
        './objects/Nintendo 64 - Super Mario 64 - Boo/boo.obj',
        [0.05, 0.05, 0.05],
        [-40, -3.6, 37.76],
        [0, Math.PI / 2, 0]
    )

    makeshapes();

    const color = 0xFFFFFF;
    const intensity = 2;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(50, 30, 50);
    light.target.position.set(0, 0, 0);
    light.shadow.radius = 1;
    light.castShadow = true;
    scene.add(light);

    light.shadow.camera.left = -100;
    light.shadow.camera.right = 100;
    light.shadow.camera.top = 100;
    light.shadow.camera.bottom = -50;
    light.shadow.mapSize.x = 2048;
    light.shadow.mapSize.y = 2048;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 500;

    const ambientLight = new THREE.AmbientLight(0x404040, .85); // soft white light
    scene.add(ambientLight);

    const starLight = new THREE.PointLight(0xffffff, 3, 100, 10);
    starLight.position.set(StarPos[0], StarPos[1], StarPos[2]);
    starLight.castShadow = true;
    scene.add(starLight);

    // Controls
    controls = new OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    controls.minDistance = 3;
    controls.maxDistance = 10;
    controls.enablePan = false;
    controls.maxPolarAngle = Math.PI / 2 - 0.05;
    controls.target.set(playerPos[0], playerPos[1], playerPos[2]);
    controls.update();

    // Stats
    stats = Stats()
    stats.domElement.style.cssText = 'position: absolute; bottom: 0px; left: 0px;'
    document.body.appendChild(stats.dom)

    // DEBUG
    var gridHelper = new THREE.GridHelper( 200, 200 );
    gridHelper.visible = false;
    scene.add( gridHelper );
    
    var axesHelper = new THREE.AxesHelper( 5 );
    axesHelper.visible = false;
    scene.add( axesHelper );

    const helper = new THREE.CameraHelper( light.shadow.camera );
    helper.visible = false;
    scene.add( helper );

    // GUI
    const gui = new GUI();
    gui.domElement.style.cssText = 'position: absolute; top: 0px; left: 0px;'
    const debugFolder = gui.addFolder('Debug');
    debugFolder.add(gridHelper, 'visible').name('Grid');
    debugFolder.add(axesHelper, 'visible').name('Axes');
    debugFolder.add(helper, 'visible').name('Camera Helper');

    // Animation
    renderer.render(scene, camera);
    resizeCameras();
    requestAnimationFrame(render);
}

function resizeCameras(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

    mapHeight = window.innerHeight / 4;
    mapWidth = window.innerWidth / 4;

    mapCamera.aspect = mapWidth / mapHeight;
    mapCamera.updateProjectionMatrix();
}

window.addEventListener('resize', resizeCameras);

function getMovementOffset(){
    var offset = Math.PI;

    if(keys[87]){ // W
        if (keys[65]){ // A
            offset = -Math.PI / 4 - Math.PI / 2;
        } else if (keys[68]){ // D
            offset = Math.PI / 4 + Math.PI / 2;
        }
    } else if(keys[83]){ // S
        if (keys[65]){ // A
            offset = -Math.PI / 4 ;
        } else if (keys[68]){ // D
            offset = Math.PI / 4 ;
        } else {
            offset = 0;
        }
    } else if(keys[65]){ // A
        offset = -Math.PI / 2;
    } else if(keys[68]){ // D
        offset = Math.PI / 2;
    }
    return offset;
}

function checkMovement(time){
    // Modified code from https://www.youtube.com/watch?v=C3s0UHpwlf8
    if(keys[87] || keys[65] || keys[83] || keys[68]){
        
        var CameraDirectionAngle = Math.atan2(
            (camera.position.x - mario.position.x),
            (camera.position.z - mario.position.z))
        
        var offset = getMovementOffset();

        var rotationQuaternion = new THREE.Quaternion();
        var rotateAngle = new THREE.Vector3(0, 1, 0);
        rotationQuaternion.setFromAxisAngle(rotateAngle, CameraDirectionAngle + offset);
        mario.quaternion.rotateTowards(rotationQuaternion, 0.1);

        camera.getWorldDirection(walkVector);
        walkVector.y = 0;
        walkVector.normalize();
        walkVector.applyAxisAngle(rotateAngle, offset);

        const velocity = 0.15

        const moveX = walkVector.x * velocity;
        const moveZ = walkVector.z * velocity;

        mario.position.x -= moveX;
        mario.position.z -= moveZ;

        // if(moveX != 0 || moveZ != 0){
        //     console.log(mario.position);
        // }
        
        camera.position.x -= moveX;
        camera.position.z -= moveZ;

        setCameraTarget();
        
    }
}

function setCameraTarget(){
    const cameraTarget = new THREE.Vector3();
    cameraTarget.x = mario.position.x;
    cameraTarget.y = mario.position.y + 1;
    cameraTarget.z = mario.position.z;
    controls.target = cameraTarget;
}

function render(time) {
    stats.update()
    
    if(mario){
        checkMovement(time / 1000);
        if(keys[32]){ // Space
            mario.position.y += 0.1;
            camera.position.y += 0.1;
            setCameraTarget();
        }
        if(keys[16]){ // Shift
            mario.position.y -= 0.1;
            camera.position.y -= 0.1;
            setCameraTarget();
        }
    }

    if(star){
        star.rotation.y = time / 1000;
        star.position.y = StarPos[1] + Math.sin(time / 1000) * 0.5;
    }

    if(boulder){
        boulder.position.x = -10 + Math.sin(time / 1000) * 5;
        boulder.position.z = 45 + Math.cos(time / 1000) * 5;
        boulder.rotation.z = time / 250;
        boulder.rotation.x = -time / 250;
    }


    controls.update();

    renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);

    renderer.clearDepth();
    renderer.setScissorTest(true);

    const mapX = window.innerWidth - mapWidth - 10;
    const mapY = window.innerHeight - mapHeight - 10;
    renderer.setScissor(
        mapX,
        mapY,
        mapWidth,
        mapHeight
    );
    renderer.setViewport(
        mapX,
        mapY,
        mapWidth,
        mapHeight
    );

    renderer.render(scene, mapCamera);
    renderer.setScissorTest(false);

    requestAnimationFrame(render);
}


main();
