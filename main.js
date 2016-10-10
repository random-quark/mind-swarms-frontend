var canvasSize = {
    width: 800,
    height: 800
}

var settings = {
    agents: 60000,
    fadeAlpha: 0,
    noiseDet: 4,
    overlayAlpha: 0,
    blendFactor: 0.2,
    paletteScaleFactor: 1,
    customBlend: true,
    imageChoice: 0,
    debug: false
}

var agentDefaults = {
    noiseScale: 150,
    randomSeed: 0,
    agentsAlpha: 20,
    strokeWidth: 2,
    maxAngleSpan: 220,
    speed: 3,
    interAgentNoiseZRange: 0, // FIND CORRECT VALUE
    noiseZStep: 0.001,
    randomInitialDirection: 0 // TODO: should this randomized here?
}

var stats = new Stats();

var agents = []

var data = {
    emotion0: null,
    emotion1: null
}

var colorMixer

//three
var camera, scene, renderer, geometry
geometry = new THREE.Geometry();

function setup() {
    //three
    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, 0, 500);
    scene = new THREE.Scene();
    // var colors = [0xff0080, 0x8000ff, 0xffffff];
    // var material = new THREE.LineBasicMaterial({
    //     color: colors[Math.floor(Math.random() * colors.length)],
    //     opacity: 0.5,
    //         // linewidth: 5,
    //     transparent: true
    // })
    material = new THREE.MeshBasicMaterial({
        vertexColors: THREE.VertexColors,
        opacity: 0.1,
        transparent: true
    })

    colorMixer = new ColorMixer(canvasSize, settings.paletteScaleFactor, settings.customBlend, ["surprise", "anger"], settings.blendFactor)

    for (var i = 0; i < settings.agents; i++) {
        agents.push(new Agent(i, canvasSize, agentDefaults))
    }
    // for (var i = 0; i < settings.agents; i++) {
    //     var randLocX1 = Math.random() * 2000 - 1000;
    //     var randLocY1 = Math.random() * 2000 - 1000;
    //     var randLocX2 = randLocX1 - 5;
    //     var randLocY2 = randLocY1 - 5;
    //     geometry.vertices.push(
    //         new THREE.Vector3(randLocX1, randLocY1, 0),
    //         new THREE.Vector3(randLocX2, randLocY2, 0)
    //     );
    //     var c = Math.random() * 0xffffff
    //     geometry.colors.push(new THREE.Color(c))
    //     geometry.colors.push(new THREE.Color(c))
    // }
    var line = new THREE.LineSegments(geometry, material);
    scene.add(line);

    renderer = new THREE.WebGLRenderer({
        preserveDrawingBuffer: true,
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.sortObjects = false;
    renderer.autoClearColor = false;
    container.appendChild(renderer.domElement);

    camera.position.x = 0; //+= ( mouseX - camera.position.x ) * .05;
    camera.position.y = 0; //+= ( - mouseY - camera.position.y ) * .05;
    camera.lookAt(scene.position);

    // TODO: make ajax call to backend to get emotions and amounts
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom

    // createCanvas(canvasSize.width, canvasSize.height)

    document.body.appendChild(stats.dom);
    // strokeWeight(agentDefaults.strokeWidth)
    myDraw();
}

function myDraw() {
    stats.begin();

    // movePoints()

    for (var i = 0; i < agents.length; i++) {
        agents[i].update()
    }
    geometry.verticesNeedUpdate = true;
    geometry.colorsNeedUpdate = true

    renderer.render(scene, camera)

    if (settings.debug) showVbos()

    stats.end();
    requestAnimationFrame(myDraw) // only use if initiating draw ourselves
}

// function main() {
//     // var canvas = document.getElementById('swarm') // TODO: do we use our canvas or p5's?
//     // var ctx = canvas.getContext('2d')
//     // draw()
// }

function mousePressed() {
    if (mouseButton === LEFT) settings.imageChoice += 1
    if (mouseButton === RIGHT) settings.imageChoice -= 1
    if (settings.imageChoice % 5 === 0) settings.imageChoice = 0
    if (settings.imageChoice < 0) settings.imageChoice = 0
}

function showVbos() {
    switch (settings.imageChoice) {
        case 0:
            image(colorMixer.palettes[0].huesVbo, 0, 0)
            break;
        case 1:
            image(colorMixer.palettes[0].marbleVbo, 0, 0)
            break;
        case 2:
            image(colorMixer.palettes[1].huesVbo, 0, 0)
            break;
        case 3:
            image(colorMixer.palettes[1].marbleVbo, 0, 0)
            break;
        case 4:
            image(colorMixer.mixedVbo, 0, 0)
            break;
    }
}
