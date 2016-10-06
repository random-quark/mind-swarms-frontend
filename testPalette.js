paletteScaleFactor = 2
sizeX = 300
sizeY = 300
customBlend = true
blendFactor = 0.5

function setup() {
    createCanvas(600, 600)
    // colorMode(HSB, 1)

    // var c = color(0,255,0)
    // var d = c.mode
    // var h = hue(c)
    // var g = 0

    colorMixer = new ColorMixer(["anger", "fear"]);
}

function draw() {
    background(225, 225, 225)
    // image(colorMixer.palettes[0].huesVbo, 0,0)
    // image(colorMixer.palettes[1].huesVbo, 0,100)
    image(colorMixer.mixedVbo, 0,410)



    // image(colorMixer.palettes[0].marbleVbo, 0,0)
    // image(pal.huesVbo, 0, 0)
    // pal.huesVbo.loadPixels();
    // console.log(pal.huesVbo.pixels[mouseX,mouseY])
    // console.log(pal.minMarbleBrightness)
}
