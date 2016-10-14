var basePath = 'https://vast-hamlet-96778.herokuapp.com'

var canvasSize = {
    width: 300,
    height: 300
}

var settings = {
    agents: 30000,
    sizeAgentRatio: 0.033,
    fadeAlpha: 0,
    noiseDet: 4,
    overlayAlpha: 0,
    blendFactor: 0.2,
    paletteScaleFactor: 1,
    customBlend: true,
    imageChoice: 0,
    debug: false,
    emotions: [],
    fetchPeriod: 60
}

var agentDefaults = {
    noiseScale: 150,
    randomSeed: 0,
    agentsAlpha: 20,
    strokeWidth: 2,
    maxAngleSpan: 220,
    speed: 3,
    interAgentNoiseZRange: 0, // TODO: FIND CORRECT VALUE
    noiseZStep: 0.001,
    randomInitialDirection: 0 // TODO: should this randomized here?
}

var stats = new Stats();
var agents = []
var colorMixer
var camera, scene, renderer, geometry
geometry = new THREE.Geometry();

var started = false
var worker

// perlin = noise

function getData() {
    function reqListener() {
        var data = JSON.parse(req.responseText)
        settings.emotions = [data.dominant[0][0], data.dominant[1][0]]
        settings.blendFactor = data.dominant[1][1] / data.dominant[0][1]
        var action = started ? resetColorMixer : init
        action()
    }

    var req = new XMLHttpRequest()
    req.addEventListener('load', reqListener)
    req.open('GET', basePath + '/sentiment/')
    req.send()

    setTimeout(getData, settings.fetchPeriod * 1000)
}

function setColorHiResMixer() {
    // colorMixer = new ColorMixer(canvasSize, settings.paletteScaleFactor, settings.customBlend, settings.emotions, settings.blendFactor)
    colorMixer = new ColorMixer(canvasSize, 1, settings.customBlend, ["fear", "anger"], settings.blendFactor)
}
function setColorLowResMixer() {
    // colorMixer = new ColorMixer(canvasSize, settings.paletteScaleFactor, settings.customBlend, settings.emotions, settings.blendFactor)
    colorMixer = new ColorMixer(canvasSize, 2, settings.customBlend, ["fear", "anger"], settings.blendFactor)
}


function startWorker() {
    if(typeof(Worker) !== "undefined") {
        if(typeof(worker) == "undefined") {
            worker = new Worker("src/webWorker.js");
        }
        worker.onmessage = function(event) {
            console.log(event.data)
        };
    } else {
        // document.getElementById("result").innerHTML = "Sorry! No Web Worker support.";
    }
}

function init() {

    started = true
    setColorLowResMixer()
    // startWorker()

    settings.agents = (canvasSize.width * canvasSize.height) * settings.sizeAgentRatio

    camera = new THREE.OrthographicCamera( canvasSize.width / - 2, canvasSize.width / 2, canvasSize.height / 2, canvasSize.height / - 2, 0.1, 10000 );
    camera.position.set(0, 0, -10);
    scene = new THREE.Scene();
    var material = new THREE.MeshBasicMaterial({
        vertexColors: THREE.VertexColors,
        opacity: 0.1,
        transparent: true
    })

    for (var i = 0; i < settings.agents; i++) agents.push(new Agent(i))
    var line = new THREE.LineSegments(geometry, material);
    scene.add(line);
    renderer = new THREE.WebGLRenderer({
        preserveDrawingBuffer: true,
        antialias: true,
        alpha: true
    });
    renderer.setClearColor(0xffffff, 0)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(canvasSize.width, canvasSize.height)
    renderer.sortObjects = false
    renderer.autoClearColor = false
    camera.lookAt(scene.position)

    document.body.appendChild(renderer.domElement);

    stats.showPanel(1)
    document.body.appendChild(stats.dom)

    myDraw()
}

getData()

// function setup() {
// }

function myDraw() {
    stats.begin()
    for (var i = 0; i < agents.length; i++) {
        agents[i].update()
    }
    stats.end()
    geometry.verticesNeedUpdate = true;
    geometry.colorsNeedUpdate = true
    renderer.render(scene, camera)
    requestAnimationFrame(myDraw)
}
