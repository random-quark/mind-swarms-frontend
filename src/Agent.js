/*globals geometry:false, agentDefaults:false, canvasSize: false, colorMixer: false, customNoise: false */

function Agent(i) {
    this.i = i
    this.settings = Object.assign({}, agentDefaults)
    this.noiseZ = Math.random() * this.settings.interAgentNoiseZRange
    this.widthHeighRatio = canvasSize.width/canvasSize.height
    this.setLocation()

    geometry.vertices.push(
        new THREE.Vector3(this.location.previous.x, this.location.previous.y, 1000),
        new THREE.Vector3(this.location.current.x, this.location.current.y, 1000)
    )

    this.initColor()
}

Agent.prototype.setLocation = function() {
    this.location = {
        current: {
            x: Math.floor(Math.random() * canvasSize.width),
            y: Math.floor(Math.random() * canvasSize.height)
        }
    }
    this.location.previous = {
        x: this.location.current.x,
        y: this.location.current.y
    }
}

Agent.prototype.initColor = function() {
    this.agentColor = colorMixer.getColor(this.location.current.x, this.location.current.y)
    var colorHSL = HSB2HSL(this.agentColor[0], this.agentColor[1], this.agentColor[2])
    var color = new THREE.Color().setHSL(colorHSL[0], colorHSL[1], colorHSL[2])
    geometry.colors.push(color, color)
}

Agent.prototype.setColor = function() {
    this.agentColor = colorMixer.getColor(this.location.current.x, this.location.current.y)
    var colorHSL = HSB2HSL(this.agentColor[0], this.agentColor[1], this.agentColor[2])
    var color = new THREE.Color().setHSL(colorHSL[0], colorHSL[1], colorHSL[2])
    geometry.colors[this.i * 2].set(color)
    geometry.colors[this.i * 2 + 1].set(color)
}

Agent.prototype.resetAgent = function() {
    this.setLocation()
    this.setColor()
}

Agent.prototype.map = function(n, start1, stop1, start2, stop2) {
    return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
}

Agent.prototype.update = function() {
    var nx = this.location.current.x / (this.settings.noiseScale * this.widthHeighRatio) + this.settings.randomSeed
    var ny = this.location.current.y / this.settings.noiseScale + this.settings.randomSeed
    var nz = this.noiseZ + this.settings.randomSeed
    var noiseVal = customNoise.noise(nx, ny, nz)
    var angle = this.map(noiseVal, 0, 1, -1, 1)

    // var noiseVal = noise.perlin3(nx, ny, nz)
    // var angle = this.map(noiseVal, -1, 1, -1, 1)


    angle = angle * (this.settings.maxAngleSpan * Math.PI / 180) + this.settings.randomInitialDirection
    this.location.current.x += Math.cos(angle) * this.settings.speed // SLOW +30ms
    this.location.current.y += Math.sin(angle) * this.settings.speed // SLOW +30ms

    // INSIGNIFICANT TIME
    if (this.location.current.x < 0 || this.location.current.x > canvasSize.width || this.location.current.y < 0 || this.location.current.y > canvasSize.height) this.resetAgent()
    this.noiseZ += this.settings.noiseZStep

    geometry.vertices[this.i * 2].x = this.location.previous.x - canvasSize.width / 2
    geometry.vertices[this.i * 2].y = this.location.previous.y - canvasSize.height / 2

    geometry.vertices[this.i * 2 + 1].x = this.location.current.x - canvasSize.width / 2
    geometry.vertices[this.i * 2 + 1].y = this.location.current.y - canvasSize.height / 2

    this.location.previous.x = this.location.current.x
    this.location.previous.y = this.location.current.y
}
