function Agent(canvasSize) {
    this.settings = Object.assign(settings, agentDefaults)
    this.noiseZ = Math.random() * this.settings.interAgentNoiseZRange
    this.setLocation()
    this.setColor()
}

Agent.prototype.setLocation = function() {
    this.location = {
        current: {
            x: Math.floor(random(canvasSize.width)),
            y: Math.floor(random(canvasSize.height))
        }
    }
    this.location.previous = {
        x: this.location.current.x,
        y: this.location.current.y
    }
}

Agent.prototype.setColor = function() {
    this.agentColor = colorMixer.getColor(this.location.current.x, this.location.current.y)
    this.agentColor[3] = agentDefaults.agentsAlpha
}

Agent.prototype.resetAgent = function() {
    this.setLocation()
    this.setColor()
}

Agent.prototype.update = function() {
    var noiseVal = noise(this.location.current.x / this.settings.noiseScale + this.settings.randomSeed,
        this.location.current.y / this.settings.noiseScale + this.settings.randomSeed, this.noiseZ + this.settings.randomSeed)
    var angle = map(noiseVal, 0, 1, -1, 1)
    angle = (angle * radians(this.settings.maxAngleSpan)) + this.settings.randomInitialDirection
    this.location.current.x += Math.cos(angle) * this.settings.speed
    this.location.current.y += Math.sin(angle) * this.settings.speed
    if (this.location.current.x < 0 || this.location.current.x > width || this.location.current.y < 0 || this.location.current.y > height) this.resetAgent()
    this.noiseZ += this.settings.noiseZStep
}

Agent.prototype.draw = function() {
    stroke(this.agentColor)
    line(this.location.previous.x, this.location.previous.y, this.location.current.x, this.location.current.y)
    this.location.previous.x = this.location.current.x
    this.location.previous.y = this.location.current.y
}
