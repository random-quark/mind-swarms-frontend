var paletteScaleFactor = 2

function Palette(_width, _height, colorData) {
    push()
    this.palWidth = _width / paletteScaleFactor
    this.palHeight = _height / paletteScaleFactor
    this.xPeriod = 1.; // how many lines on the X axis
    this.yPeriod = 1.; // how many lins on the Y axis
    this.turbPower = 2.0; // how much turbulence
    this.turbSize = 170; // noise zoom in factor
    this.marbleVbo = [
        []
    ]
    this.huesVbo = [
        []
    ]
    this.hueOffset = random(10000)

    this.c = color(colorData[0], 100, 100)
    this.hueRange = colorData[1]
    this.minMarbleBrightness = colorData[2]

    this.noiseStep = 0.005

    this.randomXoffset = random(1000)
    this.randomYoffset = random(1000)

    this.firstName = first;
    this.lastName = last;
    this.age = age;
    this.eyeColor = eyecolor;

    pop()
}
