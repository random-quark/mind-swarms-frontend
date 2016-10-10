function Agent(i, canvasSize) {
    this.i = i
    this.settings = Object.assign({}, agentDefaults)
    this.noiseZ = Math.random() * this.settings.interAgentNoiseZRange

    this.setLocation()
    // this.setColor()

    var randLocX1 = Math.random() * 2000 - 1000;
    var randLocY1 = Math.random() * 2000 - 1000;
    var randLocX2 = randLocX1 - 5;
    var randLocY2 = randLocY1 - 5;
    geometry.vertices.push(
        new THREE.Vector3(this.location.previous.x, this.location.previous.y, 0),
        new THREE.Vector3(this.location.current.x, this.location.current.y, 0)
    );
    this.agentColor = colorMixer.getColor(this.location.current.x, this.location.current.y)
    this.agentColor[3] = agentDefaults.agentsAlpha
    c = new THREE.Color("rgb(" + this.agentColor[0] + "," + this.agentColor[1] + "," + this.agentColor[2] + ")")
    // c = new THREE.Color(0xffffff)
    geometry.colors.push(c,c)
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

Agent.prototype.setColor = function() {
    this.agentColor = colorMixer.getColor(this.location.current.x, this.location.current.y)
    this.agentColor[3] = agentDefaults.agentsAlpha
    c = new THREE.Color("rgb(" + this.agentColor[0] + "," + this.agentColor[1] + "," + this.agentColor[2] + ")")

    geometry.colors[this.i*2].set(c)
    geometry.colors[this.i*2+1].set(c)
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
    if (this.location.current.x < 0 || this.location.current.x > canvasSize.width || this.location.current.y < 0 || this.location.current.y > canvasSize.height) this.resetAgent()
    this.noiseZ += this.settings.noiseZStep

    geometry.vertices[this.i*2].x = this.location.previous.x - (canvasSize.width/2)
    geometry.vertices[this.i*2].y = this.location.previous.y - (canvasSize.height/2)

    geometry.vertices[this.i*2+1].x = this.location.current.x  - (canvasSize.width/2)
    geometry.vertices[this.i*2+1].y = this.location.current.y - (canvasSize.height/2)

    this.location.previous.x = this.location.current.x
    this.location.previous.y = this.location.current.y
}

// Agent.prototype.draw = function() {
//     // add new position and add to geometry
//
//
// }
