# Mindswarms web version

This is the web version built for the Saatchi & Saatchi Wellness homepage. It is a live visualisation that depends on the server being set up from [https://github.com/random-quark/mind-swarms-backend](mind-swarms-backend). The visualisation uses the three.js library for fast drawing in WebGL.

To add to a page, include the `three.min.js` and `build/swarm.js` files on your page. To include on the page:

```
<div id="swarm-element"></div>
```

```
swarm.create('swarm-element', 400, 800, 'http://server.com/'); // element id, width, height, API basePath
```

The visualisation will render itself into the element and make a call to the basepath + /sentiment to fetch data.
