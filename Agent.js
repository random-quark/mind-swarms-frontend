function Agent(canvasSize, agentDefaults) {
    var settings = {
        noiseZ: Math.random() * agentDefaults.interAgentNoiseZRange
    }
    this.noiseZ = 0
    this.settings = Object.assign(settings, agentDefaults)
    this.setLocation()
    this.setColor()
}

Agent.prototype.setLocation = function() {
    this.location = {
        current: {
            x: Math.random() * canvasSize.width, y: Math.random() * canvasSize.height
        }
     }
     this.location.previous = Object.assign({}, this.location.current) // TODO: this may not be supported in older browsers
}

Agent.prototype.setColor = function() {
    this.agentColor = colorMixer.getColor(this.location.current.x, this.location.current.y)
}

Agent.prototype.resetAgent = function() {
    this.setLocation()
    this.setColor()
}

Agent.prototype.update = function() {
    var noiseVal = noise(this.location.current.x/this.settings.noiseScale + this.settings.randomSeed,
                                this.location.current.y/this.settings.noiseScale + this.settings.randomSeed, this.noiseZ)
    var angle = map(noiseVal, 0, 1, -1, 1)
    angle = (angle * radians(this.settings.maxAngleSpan)) + this.settings.randomInitialDirection
    this.location.current.x += cos(angle) * this.settings.speed
    this.location.current.y += sin(angle) * this.settings.speed
    if (this.location.current.x<0 || this.location.current.x>width || this.location.current.y<0 || this.location.current.y>height) this.resetAgent()
    this.noiseZ += this.settings.noiseZStep
}

Agent.prototype.draw = function() {
    push() // FIXME: inefficient?

    // TODO: set weight/width as well

    colorMode(HSL, 1)
    colorMode(RGB, 255)
    var c = color(this.agentColor)
    colorMode(HSB, 1)
    strokeWeight(this.settings.strokeWidth)
    stroke(hue(c), saturation(c), brightness(c), this.settings.agentsAlpha)

    // colorMode(RGB, 255)
    // var c = color(this.agentColor)
    // stroke(c)

    line(this.location.previous.x, this.location.previous.y, this.location.current.x, this.location.current.y)
    this.location.previous.x = this.location.current.x
    this.location.previous.y = this.location.current.y
    pop()
}
