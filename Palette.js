var paletteScaleFactor = 2

function Palette(_width, _height, colorData) {
    push()
    this.palWidth = _width / paletteScaleFactor
    this.palHeight = _height / paletteScaleFactor
    this.xPeriod = 1; // how many lines on the X axis
    this.yPeriod = 1; // how many lins on the Y axis
    this.turbPower = 2.0; // how much turbulence
    this.turbSize = 170; // noise zoom in factor
    this.marbleVbo = createImage(this.palWidth, this.palHeight)
    this.huesVbo = createImage(this.palWidth, this.palHeight)
    this.hueOffset = random(10000)
    colorMode(HSB, 360)
    this.c = color(colorData[0], 100, 100)
    this.hueRange = colorData[1]
    this.minMarbleBrightness = colorData[2]
    this.noiseStep = 0.005
    this.randomXoffset = random(1000)
    this.randomYoffset = random(1000)
    this.createMarble()
    this.createHues()
    this.marbleVbo.loadPixels() // needed so that we can read values in getColor() function
    this.huesVbo.loadPixels() // needed so that we can read values in getColor() function
    pop()
}

Palette.prototype.getColor = function(_x, _y) {
    push() // DONE FOR EVERY PIXEL - optimize
    colorMode(HSB, 1)
    var x = _x / paletteScaleFactor
    var y = _y / paletteScaleFactor
    var hueVar = this.huesVbo.pixels[y * this.huesVbo.width + x]
    var marble = this.marbleVbo.pixels[y * this.huesVbo.width + x]
    pop()
    return color(hue(hueVar), saturation(marble), brightness(marble))
}

Palette.prototype.createMarble = function() {
    push()
    this.marbleVbo.loadPixels()
    colorMode(HSB, 1) // FIX ME!!! THIS SHOULD NOT BE HERE!!!! MAYBE A PUSHSTYLE INTHIS FUNCTION?????
    for (var x = 0; x < this.palWidth; x++) {
        for (var y = 0; y < this.palHeight; y++) {
            var xyValue = (x + this.randomXoffset) * this.xPeriod / this.palWidth + (y + this.randomYoffset) * this.yPeriod / this.palHeight + this.turbPower * noise(x / this.turbSize, y / this.turbSize)
            var sineValue = abs(sin(xyValue * 3.14159))
            var tempColor = color(0, 1 - sineValue, map(sineValue, 0, 1, this.minMarbleBrightness, 1))
            this.marbleVbo.set(x, y, tempColor)
        }
    }
    this.marbleVbo.updatePixels();
    pop();
}

Palette.prototype.createHues = function() {
    push()
    this.huesVbo.loadPixels()
    colorMode(HSB, 1)
    for (var x = 0; x < this.palWidth; x++) {
        var hueVar = hue(this.c) + map(noise(this.hueOffset), 0, 1, -this.hueRange, this.hueRange)
        if (hueVar < 0) hueVar += 1
        var tempColor = color(hueVar, 1, 1)
        for (var y = 0; y < this.palHeight; y++) {
            this.huesVbo.set(x, y, tempColor)
        }
        this.hueOffset += this.noiseStep
    }
    this.huesVbo.updatePixels()
    pop()
}
