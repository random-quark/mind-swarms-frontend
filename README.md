# Mindswarms web version

This is the web version built for the Saatchi & Saatchi Wellness homepage. It is a live visualisation that depends on the server being set up from [mind-swarms-backend](https://github.com/random-quark/mind-swarms-backend). The visualisation uses the three.js library for fast drawing in WebGL. See a [live demo version](http://random-quark.github.io/mind-swarms-frontend/build-demo.html).

For further help please contact hello@randomquark.com

To add to a page, include `three.min.js`, `build/swarm.js`, `style.css` files on your page. To include on the page:

*Note:* if you update any of the source files run `./build.sh` on the command line. You will need to install uglify-js with this command: `npm install -g uglify-js`.

```
<div class="swarm-container"></div>
```

```
swarm.create('swarm-container', 'http://server.com/api-root'); // element class, API basePath without trailing slash, add the url of the API wherever you set this up
```

The visualisation will render itself into the element and make a call to the basepath + `/sentiment` to fetch data. You will need the following files on the page to run successfully:

lib/stats.min.js
lib/three.min.js
build/swarm.js

The responsive design looking correct depends on this meta tag being present in the `<head>`:

```<meta name="viewport" content="width=device-width, initial-scale=1.0">```
