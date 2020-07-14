function Agent(t,e,i,o,n,s){this.i=t,this.settings=Object.assign({},e),this.canvasSize=i,this.limits=o,this.colorMixer=s,this.geometry=n,this.noiseZ=Math.random()*this.settings.interAgentNoiseZRange,this.widthHeighRatio=i.width/i.height,this.setLocation(),n.vertices.push(new THREE.Vector3(this.location.previous.x,this.location.previous.y,0),new THREE.Vector3(this.location.current.x,this.location.current.y,0)),this.setColor()}function ColorMixer(t,e,i,o,n,s,a,r){this.blendFactor=s,this.mixedVbo=[[]];var h=o[n[0]],l=o[n[1]];this.customBlend=i,this.canvasSize=t,this.palettes=[new Palette(t.width,t.height,e,h,a,r),new Palette(t.width,t.height,e,l,a,r)],this.createMixedPalette()}function Palette(t,e,i,o,n,s){customNoise.noiseDetail(10),customNoise.noiseSeed(1e4*Math.random()),this.paletteScaleFactor=i,this.palWidth=t/i,this.palHeight=e/i,this.xPeriod=1,this.yPeriod=1,this.turbPower=2,this.turbSize=170,this.marbleVbo=[[]],this.hueOffset=1e4*Math.random(),this.hueOffsetDebug=this.hueOffset,this.c=o[0]/360,this.hueRange=o[1],this.minMarbleBrightness=o[2],this.noiseStep=600/this.palWidth*.01,this.randomXoffset=1e3*Math.random(),this.randomYoffset=5e3*Math.random(),this.createMarble(),customNoise.noiseSeed(n),customNoise.noiseDetail(s)}function HSB2HSL(t,e,i){var o=(2-e)*i/2;return[t,e=o&&o<1?e*i/(o<.5?2*o:2-2*o):e,o]}function getQueryVariable(t){for(var e=window.location.search.substring(1).split("&"),i=0;i<e.length;i++){var o=e[i].split("=");if(o[0]==t)return o[1]}return null}Agent.prototype.newColorMixer=function(t){this.colorMixer=t},Agent.prototype.setLocation=function(){this.location={current:{x:Math.floor(Math.random()*(this.canvasSize.width+2*this.limits.range)-this.limits.range),y:Math.floor(Math.random()*(this.canvasSize.height+2*this.limits.range)-this.limits.range)}},this.location.previous={x:this.location.current.x,y:this.location.current.y}},Agent.prototype.constrain=function(t,e,i){return Math.round(Math.min(Math.max(t,e),i))},Agent.prototype.setColor=function(){var t=this.constrain(this.location.current.x,0,this.canvasSize.width-1),e=this.constrain(this.location.current.y,0,this.canvasSize.height-1);this.agentColor=this.colorMixer.getColor(t,e);var i=HSB2HSL(this.agentColor[0],this.agentColor[1],this.agentColor[2]),o=(new THREE.Color).setHSL(i[0],i[1],i[2]);this.geometry.colors[2*this.i]?(this.geometry.colors[2*this.i].set(o),this.geometry.colors[2*this.i+1].set(o)):this.geometry.colors.push(o,o)},Agent.prototype.resetAgent=function(){this.setLocation(),this.setColor()},Agent.prototype.map=function(t,e,i,o,n){return(t-e)/(i-e)*(n-o)+o},Agent.prototype.update=function(){var t=this.location.current.x/this.settings.noiseScale+this.settings.randomSeed,e=this.location.current.y/this.settings.noiseScale+this.settings.randomSeed,i=this.noiseZ+this.settings.randomSeed,o=customNoise.noise(t,e,i),n=(n=this.map(o,0,1,-1,1))*(this.settings.maxAngleSpan*Math.PI/180)+this.settings.randomInitialDirection;this.location.current.x+=Math.cos(n)*this.settings.speed,this.location.current.y+=Math.sin(n)*this.settings.speed,(this.location.current.x<0-this.limits.range||this.location.current.x>this.canvasSize.width+this.limits.range||this.location.current.y<0-this.limits.range||this.location.current.y>this.canvasSize.height+this.limits.range)&&this.resetAgent(),this.noiseZ+=this.settings.noiseZStep,this.geometry.vertices[2*this.i].x=this.location.previous.x-this.canvasSize.width/2,this.geometry.vertices[2*this.i].y=this.location.previous.y-this.canvasSize.height/2,this.geometry.vertices[2*this.i+1].x=this.location.current.x-this.canvasSize.width/2,this.geometry.vertices[2*this.i+1].y=this.location.current.y-this.canvasSize.height/2,this.location.previous.x=this.location.current.x,this.location.previous.y=this.location.current.y},ColorMixer.prototype.getColor=function(t,e){return this.mixedVbo[t][e]},ColorMixer.prototype.createMixedPalette=function(){for(var t,e,i,o=0;o<this.canvasSize.width;o++){this.mixedVbo[o]=[];for(var n=0;n<this.canvasSize.height;n++)t=this.palettes[0].getColor(o,n),e=this.palettes[1].getColor(o,n),i=this.mixColors(t,e),this.mixedVbo[o].push(i)}},ColorMixer.prototype.mixColors=function(t,e){if(this.customBlend)return t[1]<e[1]*this.blendFactor?e:t},Palette.prototype.getColor=function(t,e){return this.marbleVbo[Math.floor(t/this.paletteScaleFactor)][Math.floor(e/this.paletteScaleFactor)]},Palette.prototype.map=function(t,e,i,o,n){return(t-e)/(i-e)*(n-o)+o},Palette.prototype.createMarble=function(){for(var t=0;t<this.palWidth;t++){var e=this.c+this.map(customNoise.noise(this.hueOffset),0,1,-this.hueRange,this.hueRange);e<0&&(e+=1),this.marbleVbo[t]=[];for(var i=0;i<this.palHeight;i++){var o=(t+this.randomXoffset)*this.xPeriod/this.palWidth+(i+this.randomYoffset)*this.yPeriod/this.palHeight+this.turbPower*customNoise.noise(t/this.turbSize,i/this.turbSize),n=Math.abs(Math.sin(3.14159*o)),s=[e,1-n,this.map(n,0,1,this.minMarbleBrightness,1)];this.marbleVbo[t].push(s)}this.hueOffset+=this.noiseStep}},function(t){var o,c,d,e=t.swarm={};e.create=function(t,e){var i=document.getElementsByClassName(t)[0];i.innerHTML='<div class="swarm-metadata"><div class="data"><span class="swarm-time">--:--</span><span> / </span><span class="swarm-date">--.--.--</span><span> /</span><span class="live"> LIVE EmoScape<span class="super">TM</span>:</span></div><div class="emotions"><span class="emotion-box a">Surprise</span><span class="emotion-box b">Love</span><span class="emotion-box c">Anger</span></div></div>',l(),m.container=i,c={width:i.offsetWidth,height:i.offsetHeight},d=c.width>c.height?{width:600,height:600/(i.offsetWidth/i.offsetHeight)}:{width:600/(i.offsetHeight/i.offsetWidth),height:600},m.originalSize=Object.create(c),o=e,s()},e.resize=function(){c={width:m.container.offsetWidth,height:m.container.offsetHeight}},e.testNewColor=function(){m.emotions=["anger","surprise"],m.word="alarmed",m.top=["joy","disgust","anger"],a()};var u={range:50},m={debug:!1,manualColor:!1,agents:7e4,minAgents:4e4,sizeAgentRatio:.038,fadeAlpha:0,noiseDet:5,noiseSeed:1e4*Math.random(),overlayAlpha:0,blendFactor:.2,paletteScaleFactor:1,customBlend:!0,imageChoice:0,debug:!1,emotions:["joy","anger"],dominantEmotionProportion:.5,fetchPeriod:60,showOverlay:!0};m.debug="true"==getQueryVariable("debug");var g,p={noiseScale:100,randomSeed:0,agentsAlpha:20,strokeWidth:2,maxAngleSpan:220,speed:3,interAgentNoiseZRange:0,noiseZStep:.001,randomInitialDirection:0},i={anger:[19,.05,.9],joy:[55,.02,.9],calm:[0,.1,.8],disgust:[162,.1,.8],sadness:[190,.1,.8],fear:[210,.1,.8],surprise:[285,.1,.65],love:[0,.1,.8]},n={anger:"Anger",joy:"Joy",calm:"Calm",disgust:"Aversion",sadness:"Sadness",fear:"Fear",surprise:"Surprise",love:"Love"};window.debug&&(g=new Stats);var f,w,v,y,b=[],S=new THREE.Geometry,M=!1;function s(){function e(){console.error("Swarm: failed to connect to sentiment service, loading default emotions"),m.emotions=["joy","love"],m.word="joyful",m.top=["joy","love","surprise"],m.dominantEmotionProportion=.5,(M?a:r)()}var i=new XMLHttpRequest;i.addEventListener("load",function(){var t;"404"==i.status||m.manualColor?e():(t=JSON.parse(i.responseText),m.emotions=[t.dominant[0][0],t.dominant[1][0]],m.blendFactor=t.dominant[1][1]/t.dominant[0][1],m.top=t.top,m.word=t.word,m.dominantEmotionProportion=t.dominant[0][1],(M?a:r)())}),i.addEventListener("error",e),i.open("GET",o+"/sentiment/"),i.send(),setTimeout(s,1e3*m.fetchPeriod)}function x(){f=new ColorMixer(d,m.paletteScaleFactor,m.customBlend,i,m.emotions,m.blendFactor,m.noiseSeed,m.noiseDet);for(var t=0;t<b.length;t++)b[t].newColorMixer(f)}function a(){x(),function(){C();var t=document.getElementsByClassName("swarm-logo");t[t.length-1].className+=" fadeout"}()}function r(){M=!0,m.showOverlay;var t,e,i=function(){if(function(){try{return window.WebGLRenderingContext&&document.createElement("canvas").getContext("experimental-webgl")}catch(t){return}}()){var t,e=document.createElement("canvas"),i=e.getContext("webgl")||e.getContext("experimental-webgl");try{i.clearStencil(0),t=i.getError()}catch(t){return!1}return 0===t}return!1}(),o=/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream;if(!i||o)return t=m.emotions,e=document.createElement("div"),t.sort(function(t,e){return t<e?-1:e<t?1:0}),e.style.backgroundImage="url(assets/fallback-images/"+t[0]+"-"+t[1]+".jpg)",e.className="fallback-image",void m.container.appendChild(e);x(),m.agents=Math.max(m.minAgents,c.width*c.height*m.sizeAgentRatio),(w=new THREE.OrthographicCamera(d.width/-2,d.width/2,d.height/2,d.height/-2,.1,1e4)).position.set(0,0,-450),v=new THREE.Scene;for(var n=new THREE.MeshBasicMaterial({vertexColors:THREE.VertexColors,opacity:.1,transparent:!0,linewidth:1}),s=0;s<m.agents;s++)b.push(new Agent(s,p,d,u,S,f));var a,r,h,l=new THREE.LineSegments(S,n);v.add(l),!0===m.debug&&(a=new THREE.BoxGeometry(14,14,14),(r=new THREE.MeshLambertMaterial).color=new THREE.Color(255,0,0),(h=new THREE.Mesh(a,r)).position.x=d.width/-2,h.position.y=d.height/-2,h.position.z=0,v.add(h),(h=new THREE.Mesh(a,r)).position.x=d.width/2,h.position.y=d.height/-2,h.position.z=0,v.add(h),(h=new THREE.Mesh(a,r)).position.x=d.width/2,h.position.y=d.height/2,h.position.z=0,v.add(h),(h=new THREE.Mesh(a,r)).position.x=d.width/-2,h.position.y=d.height/2,h.position.z=0,v.add(h)),(y=new THREE.WebGLRenderer({preserveDrawingBuffer:!0,antialias:!0,alpha:!0})).setClearColor(16777215,0),y.setPixelRatio(window.devicePixelRatio),y.setSize(c.width,c.height),y.sortObjects=!1,y.autoClearColor=!1,w.lookAt(v.position),m.container.appendChild(y.domElement),!0===m.debug&&(window.debug&&g.showPanel(1),window.debug&&document.body.appendChild(g.dom)),E()}function E(){window.debug&&g.begin();for(var t=0;t<b.length;t++)b[t].update();window.debug&&g.end(),S.verticesNeedUpdate=!0,S.colorsNeedUpdate=!0,y.render(v,w),requestAnimationFrame(E)}function h(t){return t.toString().length<2?"0"+t:t}function l(){var t=new Date,e=t.getDate()+"."+(parseInt(t.getMonth(),10)+1)+"."+t.getFullYear().toString().substring(2);document.getElementsByClassName("swarm-date")[0].innerHTML=e;var i=h(t.getHours())+":"+h(t.getMinutes());document.getElementsByClassName("swarm-time")[0].innerHTML=i,setTimeout(l,1e3)}function C(){document.getElementsByClassName("a")[0].innerHTML='<span class="emotion-word fadein">'+n[m.top[0]]+"</span>",document.getElementsByClassName("b")[0].innerHTML='<span class="emotion-word fadein">'+n[m.top[1]]+"</span>",document.getElementsByClassName("c")[0].innerHTML='<span class="emotion-word fadein">'+n[m.top[2]]+"</span>",document.getElementsByClassName("a")[0].className="emotion-box a "+m.top[0],document.getElementsByClassName("b")[0].className="emotion-box b "+m.top[1],document.getElementsByClassName("c")[0].className="emotion-box c "+m.top[2]}t.addEventListener("resize",function(){location.reload()})}(window),function(){function y(t){return.5*(1-Math.cos(t*Math.PI))}var b,t=window.customNoise={},S=4095,M=4,x=.5;t.noise=function(t,e,i){if(e=e||0,i=i||0,null==b){b=new Array(4096);for(var o=0;o<4096;o++)b[o]=Math.random()}t<0&&(t=-t),e<0&&(e=-e),i<0&&(i=-i);for(var n,s,a=Math.floor(t),r=Math.floor(e),h=Math.floor(i),l=t-a,c=e-r,d=i-h,u=0,m=.5,g=0;g<M;g++){var p=a+(r<<4)+(h<<8),f=y(l),w=y(c),v=b[p&S];v+=f*(b[p+1&S]-v),n=b[p+16&S],v+=w*((n+=f*(b[p+16+1&S]-n))-v),n=b[(p+=256)&S],n+=f*(b[p+1&S]-n),s=b[p+16&S],n+=w*((s+=f*(b[p+16+1&S]-s))-n),u+=(v+=y(d)*(n-v))*m,m*=x,a<<=1,r<<=1,h<<=1,1<=(l*=2)&&(a++,l--),1<=(c*=2)&&(r++,c--),1<=(d*=2)&&(h++,d--)}return u},t.noiseDetail=function(t,e){0<t&&(M=t),0<e&&(x=e)},t.noiseSeed=function(t){var e,i,o,n=(o=4294967296,{setSeed:function(t){i=e=(null==t?Math.random()*o:t)>>>0},getSeed:function(){return e},rand:function(){return(i=(1664525*i+1013904223)%o)/o}});n.setSeed(t),b=new Array(4096);for(var s=0;s<4096;s++)b[s]=n.rand()}}();