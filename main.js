window.onload = main

var settings = {
    agents: 1,
    noiseScale: 150,
    interAgentNoiseZRange: 0,
    noiseZStep: 0.001,
    noiseDet: 4,
    overlayAlpha: 0,
    agentsAlpha: 20,
    strokeWidth: 1,
    maxAngleSpan: 220,
    noiseStrength: 1,
    randomSeed: 0,
    speed: 3,
    blendFactor: 0.5,
    paletteScaleFactor: 2
}

var agents = []

var data = {
    emotion0: null,
    emotion1: null
}

function main() {
    var canvas = document.getElementById('swarm')
    var ctx = canvas.getContext('2d')

    for (var i=0; i<settings.agents; i++) {
        var params = {

        }
        agents.push(new Agent(params))
    }
    draw()
}

function draw() {
    for (var i=0; i<agents.length; i++) {
        agents[i].update()
        agents[i].draw()
    }
    requestAnimationFrame(draw)
}
