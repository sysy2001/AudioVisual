var song;
var slider;
var dropzone;
var amp;
var volhistory = [];
let particles = [];
var playING = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  dropzone = select("#dropzone");
  dropzone.dragOver(highlight);
  dropzone.dragLeave(unhighlight);
  dropzone.drop(processFile, unhighlight);
  button = createButton("play");
  button.id("btn");
  amp = new p5.Amplitude();
  fft = new p5.FFT();
}

class Particle {
  constructor(sp) {
    this.pos = createVector(0, 0);
    this.vel = createVector(0, 0);
    this.acc = p5.Vector.random2D().normalize().mult(0.1);
  }

  createParticle() {
    noStroke();
    fill("rgba(255, 128, 128,0.5)");
    circle(this.pos.x, this.pos.y, 10);
  }

  moveParticle() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
  }
}

function processFile(file, inProgress) {
  song = loadSound(file.data, loaded);
}

function highlight() {
  dropzone.style("background-color", "#ccc");
}

function unhighlight() {
  dropzone.style("background-color", "#fff");
}

function loaded() {
  button.mousePressed(togglePlaying);
}

function togglePlaying() {
  if (!song.isPlaying()) {
    song.onended(endSong);
    song.play();
    playING = true;
    song.setVolume(0.3);
    button.html("pause");
  } else {
    song.pause();
    playING = false;
    button.html("play");
  }
}

function endSong() {
  playING = false;
  button.html("play");
}

function draw() {
  background(255);
  var vol = amp.getLevel();
  volhistory.push(vol);

  if (playING == true) {
    var diam = map(vol, 0, 0.3, 10, 400);
    fill(255, 248, 201);
    noStroke();
    // circle(width / 2, height / 2, diam);

    let spectrum = fft.analyze();
    translate(width / 2, height / 2);
    noFill();
    beginShape();
    for (let i = 0; i < spectrum.length; i++) {
      var angle = map(i, 0, spectrum.length, 0, 360);
      var ampl = spectrum[i];
      r = random(100, 166); 
      g = random(153, 246); 
      b = 255; 
      a = random(150, 255); 
      // stroke(223, 204, 251);
      stroke(r, g, b, a);
      var x = map(i, 0, spectrum.length, 0, width);
      var y = map(spectrum[i], -1, 1, 0, height);
      var r = map(ampl, 0, 100, 0, 250);
      x = r * cos(angle);
      y = r * sin(angle);
      // particles.push(new Particle(ampl));
      vertex(x, y);
    }
    endShape();

    // for (let i = 0; i < 2; i++) {
    //   particles.push(new Particle());
    // }
    // for (let i = 0; i < particles.length; i++) {
    //   particles[i].createParticle();
    //   particles[i].moveParticle();
    // }
  }
}
