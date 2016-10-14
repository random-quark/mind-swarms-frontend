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

var canvasSize = {
    width: 600,
    height: 400
}

var i = 0

var colorMixer
window = self
document = self

function timedCount() {
    self.importScripts('ColorMixer.js')
    // self.importScripts('../lib/p5.js')
    i = i + 1
    colorMixer = new ColorMixer(canvasSize, 1, settings.customBlend, ["fear", "anger"], settings.blendFactor)
        // setTimeout("timedCount()",500)
    postMessage("done color mixing")
}

timedCount()
