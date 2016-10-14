function Palette(_width, _height, paletteScaleFactor, colorData) {
    // push()
    customNoise.noiseDetail(10)
    customNoise.noiseSeed(Math.random()*10000) // needed so that marbles are not the same (otherwise sometimes they are)
    this.paletteScaleFactor = paletteScaleFactor
    this.palWidth = _width / paletteScaleFactor
    this.palHeight = _height / paletteScaleFactor
    this.xPeriod = 1; // how many lines on the X axis
    this.yPeriod = 1; // how many lins on the Y axis
    this.turbPower = 2.0; // how much turbulence
    this.turbSize = 170; // noise zoom in factor
    // this.marbleVbo = createImage(this.palWidth, this.palHeight)
    this.marbleVbo = [[]]
    // this.huesVbo = createImage(this.palWidth, 100)
    this.hueOffset = Math.random()*10000
    this.hueOffsetDebug = this.hueOffset
    // newP5.colorMode('hsb', 360)
    // this.c = color(colorData[0], 100, 100)
    this.c = colorData[0] / 360
    this.hueRange = colorData[1]
    this.minMarbleBrightness = colorData[2]
    this.noiseStep = 0.005
    this.randomXoffset = Math.random()*1000
    this.randomYoffset = Math.random()*5000
    this.createMarble()
    // this.createHues()
    // this.marbleVbo.loadPixels() // needed so that we can read values in getColor() function
    // this.huesVbo.loadPixels() // needed so that we can read values in getColor() function
    // pop()
}

Palette.prototype.getColor = function(_x, _y) {
    return this.marbleVbo[Math.floor(_x/this.paletteScaleFactor)][Math.floor(_y/this.paletteScaleFactor)]
}

Palette.prototype.map = function(n, start1, stop1, start2, stop2) {
  return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
}

Palette.prototype.createMarble = function() {
    // this.marbleVbo.loadPixels()
    // colorMode(HSB, 1) // FIX ME!!! THIS SHOULD NOT BE HERE!!!! MAYBE A PUSHSTYLE INTHIS FUNCTION?????
    for (var x = 0; x < this.palWidth; x++) {
      var hueVar = this.c + this.map(customNoise.noise(this.hueOffset), 0, 1, -this.hueRange, this.hueRange)
      if (hueVar < 0) hueVar += 1
      this.marbleVbo[x] = []
        for (var y = 0; y < this.palHeight; y++) {
            var xyValue = (x + this.randomXoffset) * this.xPeriod / this.palWidth + (y + this.randomYoffset) * this.yPeriod / this.palHeight + this.turbPower * customNoise.noise(x / this.turbSize, y / this.turbSize)
            var sineValue = Math.abs(Math.sin(xyValue * 3.14159))
            var tempColor = [hueVar, 1 - sineValue, this.map(sineValue, 0, 1, this.minMarbleBrightness, 1)]
            // this.marbleVbo.set(x, y, tempColor)
            this.marbleVbo[x].push(tempColor)
        }
        this.hueOffset += this.noiseStep
    }
    // this.marbleVbo.updatePixels();
}
