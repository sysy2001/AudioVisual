var song;
var slider;
var dropzone;
var amp;
var volhistory = [];
let particles = [];
var playING = false;
let particleColors = [
  "#FFFB73",
  "#F88379",
  "#ff8100",
  "#ff9c38",
  "#ffbe6d",
  "#FFF8C9",
  "#fcc6c2",
];

let curveColors = [
  "#2C43B0",
  "#3364C0",
  "#427BD2",
  "#4C9ADD",
  "#C4B0FF",
  "#DFCCFB",
  "#BEADFA",
  "#64B6EE",
  "#7AD7F0",
  "#92DFF3",
  "#B7E9F7",
];

let bgColors = ["#d9d7f1", "#fffdde", "#e7fbbe", "#ffcbcb"];

//TODO
// make drag area disappear once playing, and a go back button?

function setup() {
  createCanvas(windowWidth, windowHeight - 150);
  color1 = color(217, 215, 241);
  color2 = color(255, 253, 222);
  color3 = color(231, 251, 190);
  color4 = color(255, 203, 203);

  dropzone = select("#dropzone");
  dropzone.dragOver(highlight);
  dropzone.dragLeave(unhighlight);
  dropzone.drop(processFile, unhighlight);
  amp = new p5.Amplitude();
  fft = new p5.FFT();
}

function resetSketch() {
  dropzone = select("#dropzone");
  dropzone.dragOver(highlight);
  dropzone.dragLeave(unhighlight);
  dropzone.drop(processFile, unhighlight);
  amp = new p5.Amplitude();
  fft = new p5.FFT();
}

class Particle {
  constructor(sp) {
    this.pos = createVector(0, 0); //point
    this.vel = createVector(0, 0);
    this.acc = p5.Vector.random2D().normalize();
    //fill("rgba(237, 125, 49, 0.5)");
    var pNum = Math.round(random(particleColors.length - 1));
    this.color = particleColors[pNum];
  }

  createParticle(d) {
    noStroke();
    var chosenColor = color(this.color);
    var a = 200;
    fill(red(chosenColor), green(chosenColor), blue(chosenColor), a);
    if (this.pos.mag() > 15) {
      circle(this.pos.x, this.pos.y, d);
    }
  }

  moveParticle(cond) {
    var songTime = song.currentTime();
    var m = map(sin(songTime * 6), -1, 1, 0.2, 0.7);
    this.acc.mult(m);
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    if (cond) {
      for (var i = 0; i < 5; i++) {
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
  dropzone.style("background-color", "transparent");
}

function loaded() {
  playING = true;
  dropzone.remove();
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
    // clear();
    // var buttonReset = createButton("reset");
    // buttonReset.mousePressed(resetSketch);
  }
}

function createtheme() {
  // randomSeed(2)

  for (let i = 0; i < windowWidth; i++) {
    strokeWeight(0.15);
    let randomNum = Math.round(random(bgColors.length - 1));

    if (randomNum < 1) {
      stroke(color1);
    } else if (randomNum < 2) {
      stroke(color3);
    } else if (randomNum < 3) {
      stroke(color4);
    } else {
      stroke(color2);
    }

    line(random(40) - 20 + i, 0, random(40) - 20 + i, windowHeight);
    line(random(40) - 20 + i, 1, random(40) - 20 + i, windowHeight - 1);
    line(0, random(40) - 20 + i, windowWidth, random(40) - 20 + i);
    line(1, random(40) - 20 + i, windowWidth - 1, random(40) - 20 + i);
  }
}

function draw() {
  if (playING == true) {
    background(0);

    var vol = amp.getLevel();
    volhistory.push(vol);
    var r, g, b, a;

    let spectrum = fft.analyze();
    let energy = fft.getEnergy(50, 180);

    var diam = map(vol, 0, 0.3, 4, 10);
    translate(width / 2, height / 2);

    p = new Particle();
    particles.push(p);
    for (let k = 0; k < particles.length; k++) {
      particles[k].createParticle(diam);
      particles[k].moveParticle(energy > 180);
    }

    noFill();
    beginShape();
    for (let i = 0; i < spectrum.length; i++) {
      var angle = map(i, 0, spectrum.length, 0, 360);

      var x = map(i, 0, spectrum.length, 0, windowWidth - windowWidth / 5);
      var y = map(spectrum[i], 0, 255, 0, windowHeight - windowHeight / 5);
      var rad = map(spectrum[i], 0, 450, 0, 400);
      x = rad * cos(angle);
      y = rad * sin(angle);

      var vertexNum = Math.round(random(curveColors.length - 1));
      var chosenColor = color(curveColors[vertexNum]);
      // var chosenColor = color(this.color);
      stroke(
        red(chosenColor),
        green(chosenColor),
        blue(chosenColor),
        230 + random(-30, 25)
      );

      strokeWeight(1.4);
      curveVertex(x, y);
    }
    endShape();
  }
}
