/**
 * @author William Reetz
 * Source Code inspired by Daniel Shiffman (https://www.youtube.com/watch?v=BjoM9oKOAKY)
 */

// ===========================================================
// SETTINGS

// Canvas
let width;
let height;

let ffColumns = 16;
let ffRows = 9;
let ffMag = 5;
let inc = 0.1;

let showFlowField = false;
let showRactangles = false;
let showFramerate = false;

let cloudesCount = 5;
let cloudesSize = 120;
let cloudesSpeed = 0.1;

let bushesCount = 10;
let bushSize = 130;

let leavesCount = 40;
let leafeSize = 35;

let kitesCount = 3;
let kitesSize = 40;
// -----------------------------------------------------------
// other globals

let zOff = 0;
let leaves = [];
let bushes = [];
let kites = [];
let clouds = [];
let flowfield = new Array(ffColumns, ffRows);
let colLen = width / ffColumns;
let rowLen = height / ffRows;
let colors;
let sunPos;

// ===========================================================
// p5.js main functions

function setup() {
    width = windowWidth;
    height = windowHeight;
    flowfield = new Array(ffColumns, ffRows);
    colLen = width / ffColumns;
    rowLen = height / ffRows;
    createCanvas(width, height);
    colorsInit();
    createLeaves();
    createBushes();
    createKites();
    createClouds();
    sunPos = random(width);
}

function draw() {
    setGradient(colors.sky0, colors.sky1);
    fill(colors.sun);
    noStroke();
    circle(sunPos, height * 0.6, height * 0.5);
    clouds.forEach(cloud => {
        cloud.draw();
        cloud.update();
        cloud.edges();
    });
    drawMontains();
    drawGround();
    kites.forEach(kite => {
        kite.update();
        kite.draw();
    });
    bushes.forEach(bush => {
        bush.draw();
    });
    drawForeground();
    createFlowfield(width, height, ffColumns, ffRows);
    leaves.forEach(leaf => {
        leaf.follow(flowfield);
        leaf.update();
        leaf.draw();
        leaf.edges();
    });
    if (showFramerate) {
        drawFPS();
    }
}

// ===========================================================
// inits and creates

function colorsInit() {
    colors = {
        wood: color(60, 36, 19),
        sun: color(255, 255, 250),
        red_leave: color(166, 31, 43),
        orange_leave: color(249, 110, 39),
        yellow_leave: color(248, 179, 22),
        green_leave: color(94, 127, 61),
        brown: color(66, 34, 18),
        ground0: color(239, 144, 69),
        ground1: color(230, 107, 49),
        ground2: color(176, 89, 40),
        sky0: color(250, 160, 56),
        sky1: color(255, 243, 184),
        cloud: color(255, 250, 192),
    }
}

function createLeaves() {
    for (let i = 0; i < leavesCount; i++) {
        leaves.push(new Leaf());
    }
}

function createBushes() {
    for (let i = 0; i < bushesCount; i++) {
        bushes.push(new Bush());
    }
}

function createKites() {
    for (let i = 0; i < kitesCount; i++) {
        kites.push(new Kite(i * 1000));
    }
}

function createClouds() {
    for (let i = 0; i < cloudesCount; i++) {
        clouds.push(new Cloud(i));
    }
}

function createFlowfield(width, height, colums, rows) {
    let yOff = 0;
    for (let y = 0; y < rows; y++) {
        let xOff = inc;
        for (let x = 0; x < colums; x++) {
            let index = x + y * colums;
            let t = noise(xOff, yOff, zOff);
            let angle = t * TWO_PI;
            let v = p5.Vector.fromAngle(angle);
            v.setMag(ffMag);
            flowfield[index] = v;
            xOff += inc;
            if (showRactangles) {
                drawRectangle(x * colLen, y * rowLen, colLen, rowLen, t * 255);
            }
            if (showFlowField) {
                drawAngle(x * colLen + colLen / 2, y * rowLen + y + rowLen / 2, colLen / 2, v.heading());
            }
        }
        yOff += inc;
        zOff += 0.00035;
    }
}
// -----------------------------------------------------------
// Drawables

function drawAngle(x, y, len, angle) {
    stroke(255, 75);
    strokeWeight(4);
    push();
    translate(x, y);
    rotate(angle);
    line(0, 0, len, 0);
    pop();
}

function drawRectangle(x, y, width, height, color) {
    stroke(0, 255);
    strokeWeight(0);
    fill(color, color, 0, 100);
    rect(x, y, width, height);
}

function drawMontains() {
    let offY = 0;
    noStroke();
    strokeWeight(5);
    fill(colors.ground0);
    beginShape();
    curveVertex(0, height);
    for (let x = -50; x <= width + 100; x += 100) {
        vertex(x, noise(offY) * 0.5 * height / 2 + height * 0.5);
        offY++;
    }
    curveVertex(width, height);
    endShape(CLOSE);
}

function drawGround() {
    let offY = 1000;
    noStroke();
    strokeWeight(5);
    fill(colors.ground1);
    beginShape();
    curveVertex(0, height);
    for (let x = -50; x <= width + 100; x += 100) {
        vertex(x, noise(offY) * 0.1 * height / 2 + height * 0.8);
        offY++;
    }
    curveVertex(width, height);
    endShape(CLOSE);
}

