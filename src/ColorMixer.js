function ColorMixer(canvasSize, paletteScaleFactor, customBlend, emotionsColors, emotionsList, _blendFactor, originalNoiseSeed, originalNoiseDet) {
    this.blendFactor = _blendFactor
    this.mixedVbo = [[]]
    var colorData1 = emotionsColors[emotionsList[0]]
    var colorData2 = emotionsColors[emotionsList[1]]
    this.customBlend = customBlend
    this.canvasSize = canvasSize

    this.palettes = [
        new Palette(canvasSize.width, canvasSize.height, paletteScaleFactor, colorData1, originalNoiseSeed, originalNoiseDet),
        new Palette(canvasSize.width, canvasSize.height, paletteScaleFactor, colorData2, originalNoiseSeed, originalNoiseDet)
    ]

    this.createMixedPalette()
}

ColorMixer.prototype.getColor = function(x, y) {
    return this.mixedVbo[x][y]
}

ColorMixer.prototype.createMixedPalette = function() {
    var c1, c2, c
    for (var x = 0; x < this.canvasSize.width; x++) {
        this.mixedVbo[x] = []
        for (var y = 0; y < this.canvasSize.height; y++) {
            c1 = this.palettes[0].getColor(x,y)
            c2 = this.palettes[1].getColor(x,y)
            c = this.mixColors(c1, c2)
            this.mixedVbo[x].push(c)
        }
    }
}

ColorMixer.prototype.mixColors = function(c1, c2) {
    if (this.customBlend) {
        if (c1[1] < c2[1] * this.blendFactor) return c2
        else return c1
    }
}
