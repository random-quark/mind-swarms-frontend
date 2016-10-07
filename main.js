window.onload = main

var canvasSize = { width: 250, height: 250 }

var settings = {
    agents: 10,
    fadeAlpha: 0,
    noiseDet: 4,
    overlayAlpha: 0,
    blendFactor: 0.5,
    paletteScaleFactor: 2,
    customBlend: true
}

var agentDefaults = {
    agentsAlpha: 20 / 255,
    strokeWidth: 1,
    maxAngleSpan: 220,
    randomSeed: 0,
    speed: 3,
    noiseScale: 150,
    interAgentNoiseZRange: 0,
    noiseZStep: 0.001,
    randomInitialDirection: 0 // TODO: should this randomized here?
}

var agents = []

var data = {
    emotion0: null,
    emotion1: null
}

var colorMixer

function setup() {
    // TODO: make ajax call to backend to get emotions and amounts

    colorMixer = new ColorMixer(canvasSize, settings.paletteScaleFactor, settings.customBlend, ["fear", "anger"])
    createCanvas(canvasSize.width, canvasSize.height)
    for (var i=0; i<settings.agents; i++) {
        agents.push(new Agent(canvasSize, agentDefaults))
    }
    // mydraw()
}

function draw() {
    // fill(255, settings.fadeAlpha)
    // noStroke()
    // rect(0, 0, canvasSize.width, canvasSize.height)
    for (var i=0; i<agents.length; i++) {
        agents[i].update()
        agents[i].draw()
    }
    // requestAnimationFrame(mydraw) // only use if initiating draw ourselves
}

function main() {
    // var canvas = document.getElementById('swarm') // TODO: do we use our canvas or p5's?
    // var ctx = canvas.getContext('2d')
    // draw()
}
