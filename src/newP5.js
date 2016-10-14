(function(global) {
  var module = global.customNoise = {}

  var scaled_cosine = function(i) {
    return 0.5*(1.0-Math.cos(i*Math.PI));
  };

  module.noise = function(x,y,z) { return 0; }

})(window)
