let xOff = 0;
let yOff = 10;

function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(144);
    noStroke();
    background(0);
}

function draw() {
    //background('black');
    fill(0, 20);
    rect(0, 0, windowWidth, windowHeight);
    drawCircles();
    offset()
}

function drawCircles(){
    for (let i = 0; i < 50; i++) {
        drawCircle(noiseX(xOff+i), noiseY(yOff+i), 15, 'blue');
    }
}

function noiseX(off) {
    return noise(off) * windowWidth;
}

function noiseY(off) {
    return noise(off) * windowHeight;
}

function offset() {
    xOff += 0.01;
    yOff += 0.01;
}

function drawCircle(posX, posY, size, color) {
    fill(color);
    circle(posX, posY, size, size);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
