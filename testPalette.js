var paletteScaleFactor = 2
var sizeX = 300
var sizeY = 300
var customBlend = true
var blendFactor = 0.5
var colorMixer

function setup() {
    createCanvas(600, 600)
    colorMixer = new ColorMixer(["anger", "fear"]);
}

function draw() {
    background(225, 225, 225)
    image(colorMixer.mixedVbo, 0,0)
}
