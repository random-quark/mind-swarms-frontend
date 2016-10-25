function HSB2HSL(h, s, b) {
    var l = (2 - s) * b / 2;
    s = l && l < 1 ? s * b / (l < 0.5 ? l * 2 : 2 - l * 2) : s;
    return [h, s, l]
}

(function(global) {
    var module = global.swarm = {}

    var basePath, canvasSize

    module.create = function(containerClassName, _basePath) {
        var container = document.getElementsByClassName(containerClassName)[0]
        settings.container = container
        canvasSize = {
            width: container.offsetWidth,
            height: container.offsetHeight
        }
        agentDefaults.noiseScale = Math.max(Math.min(canvasSize.width * settings.widthNoiseScaleRatio, 250), 150)
        settings.originalSize = Object.create(canvasSize)
        basePath = _basePath
        getData()
    }

    module.resize = function() {
        canvasSize = {
            width: settings.container.offsetWidth,
            height: settings.container.offsetHeight
        }
        var ratio = canvasSize.width / settings.originalSize.width
        camera.zoom = ratio
        camera.updateProjectionMatrix()
    }

    module.testNewColor = function() {
        settings.emotions = ["anger", "surprise"]
        settings.word = "alarmed"
        update()
    }

    var limits = {
        range: 100
    }

    var settings = {
        agents: 70000,
        minAgents: 20000,
        widthNoiseScaleRatio: 0.13,
        sizeAgentRatio: 0.1,
        fadeAlpha: 0,
        noiseDet: 5,
        noiseSeed: Math.random() * 10000,
        overlayAlpha: 0,
        blendFactor: 0.2,
        paletteScaleFactor: 2,
        customBlend: true,
        imageChoice: 0,
        debug: false,
        emotions: ['joy', 'anger'],
        dominantEmotionProportion: 0.5,
        fetchPeriod: 60
    }

    var agentDefaults = {
        noiseScale: 150,
        randomSeed: 0,
        agentsAlpha: 20,
        strokeWidth: 2,
        maxAngleSpan: 220,
        speed: 3,
        interAgentNoiseZRange: 0, // TODO: FIND CORRECT VALUE
        noiseZStep: 0.001,
        randomInitialDirection: 0 // TODO: should this randomized here?
    }

    var emotionsColors = {
        anger: [19, 0.05, 0.9], // ORANGE
        joy: [55, 0.02, 0.9], //YELLOW
        calm: [0, 0.1, 0.8], // WHITE
        disgust: [162, 0.1, 0.8], // DISGUST
        sadness: [190, 0.1, 0.8], // LIGHT BLUE
        fear: [210, 0.1, 0.8], // BLUE
        surprise: [285, 0.1, 0.65], // PURPLE
        love: [0, 0.1, 0.8] // RED
    }

    var stats = new Stats()
    var agents = []
    var colorMixer
    var camera, scene, renderer, geometry
    geometry = new THREE.Geometry()

    var started = false

    function getData() {
        function reqListener() {
            if (req.status=='404') {
                reqFailed()
                return
            }
            var data = JSON.parse(req.responseText)
            settings.emotions = [data.dominant[0][0], data.dominant[1][0]]
            settings.blendFactor = data.dominant[1][1] / data.dominant[0][1]
    		settings.word = data.word
            settings.dominantEmotionProportion = data.dominant[0][1]
            var action = started ? update : init
            action()
        }

        function reqFailed() {
            console.error("Swarm: failed to connect to sentiment service, loading default emotions")
            settings.emotions = ["joy", "love"]
            settings.word = "joyful"
            settings.dominantEmotionProportion = 0.5
            init()
        }

        var req = new XMLHttpRequest()
        req.addEventListener('load', reqListener)
        req.addEventListener('error', reqFailed)
        req.open('GET', basePath + '/sentiment/')
        req.send()

        setTimeout(getData, settings.fetchPeriod * 1000)
    }

    function createColorMixer() {
        colorMixer = new ColorMixer(canvasSize, settings.paletteScaleFactor, settings.customBlend, emotionsColors, settings.emotions, settings.blendFactor, settings.noiseSeed, settings.noiseDet)
        for (var i = 0; i < agents.length; i++) {
            agents[i].newColorMixer(colorMixer)
        }
    }

    function update() {
    	createColorMixer()
    	updateOverlay(settings.word, [ emotionsColors[settings.emotions[0]], emotionsColors[settings.emotions[1]] ])
    }

    function init() {
        started = true
        addOverlay(settings.word, [ emotionsColors[settings.emotions[0]], emotionsColors[settings.emotions[1]] ])

        var supportsWebGL = (function(){
            if(( function () { try { return !! window.WebGLRenderingContext && !! document.createElement( 'canvas' ).getContext( 'experimental-webgl' ); } catch( e ) { return false; } } )()){
                var _canvas = document.createElement( 'canvas' );
                var _gl = _canvas.getContext( 'webgl' ) || _canvas.getContext( 'experimental-webgl' );
                var errors;
                try{
                    _gl.clearStencil( 0 );
                    errors=_gl.getError();
                }catch(e){
                    return false;
                }
                return errors === 0;
            }else{
                return false;
            }
        })()
        var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        if (!supportsWebGL || iOS) {
          addFallbackImage(settings.emotions)
          return
        }

        createColorMixer()

        settings.agents = (canvasSize.width * canvasSize.height) * settings.sizeAgentRatio
        settings.agents = Math.max(Math.min(settings.minAgents, settings.agents), settings.agents)

        // alert((canvasSize.width * canvasSize.height) * settings.sizeAgentRatio)

        camera = new THREE.OrthographicCamera( canvasSize.width / - 2, canvasSize.width / 2, canvasSize.height / 2, canvasSize.height / - 2, 0.1, 10000 );
        camera.position.set(0, 0, -10);
        scene = new THREE.Scene();
        var material = new THREE.MeshBasicMaterial({
            vertexColors: THREE.VertexColors,
            opacity: 0.1,
            transparent: true,
            linewidth: 1
        })

        for (var i = 0; i < settings.agents; i++) agents.push(new Agent(i, agentDefaults, canvasSize, limits, geometry, colorMixer))
        var line = new THREE.LineSegments(geometry, material);
        scene.add(line);
        renderer = new THREE.WebGLRenderer({
            preserveDrawingBuffer: true,
            // antialias: true, // FIXME: turned off because it breaks preserveDrawingBuffer in iOS
            alpha: true,
        });
        renderer.setClearColor(0xffffff, 0)
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.setSize(canvasSize.width, canvasSize.height)
        renderer.sortObjects = false
        renderer.autoClearColor = false

        camera.lookAt(scene.position)

        settings.container.appendChild(renderer.domElement);

        stats.showPanel(1)
        document.body.appendChild(stats.dom)

        myDraw()
    }

    function onResize() {
        canvasSize = {
            width: settings.container.offsetWidth,
            height: settings.container.offsetHeight
        }
        renderer.setSize(canvasSize.width, canvasSize.height)
        var overlay = document.getElementsByClassName('swarm-overlay')[0]
        overlay.style.width = canvasSize.width + 'px'
        overlay.style.height = canvasSize.height + 'px'
    }

    global.addEventListener('resize', onResize)

    function myDraw() {
        stats.begin()
        for (var i = 0; i < agents.length; i++) {
            agents[i].update()
        }
        stats.end()

        geometry.verticesNeedUpdate = true;
        geometry.colorsNeedUpdate = true
        renderer.render(scene, camera)

        requestAnimationFrame(myDraw)
    }

    function buildGradients(colors) {
        var alpha = 0.75
        var dominantColor = HSB2HSL(colors[0][0], colors[0][1], colors[0][2])
    	var subColor = HSB2HSL(colors[1][0], colors[1][1], colors[1][2])

    	var left = 'hsla(' + subColor[0] + ',' + 100 + '%,' + subColor[2]*75 + '%, ' + alpha + ')'
    	var right = 'hsla(' + dominantColor[0] + ',' + 100 + '%,' + dominantColor[2]*75 + '%,' + alpha + ')'
    	// var gradient = 'linear-gradient(70deg, '+ left + ' ' + (1-settings.dominantEmotionProportion)*100 +'%, '+ right + ')' // TODO: experimenting with making gradient proportionate
        var gradient = 'linear-gradient(70deg, '+ left + ', '+ right + ')'

    	left = 'hsla(' + dominantColor[0] + ',' + 100 + '%,' + dominantColor[2]*75 + '%,' + alpha + ')'
    	right = 'hsla(' + dominantColor[0] + ',' + 75 + '%,' + dominantColor[2]*75 + '%,' + alpha + ')'
    	var gradient2 = 'linear-gradient(45deg, ' + left + ','+ right +')'

        return [gradient, gradient2]
    }

    function updateOverlay(emotion, colors) {
        var logo = document.getElementById('swarm-logo')
        var textA = document.getElementById('swarm-text')
        var textB = document.getElementById('swarm-emotion-word')

        var gradients = buildGradients(colors)

        logo.style.backgroundImage = gradients[0]
        textA.style.backgroundImage = gradients[0]
        textB.innerHTML = emotion
        textB.style.backgroundImage = gradients[1]
    }

    function addFallbackImage(emotions) {
        var background = document.createElement('div')
        emotions.sort(function(a, b) {
            if (a<b) return -1
            if (a>b) return 1
            return 0
        })
        background.style.backgroundImage = 'url(assets/fallback-images/' + emotions[0] + '-' + emotions[1] + '.jpg)'
        background.className = 'fallback-image'
        settings.container.appendChild(background)
    }

    function addOverlay(emotion, colors) {
    	if (!emotion) emotion = "splendid"

        var overlay = document.createElement('div')
        overlay.className = 'swarm-overlay'
        var logo = document.createElement('div')
        logo.className = 'logo'
        var text = document.createElement('div')
        text.className = 'text'
        logo.innerHTML = '<img src="assets/ssw-logo.png">'
        var textA = document.createElement('span')
        var textB = document.createElement('span')
        textA.appendChild(document.createTextNode('Today the world is feeling'))
        textB.appendChild(document.createTextNode(emotion))
        text.appendChild(textA)
        text.appendChild(textB)

        var gradients = buildGradients(colors)

        logo.style.backgroundImage = gradients[0]
        textA.style.backgroundImage = gradients[0]
        textB.style.backgroundImage = gradients[1]

        logo.id = "swarm-logo"
        textA.id = "swarm-text"
        textB.id = "swarm-emotion-word"

        overlay.appendChild(logo)
        overlay.appendChild(text)

        overlay.style.width = canvasSize.width + 'px'
        overlay.style.height = canvasSize.height + 'px'

        settings.container.appendChild(overlay)
    }
})(window)
