function ColorMixer(emotionsList) {
    push()
    this.angerData = [19, 0.05, 0.9] // ORANGE
    this.joyData = [55, 0.02, 0.9] //YELLOW
    this.calmData = [0, 0.1, 0.8] // WHITE
    this.disgustData = [162, 0.1, 0.8] // DISGUST
    this.sadnessData = [190, 0.1, 0.8] // LIGHT BLUE
    this.fearData = [210, 0.1, 0.8] // BLUE
    this.surpriseData = [285, 0.1, 0.65] // PURPLE
    this.loveData = [0, 0.1, 0.8] // RED

    this.emotionsData = {
        anger: this.angerData,
        joy: this.joyData,
        calm: this.calmData,
        disgust: this.disgustData,
        sadness: this.sadnessData,
        fear: this.fearData,
        surprise: this.surpriseData,
        love: this.loveData
    }

    this.mixedVbo = createImage(sizeX, sizeY)

    var colorData1 = this.emotionsData[emotionsList[0]]
    var colorData2 = this.emotionsData[emotionsList[1]]

    this.palettes = [new Palette(sizeX, sizeY, colorData1), new Palette(sizeX, sizeY, colorData2)]

    this.createMixedPalette();

    this.mixedVbo.loadPixels();

    pop()
}

ColorMixer.prototype.createMixedPalette = function() {
    push();
    colorMode(HSB, 1)
    var c1, c2, c
    this.mixedVbo.loadPixels()
    for (var x = 0; x < sizeX; x++) {
        for (var y = 0; y < sizeY; y++) {
            c1 = this.palettes[0].getColor(x, y)
            c2 = this.palettes[1].getColor(x, y)
            c = this.mixColors(c1, c2)
            this.mixedVbo.set(x, y, c)
        }
    }
    var t =0
    this.mixedVbo.updatePixels()
    pop();
}

ColorMixer.prototype.mixColors = function(c1, c2) {
    if (customBlend) {
        if (saturation(c1) < saturation(c2) * blendFactor) return c2
        else return c1
    } else return blendColor(c1, c2, DARKEST)
}
