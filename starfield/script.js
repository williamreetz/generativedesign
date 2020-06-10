const stars = [];
const starCount = 1000;
let starSpeed = 10;
const starSize = 10;
const starfieldX = 1;
const starfieldY = 1;
// let fps = 60;
// let capturer = new CCapture({ format: 'png', framerate: fps });
// let div;

function setup() {
    colorMode(HSB);
    // windowWidth = 1080;
    // windowHeight = 1080;
    createCanvas(windowWidth, windowHeight);
    // div = createDiv('').size(100, 100);
    initStars();
    background(0);
    // frameRate(fps);
    // capturer.start();
}

function draw() {
    let msw = map(mouseX, 0, windowWidth, 1, 0);
    let msh = map(mouseY, 0, windowWidth, 1, 0);
    background(255, 255, 5, 0.9);
    drawMouse();
    translate(windowWidth * msw, windowHeight * msh);
    stars.forEach(star => {
        star.update();
        star.draw();
    });
    //     if (keyCode === ENTER) {
    //         noLoop();
    //         capturer.stop();
    //         capturer.save();
    //     }
    //     capturer.capture(document.getElementById('defaultCanvas0'));
    //     div.html(frameCount);
    control();
}

function drawMouse() {
    stroke(100, 255, 255, 1);
    strokeWeight(5);
    point(mouseX, mouseY);
    strokeWeight(1);
    const len = 10;
    line(mouseX + len, mouseY, mouseX - len, mouseY);
    line(mouseX, mouseY + len, mouseX, mouseY - len);
}

function control() {
    if (keyIsPressed) {
        if (keyCode === UP_ARROW) {
            starSpeed += 0.1;
        } else if (keyCode === DOWN_ARROW) {
            starSpeed -= 0.1;
        }
        if (starSpeed < 0) starSpeed = 0;
    }
}

function initStars() {
    for (let i = 0; i < starCount; i++) {
        stars.push(new Star());
    }
}

function Star() {
    this.x = random(-windowWidth, windowWidth);
    this.y = random(-windowHeight, windowHeight);
    this.z = random(windowWidth);
    this.pz = this.z;
    this.hue = random(0, 255);
    this.sat = random(0, 50);
    this.opac = random(0.75, 1);

    this.draw = () => {
        stroke(this.hue, this.sat, 255, this.opac);
        // fill(this.hue, this.sat, 255, this.opac);
        // noStroke();
        const r = map(this.z, 0, windowWidth, starSize, 0);
        const sx = map(this.x / this.z, 0, 1, 0, windowWidth / starfieldX);
        const sy = map(this.y / this.z, 0, 1, 0, windowHeight / starfieldY);
        strokeWeight(r);
        point(sx, sy);
        let size = r;
        // beginShape();
        // vertex(sx, sy);
        // bezierVertex(sx - size / 2, sy - size / 2, sx - size, sy + size / 3, sx, sy + size);
        // bezierVertex(sx + size, sy + size / 3, sx + size / 2, sy - size / 2, sx, sy);
        // endShape(CLOSE);
        // const px = map(this.x / this.pz, 0, 1.05, 0, windowWidth / starfieldX);
        // const py = map(this.y / this.pz, 0, 1.05, 0, windowHeight / starfieldY);
        // strokeWeight(r / 10);
        // line(px, py, sx, sy);
    }

    this.update = () => {
        this.pz = this.z;
        this.z -= starSpeed;
        if (this.z <= 0) {
            this.x = random(-windowWidth, windowWidth);
            this.y = random(-windowHeight, windowHeight);
            this.z = windowWidth;
        }
    }

    this.rezise = () => {
        this.z = random(windowWidth);
    }

}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    stars.forEach(star => {
        star.rezise();
    });
}
