var song;
var slider;
var dropzone;
var amp;
var volhistory = [];

//TODO change button to play once ended

function setup() {
  createCanvas(500,500);
  dropzone = select('#dropzone');
  dropzone.dragOver(highlight);
  dropzone.dragLeave(unhighlight);
  dropzone.drop(processFile, unhighlight);
  amp = new p5.Amplitude();
}

function processFile(file) {
  song = loadSound(file.data, loaded);
  
}

function highlight() {
  dropzone.style('background-color', "#ccc");
}

function unhighlight() {
  dropzone.style('background-color', "#fff");
}


function loaded() {
  button = createButton("play");
  button.id("btn");
  button.mousePressed(togglePlaying);
}

function togglePlaying() {
  if (!song.isPlaying()) {
    song.onended(endSong);
    song.play();
    song.setVolume(0.3);
    button.html("pause");
  }
    else {
    song.pause();
    button.html("play");
  }
  
}

function endSong() {
    button.html("play");
}


function draw() {
  background(255);
  var vol = amp.getLevel();
  volhistory.push(vol);
  stroke(0, 0, 255);
  noFill();
  beginShape();
  for (var i = 0; i < volhistory.length; i++) {
    var y = map(volhistory[i], 0, 1, height, 0);
    vertex(i, y);
  }
  endShape();
  
  if (volhistory.length > width) {
    volhistory.splice(0,1);
  }
  
  var diam = map(vol, 0, 0.3, 10, 200);
  fill(255,0,255);
  ellipse(width/2, height/2, diam, diam);
  
}