# Mindswarms web version

This is the web version built for the Saatchi & Saatchi Wellness homepage. It is a live visualisation that depends on the server being set up from [mind-swarms-backend](https://github.com/random-quark/mind-swarms-backend). The visualisation uses the three.js library for fast drawing in WebGL. See a [live demo version](http://random-quark.github.io/mind-swarms-frontend/build-demo.html).

For further help please contact hello@randomquark.com

To add to a page, include `three.min.js`, `build/swarm.js`, `style.css` files on your page. To include on the page:

*Note:* if you update any of the source files run `./build.sh` on the command line.

```
<div class="swarm-container"></div>
```

```
swarm.create('swarm-container', 'http://server.com/api-root'); // element class, API basePath without trailing slash
```

The visualisation will render itself into the element and make a call to the basepath + `/sentiment` to fetch data.

The responsive design looking correct depends on this meta tag being present in the `<head>`:

```<meta name="viewport" content="width=device-width, initial-scale=1.0">```
