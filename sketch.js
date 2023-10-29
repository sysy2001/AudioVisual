var song;
var slider;
var dropzone;
var amp;
var volhistory = [];
let particles = [];
var playING = false;

//TODO
// make drag area disappear once playing, and a go back button
// fix sync after pausing

function setup() {
  createCanvas(windowWidth, windowHeight - 200);
  dropzone = select("#dropzone");
  dropzone.dragOver(highlight);
  dropzone.dragLeave(unhighlight);
  dropzone.drop(processFile, unhighlight);
  amp = new p5.Amplitude();
  fft = new p5.FFT();
}

class Particle {
  constructor(sp) {
    this.pos = createVector(0, 0);
    this.vel = createVector(0, 0);
    this.acc = p5.Vector.random2D().normalize();
  }

  createParticle(d) {
    noStroke();
    fill("rgba(237, 125, 49, 0.5)");
    circle(this.pos.x, this.pos.y, d);
  }

  moveParticle(cond) {
    var m = map(sin(frameCount * 6), -1, 1, 0.1, 0.5);
    this.acc.mult(m);
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    if (cond) {
      for (var i = 0; i < 10; i++) {
        this.pos.add(this.vel);
      }
    }
  }
}

function processFile(file) {
  song = loadSound(file.data, loaded);
}

function highlight() {
  dropzone.style("background-color", "#ccc");
}

function unhighlight() {
  dropzone.style("background-color", "#fff");
}

function loaded() {
  playING = true;
  song.play();
  song.onended(endSong);
  button = createButton("pause");
  button.id("btn");
  button.mousePressed(togglePlaying);
}

function togglePlaying() {
  if (!song.isPlaying()) {
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
  if (playING == true) {
    playING = false;
    button.remove();
  }
}

function draw() {
  background(0);
  var vol = amp.getLevel();
  volhistory.push(vol);

  if (playING == true) {
    var diam = map(vol, 0, 0.3, 4, 20);
    fill(255, 248, 201);
    noStroke();
    circle(width / 2, height / 2, diam);

    let spectrum = fft.analyze();
    let energy = fft.getEnergy(50, 180);
    translate(width / 2, height / 2);
    noFill();
    beginShape();
    for (let i = 0; i < spectrum.length; i++) {
      var angle = map(i, 0, spectrum.length, 0, 360);
      r = random(100, 166);
      g = random(153, 246);
      b = 255;
      a = random(150, 255);
      stroke(r, g, b, a);
      var x = map(i, 0, spectrum.length, 0, windowWidth - windowWidth / 5);
      var y = map(spectrum[i], 0, 255, 0, windowHeight - windowHeight / 5);
      var r = map(spectrum[i], 0, 450, 0, 300);
      x = r * cos(angle);
      y = r * sin(angle);
      curveVertex(x, y);
    }
    endShape();

    // for (let j = 0; j < spectrum.length/1024; j++) {
    p = new Particle();
    particles.push(p);
    // }
    for (let k = 0; k < particles.length; k++) {
      particles[k].createParticle(diam);
      particles[k].moveParticle(energy > 180);
    }
  }
}
