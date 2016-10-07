window.onload = main

var canvasSize = {
    width: 600 / 2,
    height: 400 / 2
}

var settings = {
    agents: 4000,
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
    strokeWidth: 1,
    maxAngleSpan: 220,
    speed: 3,
    interAgentNoiseZRange: 0, // FIND CORRECT VALUE
    noiseZStep: 0.003,
    randomInitialDirection: 0 // TODO: should this randomized here?
}

var stats = new Stats();

var agents = []

var data = {
    emotion0: null,
    emotion1: null
}

var colorMixer

function setup() {
    // TODO: make ajax call to backend to get emotions and amounts

    colorMixer = new ColorMixer(canvasSize, settings.paletteScaleFactor, settings.customBlend, ["fear", "anger"], settings.blendFactor)
    createCanvas(canvasSize.width, canvasSize.height)
    for (var i = 0; i < settings.agents; i++) {
        agents.push(new Agent(canvasSize, agentDefaults))
    }
    // mydraw()
    stats.showPanel(1); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.dom);
    strokeWeight(agentDefaults.strokeWidth)
    myDraw();
}

function myDraw() {
    stats.begin();

    // fill(255)
    // noStroke()
    // rect(0, 0, canvasSize.width, canvasSize.height)

    for (var i = 0; i < agents.length; i++) {
        agents[i].update()
        agents[i].draw()
    }

    if (settings.debug) showVbos()

    stats.end();
    requestAnimationFrame(myDraw) // only use if initiating draw ourselves
}

function main() {
    // var canvas = document.getElementById('swarm') // TODO: do we use our canvas or p5's?
    // var ctx = canvas.getContext('2d')
    // draw()
}

function mousePressed() {
    if (mouseButton === LEFT) settings.imageChoice += 1
    if (mouseButton === RIGHT) settings.imageChoice -= 1
    if (settings.imageChoice % 5 === 0) settings.imageChoice = 0
    if (settings.imageChoice < 0) settings.imageChoice = 0
    console.log(settings.imageChoice)
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
