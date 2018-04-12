/*globals geometry:false, agentDefaults:false, canvasSize: false, colorMixer: false, customNoise: false */

function Agent(i, agentDefaults, canvasSize, limits, geometry, colorMixer) {
  this.i = i;
  this.settings = Object.assign({}, agentDefaults);
  this.canvasSize = canvasSize;
  this.limits = limits;
  this.colorMixer = colorMixer;
  this.geometry = geometry;
  this.noiseZ = Math.random() * this.settings.interAgentNoiseZRange;
  this.widthHeighRatio = canvasSize.width / canvasSize.height;
  this.setLocation();

  geometry.vertices.push(
    new THREE.Vector3(this.location.previous.x, this.location.previous.y, 0),
    new THREE.Vector3(this.location.current.x, this.location.current.y, 0)
  );

  this.setColor();
}

Agent.prototype.newColorMixer = function(colorMixer) {
  this.colorMixer = colorMixer;
};

Agent.prototype.setLocation = function() {
  this.location = {
    current: {
      x: Math.floor(
        Math.random() * (this.canvasSize.width + this.limits.range * 2) -
          this.limits.range
      ),
      y: Math.floor(
        Math.random() * (this.canvasSize.height + this.limits.range * 2) -
          this.limits.range
      )
    }
  };
  this.location.previous = {
    x: this.location.current.x,
    y: this.location.current.y
  };
};

Agent.prototype.constrain = function(value, min, max) {
  return Math.round(Math.min(Math.max(value, min), max));
};

Agent.prototype.setColor = function() {
  var x = this.constrain(this.location.current.x, 0, this.canvasSize.width - 1);
  var y = this.constrain(
    this.location.current.y,
    0,
    this.canvasSize.height - 1
  );

  this.agentColor = this.colorMixer.getColor(x, y);
  var colorHSL = HSB2HSL(
    this.agentColor[0],
    this.agentColor[1],
    this.agentColor[2]
  );
  var color = new THREE.Color().setHSL(colorHSL[0], colorHSL[1], colorHSL[2]);
  if (this.geometry.colors[this.i * 2]) {
    this.geometry.colors[this.i * 2].set(color);
    this.geometry.colors[this.i * 2 + 1].set(color);
  } else {
    this.geometry.colors.push(color, color);
  }
};

Agent.prototype.resetAgent = function() {
  this.setLocation();
  this.setColor();
};

Agent.prototype.map = function(n, start1, stop1, start2, stop2) {
  return (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
};

Agent.prototype.update = function() {
  var nx =
    this.location.current.x / this.settings.noiseScale +
    this.settings.randomSeed;
  var ny =
    this.location.current.y / this.settings.noiseScale +
    this.settings.randomSeed;
  var nz = this.noiseZ + this.settings.randomSeed;
  var noiseVal = customNoise.noise(nx, ny, nz);
  var angle = this.map(noiseVal, 0, 1, -1, 1);

  // var noiseVal = noise.perlin3(nx, ny, nz)
  // var angle = this.map(noiseVal, -1, 1, -1, 1)

  angle =
    angle * (this.settings.maxAngleSpan * Math.PI / 180) +
    this.settings.randomInitialDirection;
  this.location.current.x += Math.cos(angle) * this.settings.speed; // SLOW +30ms
  this.location.current.y += Math.sin(angle) * this.settings.speed; // SLOW +30ms

  // INSIGNIFICANT TIME
  if (
    this.location.current.x < 0 - this.limits.range ||
    this.location.current.x > this.canvasSize.width + this.limits.range ||
    this.location.current.y < 0 - this.limits.range ||
    this.location.current.y > this.canvasSize.height + this.limits.range
  )
    this.resetAgent();
  this.noiseZ += this.settings.noiseZStep;

  this.geometry.vertices[this.i * 2].x =
    this.location.previous.x - this.canvasSize.width / 2;
  this.geometry.vertices[this.i * 2].y =
    this.location.previous.y - this.canvasSize.height / 2;

  this.geometry.vertices[this.i * 2 + 1].x =
    this.location.current.x - this.canvasSize.width / 2;
  this.geometry.vertices[this.i * 2 + 1].y =
    this.location.current.y - this.canvasSize.height / 2;

  this.location.previous.x = this.location.current.x;
  this.location.previous.y = this.location.current.y;
};
