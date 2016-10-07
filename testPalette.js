var paletteScaleFactor = 2
var sizeX = 300
var sizeY = 300
var customBlend = true
var blendFactor = 0.5
var colorMixer

var canvasSize = {
    width: 100, height: 100
}

function setup() {
    createCanvas(canvasSize.width, canvasSize.height)
    colorMixer = new ColorMixer(canvasSize, 2, true, ["anger", "fear"]);
}

function draw() {
    background(225, 225, 225)
    image(colorMixer.mixedVbo, 0,0)
}
