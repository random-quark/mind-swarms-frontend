paletteScaleFactor = 2
sizeX = 200
sizeY = 200
customBlend = true
blendFactor = 0.5

function setup() {
    createCanvas(500, 500)
    colorMode(HSB, 1)

    // var c = color(0,255,0)
    // var d = c.mode
    // var h = hue(c)
    // var g = 0

    colorMixer = new ColorMixer(["anger", "fear"]);
}

function draw() {
    background(0, 100, 0)
    image(colorMixer.mixedVbo,20,20)



    // image(colorMixer.palettes[0].marbleVbo, 0,0)
    // image(pal.huesVbo, 0, 0)
    // pal.huesVbo.loadPixels();
    // console.log(pal.huesVbo.pixels[mouseX,mouseY])
    // console.log(pal.minMarbleBrightness)
}
