# Mindswarms web version

This is the web version built for the Saatchi & Saatchi Wellness homepage. It is a live visualisation that depends on the server being set up from [https://github.com/random-quark/mind-swarms-backend](mind-swarms-backend). The visualisation uses the three.js library for fast drawing in WebGL.

To add to a page, include `three.min.js`, `build/swarm.js`, `style.css` files on your page. To include on the page:

```
<div class="swarm-container"></div>
```

```
swarm.create('swarm-container', 'http://server.com/api-root/'); // element class, API basePath
```

The visualisation will render itself into the element and make a call to the basepath + `/sentiment` to fetch data.

The responsive design looking correct depends on this meta tag being present in the `<head>`:

```<meta name="viewport" content="width=device-width, initial-scale=1.0">```
