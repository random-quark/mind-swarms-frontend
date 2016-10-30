function Palette(_width, _height, paletteScaleFactor, colorData, originalNoiseSeed, originalNoiseDet) {
    customNoise.noiseDetail(10)
    customNoise.noiseSeed(Math.random()*10000) // needed so that marbles are not the same (otherwise sometimes they are)
    this.paletteScaleFactor = paletteScaleFactor
    this.palWidth = _width / paletteScaleFactor
    this.palHeight = _height / paletteScaleFactor
    this.xPeriod = 1; // how many lines on the X axis
    this.yPeriod = 1; // how many lins on the Y axis
    this.turbPower = 2.0; // how much turbulence
    this.turbSize = 170; // noise zoom in factor
    this.marbleVbo = [[]]
    this.hueOffset = Math.random()*10000
    this.hueOffsetDebug = this.hueOffset
    this.c = colorData[0] / 360
    this.hueRange = colorData[1]
    this.minMarbleBrightness = colorData[2]
    this.noiseStep = 0.005*2 // doubled it for more variety
    this.randomXoffset = Math.random()*1000
    this.randomYoffset = Math.random()*5000
    this.createMarble()
    customNoise.noiseSeed(originalNoiseSeed)
    customNoise.noiseDetail(originalNoiseDet)
}

Palette.prototype.getColor = function(_x, _y) {
    return this.marbleVbo[Math.floor(_x/this.paletteScaleFactor)][Math.floor(_y/this.paletteScaleFactor)]
}

Palette.prototype.map = function(n, start1, stop1, start2, stop2) {
  return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
}

Palette.prototype.createMarble = function() {
    for (var x = 0; x < this.palWidth; x++) {
      var hueVar = this.c + this.map(customNoise.noise(this.hueOffset), 0, 1, -this.hueRange, this.hueRange)
      if (hueVar < 0) hueVar += 1
      this.marbleVbo[x] = []
        for (var y = 0; y < this.palHeight; y++) {
            var xyValue = (x + this.randomXoffset) * this.xPeriod / this.palWidth + (y + this.randomYoffset) * this.yPeriod / this.palHeight + this.turbPower * customNoise.noise(x / this.turbSize, y / this.turbSize)
            var sineValue = Math.abs(Math.sin(xyValue * 3.14159))
            var tempColor = [hueVar, 1 - sineValue, this.map(sineValue, 0, 1, this.minMarbleBrightness, 1)]
            this.marbleVbo[x].push(tempColor)
        }
        this.hueOffset += this.noiseStep
    }
}
