function Agent(t,e,i,o,n,s){this.i=t,this.settings=Object.assign({},e),this.canvasSize=i,this.limits=o,this.colorMixer=s,this.geometry=n,this.noiseZ=Math.random()*this.settings.interAgentNoiseZRange,this.widthHeighRatio=i.width/i.height,this.setLocation(),n.vertices.push(new THREE.Vector3(this.location.previous.x,this.location.previous.y,0),new THREE.Vector3(this.location.current.x,this.location.current.y,0)),this.setColor()}function ColorMixer(t,e,i,o,n,s,a,r){this.blendFactor=s,this.mixedVbo=[[]];var h=o[n[0]],l=o[n[1]];this.customBlend=i,this.canvasSize=t,this.palettes=[new Palette(t.width,t.height,e,h,a,r),new Palette(t.width,t.height,e,l,a,r)],this.createMixedPalette()}function Palette(t,e,i,o,n,s){customNoise.noiseDetail(10),customNoise.noiseSeed(1e4*Math.random()),this.paletteScaleFactor=i,this.palWidth=t/i,this.palHeight=e/i,this.xPeriod=1,this.yPeriod=1,this.turbPower=2,this.turbSize=170,this.marbleVbo=[[]],this.hueOffset=1e4*Math.random(),this.hueOffsetDebug=this.hueOffset,this.c=o[0]/360,this.hueRange=o[1],this.minMarbleBrightness=o[2],this.noiseStep=600/this.palWidth*.01,this.randomXoffset=1e3*Math.random(),this.randomYoffset=5e3*Math.random(),this.createMarble(),customNoise.noiseSeed(n),customNoise.noiseDetail(s)}function HSB2HSL(t,e,i){var o=(2-e)*i/2;return[t,e=o&&o<1?e*i/(o<.5?2*o:2-2*o):e,o]}function getQueryVariable(t){for(var e=window.location.search.substring(1).split("&"),i=0;i<e.length;i++){var o=e[i].split("=");if(o[0]==t)return o[1]}return null}Agent.prototype.newColorMixer=function(t){this.colorMixer=t},Agent.prototype.setLocation=function(){this.location={current:{x:Math.floor(Math.random()*(this.canvasSize.width+2*this.limits.range)-this.limits.range),y:Math.floor(Math.random()*(this.canvasSize.height+2*this.limits.range)-this.limits.range)}},this.location.previous={x:this.location.current.x,y:this.location.current.y}},Agent.prototype.constrain=function(t,e,i){return Math.round(Math.min(Math.max(t,e),i))},Agent.prototype.setColor=function(){var t=this.constrain(this.location.current.x,0,this.canvasSize.width-1),e=this.constrain(this.location.current.y,0,this.canvasSize.height-1);this.agentColor=this.colorMixer.getColor(t,e);var i=HSB2HSL(this.agentColor[0],this.agentColor[1],this.agentColor[2]),o=(new THREE.Color).setHSL(i[0],i[1],i[2]);this.geometry.colors[2*this.i]?(this.geometry.colors[2*this.i].set(o),this.geometry.colors[2*this.i+1].set(o)):this.geometry.colors.push(o,o)},Agent.prototype.resetAgent=function(){this.setLocation(),this.setColor()},Agent.prototype.map=function(t,e,i,o,n){return(t-e)/(i-e)*(n-o)+o},Agent.prototype.update=function(){var t=this.location.current.x/this.settings.noiseScale+this.settings.randomSeed,e=this.location.current.y/this.settings.noiseScale+this.settings.randomSeed,i=this.noiseZ+this.settings.randomSeed,o=customNoise.noise(t,e,i),n=(n=this.map(o,0,1,-1,1))*(this.settings.maxAngleSpan*Math.PI/180)+this.settings.randomInitialDirection;this.location.current.x+=Math.cos(n)*this.settings.speed,this.location.current.y+=Math.sin(n)*this.settings.speed,(this.location.current.x<0-this.limits.range||this.location.current.x>this.canvasSize.width+this.limits.range||this.location.current.y<0-this.limits.range||this.location.current.y>this.canvasSize.height+this.limits.range)&&this.resetAgent(),this.noiseZ+=this.settings.noiseZStep,this.geometry.vertices[2*this.i].x=this.location.previous.x-this.canvasSize.width/2,this.geometry.vertices[2*this.i].y=this.location.previous.y-this.canvasSize.height/2,this.geometry.vertices[2*this.i+1].x=this.location.current.x-this.canvasSize.width/2,this.geometry.vertices[2*this.i+1].y=this.location.current.y-this.canvasSize.height/2,this.location.previous.x=this.location.current.x,this.location.previous.y=this.location.current.y},ColorMixer.prototype.getColor=function(t,e){return this.mixedVbo[t][e]},ColorMixer.prototype.createMixedPalette=function(){for(var t,e,i,o=0;o<this.canvasSize.width;o++){this.mixedVbo[o]=[];for(var n=0;n<this.canvasSize.height;n++)t=this.palettes[0].getColor(o,n),e=this.palettes[1].getColor(o,n),i=this.mixColors(t,e),this.mixedVbo[o].push(i)}},ColorMixer.prototype.mixColors=function(t,e){if(this.customBlend)return t[1]<e[1]*this.blendFactor?e:t},Palette.prototype.getColor=function(t,e){return this.marbleVbo[Math.floor(t/this.paletteScaleFactor)][Math.floor(e/this.paletteScaleFactor)]},Palette.prototype.map=function(t,e,i,o,n){return(t-e)/(i-e)*(n-o)+o},Palette.prototype.createMarble=function(){for(var t=0;t<this.palWidth;t++){var e=this.c+this.map(customNoise.noise(this.hueOffset),0,1,-this.hueRange,this.hueRange);e<0&&(e+=1),this.marbleVbo[t]=[];for(var i=0;i<this.palHeight;i++){var o=(t+this.randomXoffset)*this.xPeriod/this.palWidth+(i+this.randomYoffset)*this.yPeriod/this.palHeight+this.turbPower*customNoise.noise(t/this.turbSize,i/this.turbSize),n=Math.abs(Math.sin(3.14159*o)),s=[e,1-n,this.map(n,0,1,this.minMarbleBrightness,1)];this.marbleVbo[t].push(s)}this.hueOffset+=this.noiseStep}},function(t){var o,c,d,e=t.swarm={};e.create=function(t,e){var i=document.getElementsByClassName(t)[0];i.innerHTML='<div class="swarm-metadata"><div class="data"><span class="swarm-time">--:--</span><span> / </span><span class="swarm-date">--.--.--</span><span> /</span><span class="live"> LIVE EmoScape<span class="super">TM</span>:</span></div><div class="emotions"><span class="emotion-box a">Surprise</span><span class="emotion-box b">Love</span><span class="emotion-box c">Anger</span></div></div>',l(),g.container=i,c={width:i.offsetWidth,height:i.offsetHeight},d=c.width>c.height?{width:600,height:600/(i.offsetWidth/i.offsetHeight)}:{width:600/(i.offsetHeight/i.offsetWidth),height:600},g.originalSize=Object.create(c),o=e,s()},e.resize=function(){c={width:g.container.offsetWidth,height:g.container.offsetHeight}},e.testNewColor=function(){g.emotions=["anger","surprise"],g.word="alarmed",g.top=["joy","disgust","anger"],a()};var m={range:50},g={debug:!1,manualColor:!1,agents:7e4,minAgents:4e4,sizeAgentRatio:.038,fadeAlpha:0,noiseDet:5,noiseSeed:1e4*Math.random(),overlayAlpha:0,blendFactor:.2,paletteScaleFactor:1,customBlend:!0,imageChoice:0,debug:!1,emotions:["joy","anger"],dominantEmotionProportion:.5,fetchPeriod:60,showOverlay:!0};g.debug="true"==getQueryVariable("debug");var u,p={noiseScale:100,randomSeed:0,agentsAlpha:20,strokeWidth:2,maxAngleSpan:220,speed:3,interAgentNoiseZRange:0,noiseZStep:.001,randomInitialDirection:0},i={anger:[19,.05,.9],joy:[55,.02,.9],calm:[0,.1,.8],disgust:[162,.1,.8],sadness:[190,.1,.8],fear:[210,.1,.8],surprise:[285,.1,.65],love:[0,.1,.8]},n={anger:"Anger",joy:"Joy",calm:"Calm",disgust:"Aversion",sadness:"Sadness",fear:"Fear",surprise:"Surprise",love:"Love"},f={anger:"logo2.png",joy:"logo1.png",calm:"logo1.png",disgust:"logo6.png",sadness:"logo6.png",fear:"logo5.png",surprise:"logo4.png",love:"logo3.png"};window.debug&&(u=new Stats);var w,v,y,b,M=[],S=new THREE.Geometry,x=!1;function s(){function e(){console.error("Swarm: failed to connect to sentiment service, loading default emotions"),g.emotions=["joy","love"],g.word="joyful",g.top=["joy","love","surprise"],g.dominantEmotionProportion=.5,(x?a:r)()}var i=new XMLHttpRequest;i.addEventListener("load",function(){var t;"404"==i.status||g.manualColor?e():(t=JSON.parse(i.responseText),g.emotions=[t.dominant[0][0],t.dominant[1][0]],g.blendFactor=t.dominant[1][1]/t.dominant[0][1],g.top=t.top,g.word=t.word,g.dominantEmotionProportion=t.dominant[0][1],(x?a:r)())}),i.addEventListener("error",e),i.open("GET",o+"/sentiment/"),i.send(),setTimeout(s,1e3*g.fetchPeriod)}function E(){w=new ColorMixer(d,g.paletteScaleFactor,g.customBlend,i,g.emotions,g.blendFactor,g.noiseSeed,g.noiseDet);for(var t=0;t<M.length;t++)M[t].newColorMixer(w)}function a(){E(),function(){H();var t=document.getElementsByClassName("swarm-logo");t[t.length-1].className+=" fadeout"}()}function r(){x=!0,g.showOverlay&&(H(),setTimeout(function(){var t;(t=document.createElement("div")).className="logo swarm-logo",document.createElement("div").className="text",t.innerHTML='<img src="assets/white/'+f[g.top[0]]+'">',t.id="swarm-logo",document.getElementsByClassName("swarm-overlay")[0].appendChild(t)},500));var t,e,i=function(){if(function(){try{return window.WebGLRenderingContext&&document.createElement("canvas").getContext("experimental-webgl")}catch(t){return}}()){var t,e=document.createElement("canvas"),i=e.getContext("webgl")||e.getContext("experimental-webgl");try{i.clearStencil(0),t=i.getError()}catch(t){return!1}return 0===t}return!1}(),o=/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream;if(!i||o)return t=g.emotions,e=document.createElement("div"),t.sort(function(t,e){return t<e?-1:e<t?1:0}),e.style.backgroundImage="url(assets/fallback-images/"+t[0]+"-"+t[1]+".jpg)",e.className="fallback-image",void g.container.appendChild(e);E(),g.agents=Math.max(g.minAgents,c.width*c.height*g.sizeAgentRatio),(v=new THREE.OrthographicCamera(d.width/-2,d.width/2,d.height/2,d.height/-2,.1,1e4)).position.set(0,0,-450),y=new THREE.Scene;for(var n=new THREE.MeshBasicMaterial({vertexColors:THREE.VertexColors,opacity:.1,transparent:!0,linewidth:1}),s=0;s<g.agents;s++)M.push(new Agent(s,p,d,m,S,w));var a,r,h,l=new THREE.LineSegments(S,n);y.add(l),!0===g.debug&&(a=new THREE.BoxGeometry(14,14,14),(r=new THREE.MeshLambertMaterial).color=new THREE.Color(255,0,0),(h=new THREE.Mesh(a,r)).position.x=d.width/-2,h.position.y=d.height/-2,h.position.z=0,y.add(h),(h=new THREE.Mesh(a,r)).position.x=d.width/2,h.position.y=d.height/-2,h.position.z=0,y.add(h),(h=new THREE.Mesh(a,r)).position.x=d.width/2,h.position.y=d.height/2,h.position.z=0,y.add(h),(h=new THREE.Mesh(a,r)).position.x=d.width/-2,h.position.y=d.height/2,h.position.z=0,y.add(h)),(b=new THREE.WebGLRenderer({preserveDrawingBuffer:!0,antialias:!0,alpha:!0})).setClearColor(16777215,0),b.setPixelRatio(window.devicePixelRatio),b.setSize(c.width,c.height),b.sortObjects=!1,b.autoClearColor=!1,v.lookAt(y.position),g.container.appendChild(b.domElement),!0===g.debug&&(window.debug&&u.showPanel(1),window.debug&&document.body.appendChild(u.dom)),C()}function C(){window.debug&&u.begin();for(var t=0;t<M.length;t++)M[t].update();window.debug&&u.end(),S.verticesNeedUpdate=!0,S.colorsNeedUpdate=!0,b.render(y,v),requestAnimationFrame(C)}function h(t){return t.toString().length<2?"0"+t:t}function l(){var t=new Date,e=t.getDate()+"."+(parseInt(t.getMonth(),10)+1)+"."+t.getFullYear().toString().substring(2);document.getElementsByClassName("swarm-date")[0].innerHTML=e;var i=h(t.getHours())+":"+h(t.getMinutes());document.getElementsByClassName("swarm-time")[0].innerHTML=i,setTimeout(l,1e3)}function H(){document.getElementsByClassName("a")[0].innerHTML='<span class="emotion-word fadein">'+n[g.top[0]]+"</span>",document.getElementsByClassName("b")[0].innerHTML='<span class="emotion-word fadein">'+n[g.top[1]]+"</span>",document.getElementsByClassName("c")[0].innerHTML='<span class="emotion-word fadein">'+n[g.top[2]]+"</span>",document.getElementsByClassName("a")[0].className="emotion-box a "+g.top[0],document.getElementsByClassName("b")[0].className="emotion-box b "+g.top[1],document.getElementsByClassName("c")[0].className="emotion-box c "+g.top[2]}t.addEventListener("resize",function(){location.reload()})}(window),function(){function y(t){return.5*(1-Math.cos(t*Math.PI))}var b,t=window.customNoise={},M=4095,S=4,x=.5;t.noise=function(t,e,i){if(e=e||0,i=i||0,null==b){b=new Array(4096);for(var o=0;o<4096;o++)b[o]=Math.random()}t<0&&(t=-t),e<0&&(e=-e),i<0&&(i=-i);for(var n,s,a=Math.floor(t),r=Math.floor(e),h=Math.floor(i),l=t-a,c=e-r,d=i-h,m=0,g=.5,u=0;u<S;u++){var p=a+(r<<4)+(h<<8),f=y(l),w=y(c),v=b[p&M];v+=f*(b[p+1&M]-v),n=b[p+16&M],v+=w*((n+=f*(b[p+16+1&M]-n))-v),n=b[(p+=256)&M],n+=f*(b[p+1&M]-n),s=b[p+16&M],n+=w*((s+=f*(b[p+16+1&M]-s))-n),m+=(v+=y(d)*(n-v))*g,g*=x,a<<=1,r<<=1,h<<=1,1<=(l*=2)&&(a++,l--),1<=(c*=2)&&(r++,c--),1<=(d*=2)&&(h++,d--)}return m},t.noiseDetail=function(t,e){0<t&&(S=t),0<e&&(x=e)},t.noiseSeed=function(t){var e,i,o,n=(o=4294967296,{setSeed:function(t){i=e=(null==t?Math.random()*o:t)>>>0},getSeed:function(){return e},rand:function(){return(i=(1664525*i+1013904223)%o)/o}});n.setSeed(t),b=new Array(4096);for(var s=0;s<4096;s++)b[s]=n.rand()}}();