function drawForeground() {
    let offY = -1000;
    noStroke();
    strokeWeight(5);
    fill(colors.ground2);
    beginShape();
    curveVertex(0, height);
    for (let x = -50; x <= width + 100; x += 100) {
        vertex(x, noise(offY) * 0.1 * height / 2 + height * 0.85);
        offY++;
    }
    curveVertex(width, height);
    endShape(CLOSE);
}

function drawFPS() {
    textSize(15);
    fill(0)
    text('FPS: ' + floor(frameRate()), 10, 20);
}

// -----------------------------------------------------------
// Classes

function Leaf() {
    this.acc = createVector(0, 0);
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(0, 0);
    this.maxSpeed = 2 * random() + 2;
    this.rand = random();
    this.leaveColor = randomLeaveColor();
    this.size = leafeSize * (random() * 0.25 + 0.75);

    this.update = () => {
        this.vel.add(this.acc);
        this.vel.limit(this.maxSpeed);
        this.pos.add(this.vel);
        this.acc.mult(0);
    }

    this.applyForce = (force) => {
        this.acc.add(force);
    }

    this.follow = (vectors) => {
        let x = floor(this.pos.x / colLen);
        let y = floor(this.pos.y / rowLen);
        let index = x + y * ffColumns;
        let force = vectors[index];
        this.applyForce(force);
    }

    this.draw = () => {
        let lcolor = this.leaveColor;
        push();
        translate(this.pos.x, this.pos.y);
        rotate(radians(p5.Vector.dot(this.vel, createVector(0, 10)) + this.rand * 360));
        noStroke();
        fill(lcolor);
        ellipse(0, 0, this.size / 2, this.size);
        stroke(lcolor);
        strokeWeight(2);
        line(0, 0, 00, this.size * 0.6);
        pop();
    }

    this.edges = () => {
        let tollerance = 50;
        if (this.pos.x > width + tollerance) this.pos.x = -tollerance;
        if (this.pos.x < -tollerance) this.pos.x = width + tollerance;
        if (this.pos.y > height + tollerance) this.pos.y = -tollerance;
        if (this.pos.y < -tollerance) this.pos.y = height + tollerance;
    }
}

function Bush() {
    this.color = randomLeaveColor();
    this.pos = random();
    this.size = bushSize * (random() * 0.5 + 0.5);

    this.draw = () => {
        stroke(this.color);
        strokeWeight(this.size);
        line(width * this.pos, height * 0.85, width * this.pos + this.size, height * 0.85);
        line(width * this.pos + this.size / 2, height * 0.8, width * this.pos + this.size / 2, height);
    }
}

function Kite(kOff) {
    this.off = kOff;
    this.x = noise(this.off) * width * 0.5;
    this.y = noise(this.off + 1000) * height * 0.25;
    this.scl = kitesSize * (random() * 0.5 + 0.5);
    this.color = randomLeaveColor();
    this.rotation = random() * 0.25 + 0.2;

    this.update = () => {
        this.x = noise(this.off) * width / 2;
        this.y = noise(this.off + 1000) * height / 4;
        this.off += 0.003;
    }

    this.draw = () => {
        push();
        translate(this.x, this.y);
        rotate(this.rotation);
        fill(this.color);
        beginShape(TRIANGLE_FAN);
        vertex(1 * this.scl, 0 * this.scl);
        vertex(0 * this.scl, 1 * this.scl);
        vertex(1 * this.scl, 3 * this.scl);
        vertex(2 * this.scl, 1 * this.scl);
        vertex(1 * this.scl, 0 * this.scl);
        endShape();
        stroke(0, 50);
        strokeWeight(2);
        line(0 * this.scl, 1 * this.scl, 2 * this.scl, 1 * this.scl);
        line(1 * this.scl, 0 * this.scl, 1 * this.scl, 3 * this.scl);
        stroke(0, 75);
        strokeWeight(0.5);
        noFill();
        curve(1 * this.scl, 1 * this.scl, height, width / 2, 1 * this.scl, 1 * this.scl, this.x, this.y);
        pop();
    }
}

function Cloud(index) {
    this.scl = cloudesSize * (random() * 0.5 + 0.5);
    this.x = random() * width + this.scl;
    this.y = random() * height / 2;
    this.draw = () => {
        stroke(colors.cloud);
        strokeWeight(this.scl / 2);
        push();
        translate(this.x, this.y);
        line(0 * this.scl, 1 * this.scl, 1 * this.scl, 1 * this.scl);
        line(0.2 * this.scl, 0.6 * this.scl, 0.8 * this.scl, 0.6 * this.scl);
        pop();
    }
    this.update = () => {
        this.x -= cloudesSpeed;
    }
    this.edges = () => {
        let tollerance = this.scl * 1.2;
        if (this.x > width + tollerance) this.x = -tollerance;
        if (this.x < -tollerance) this.x = width + tollerance;
    }
}

// -----------------------------------------------------------
// helper

function setGradient(c1, c2) {
    // function from https://editor.p5js.org/REAS/sketches/S1TNUPzim
    noFill();
    for (var y = 0; y < height; y++) {
        var inter = map(y, 0, height, 0, 1);
        var c = lerpColor(c1, c2, inter);
        stroke(c);
        line(0, y, width, y);
    }
}

function randomLeaveColor() {
    let colorlist = [colors.red_leave, colors.orange_leave, colors.yellow_leave, colors.green_leave];
    return colorlist[floor(random() * colorlist.length)];
}