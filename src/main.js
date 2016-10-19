window.onload = getData

 function HSB2HSL(h, s, b) {
    var l = (2 - s) * b / 2;
    s = l && l < 1 ? s * b / (l < 0.5 ? l * 2 : 2 - l * 2) : s;
    return [h, s, l]
}

var basePath = 'https://vast-hamlet-96778.herokuapp.com'

var canvasSize = {
    width: window.innerWidth*0.998,
    height: window.innerHeight*0.99
}

var settings = {
    agents: 70000,
    sizeAgentRatio: 0.033,
    fadeAlpha: 0,
    noiseDet: 4,
    overlayAlpha: 0,
    blendFactor: 0.2,
    paletteScaleFactor: 2,
    customBlend: true,
    imageChoice: 0,
    debug: false,
    emotions: ['joy', 'anger'],
    fetchPeriod: 60
}

var agentDefaults = {
    noiseScale: 200,
    randomSeed: 0,
    agentsAlpha: 20,
    strokeWidth: 2,
    maxAngleSpan: 220,
    speed: 3,
    interAgentNoiseZRange: 0, // TODO: FIND CORRECT VALUE
    noiseZStep: 0.001,
    randomInitialDirection: 0 // TODO: should this randomized here?
}

var emotionsColors = {
    anger: [19, 0.05, 0.9], // ORANGE
    joy: [55, 0.02, 0.9], //YELLOW
    calm: [0, 0.1, 0.8], // WHITE
    disgust: [162, 0.1, 0.8], // DISGUST
    sadness: [190, 0.1, 0.8], // LIGHT BLUE
    fear: [210, 0.1, 0.8], // BLUE
    surprise: [285, 0.1, 0.65], // PURPLE
    love: [0, 0.1, 0.8] // RED
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
        var action = started ? setColorLowResMixer : init
        action()
    }

    var req = new XMLHttpRequest()
    req.addEventListener('load', reqListener)
    req.open('GET', basePath + '/sentiment/')
    req.send()

    setTimeout(getData, settings.fetchPeriod * 1000)
}

// function setColorHiResMixer() {
//     // colorMixer = new ColorMixer(canvasSize, settings.paletteScaleFactor, settings.customBlend, settings.emotions, settings.blendFactor)
//     colorMixer = new ColorMixer(canvasSize, 1, settings.customBlend, ["fear", "anger"], settings.blendFactor)
// }
function setColorLowResMixer() {
    // colorMixer = new ColorMixer(canvasSize, settings.paletteScaleFactor, settings.customBlend, settings.emotions, settings.blendFactor)
    colorMixer = new ColorMixer(canvasSize, 2, settings.customBlend, settings.emotions, settings.blendFactor)
}

function init() {
    started = true
    addOverlay(settings.emotions[0], [ emotionsColors[settings.emotions[0]], emotionsColors[settings.emotions[1]] ])
    setColorLowResMixer()
    // startWorker()

    // settings.agents = (canvasSize.width * canvasSize.height) * settings.sizeAgentRatio

    camera = new THREE.OrthographicCamera( canvasSize.width / - 2, canvasSize.width / 2, canvasSize.height / 2, canvasSize.height / - 2, 0.1, 10000 );
    camera.position.set(0, 0, -10);
    scene = new THREE.Scene();
    var material = new THREE.MeshBasicMaterial({
        vertexColors: THREE.VertexColors,
        opacity: 0.1,
        transparent: true,
        linewidth: 1
    })

    for (var i = 0; i < settings.agents; i++) agents.push(new Agent(i))
    var line = new THREE.LineSegments(geometry, material);
    scene.add(line);
    renderer = new THREE.WebGLRenderer({
        preserveDrawingBuffer: true,
        antialias: true,
        alpha: true,
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

function addOverlay(emotion, colors) {
	if (!emotion) emotion = "splendid"

  var overlay = document.createElement('div')
  overlay.className = 'swarm-overlay'
  var logo = document.createElement('div')
  logo.className = 'logo'
  var text = document.createElement('div')
  text.className = 'text'
  logo.innerHTML = '<img src="assets/ssw-logo.png" height="120">'
  var textA = document.createElement('span')
  var textB = document.createElement('span')
  textA.appendChild(document.createTextNode('Today the world is feeling'))
  textB.appendChild(document.createTextNode(emotion))
  text.appendChild(textA)
  text.appendChild(textB)

	var alpha = 0.75

	var dominantColor = HSB2HSL(colors[0][0], colors[0][1], colors[0][2])
	var subColor = HSB2HSL(colors[1][0], colors[1][1], colors[1][2])

	var left = 'hsla(' + subColor[0] + ',' + 100 + '%,' + subColor[2]*100 + '%, ' + alpha + ')'
	var right = 'hsla(' + dominantColor[0] + ',' + 100 + '%,' + dominantColor[2]*100 + '%,' + alpha + ')'
	var gradient = 'linear-gradient(45deg, '+ left +', '+ right + ')'

	left = 'hsla(' + dominantColor[0] + ',' + 100 + '%,' + dominantColor[2]*100 + '%,' + alpha + ')'
	right = 'hsla(' + dominantColor[0] + ',' + 75 + '%,' + dominantColor[2]*100 + '%,' + alpha + ')'
	var gradient2 = 'linear-gradient(45deg, ' + left + ','+ right +')'

  logo.style.backgroundImage = gradient
  textA.style.backgroundImage = gradient
  textB.style.backgroundImage = gradient2

  overlay.appendChild(logo)
  overlay.appendChild(text)

  document.body.appendChild(overlay)
}

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
