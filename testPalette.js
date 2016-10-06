function setup() {
 createCanvas(800,800)
 tempColorData =  [19, 0.05, 0.9]; // ORANGE

 pal = new Palette(800,800, tempColorData)
}

function draw() {
  background(255,0,0)
  ellipse(50, 50, 80, 80)
  image(pal.huesVbo,0,0)
  // pal.huesVbo.loadPixels();
  // console.log(pal.huesVbo.pixels[50,50])
  // console.log(pal.minMarbleBrightness)
}
