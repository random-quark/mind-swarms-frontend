function Agent(params) {
    this.settings = {
        noiseZ: Math.random() * params.interAgentNoiseZRange,
        speed: params.speed,
        alpha: params.alpha,
        maxAngleSpan: params.maxAngleSpan,
        agentColor: null
    }
    this.setLocation()
    this.angle = 0
    this.setColor()
}

Agent.prototype.setColor() = function() {
    // this.agentColor = palette.getColor(this.location.current)
    this.agentColor = 'black'
}

Agent.prototype.setLocation() = function() {
    this.location = {
        current: {
            x: Math.random() * width, y: Math.random() * height
        }
     }
    this.location.previous = this.location.current
}

Agent.prototype.resetAgent() = function() {
    this.setColor()
    this.setLocation()
}

Agent.prototype.update = function() {
    var noiseVal = noise(location.current.x/noiseScale + randomSeed, location.current.y/noiseScale + randomSeed)
    angle = map(noiseVal, 0, 1, -1, 1)
    angle = (angle * radians(params.maxAngleSpan) * noiseStrength) + randomInitialDirection
    location.current.x += cos(angle) * settings.speed
    location.current.y += sin(angle) * settings.speed
    if (location.current.x<0 || location.current.x>width || location.current.y<0 || location.current.y>height) this.resetAgent()
}

Agent.prototype.draw = function() {
    // make sure alpha, stroke, strokeweight and strokewidth are set correctly
    // draw a line from previous to current

    location.previous = Object.create(location.current)
    noiseZ += noiseStep
}
