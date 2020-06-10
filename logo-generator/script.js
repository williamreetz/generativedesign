/**
 * @author William Reetz
 * Logo-Project Generative Design
 * Original Beuth Logo by Meta-Design
 * 
 */

// ===========================================================
// Globals

let grid;
let logos = [];
let singleLogo;
let animation;
let noiseCounter = 0;
let darkmodeIsActive = false;
let mode = 0; // 0=animation, 1=grid, 2=generator;
let gridSize = 300;
let gridareaIsVisible = false;
let logoChangeSpeed = 0.01;

let colors = {
    teal100: 'rgb(0,152,161)',
    teal70: 'rgb(57,183,188)',
    teal30: 'rgb(190,226,226)',
    teal10: 'rgb(235,246,246)',
    red: 'rgb(239,24,30)',
    white: 'rgb(255,255,255)'
}

// ===========================================================
// P5.js functions

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(255);
    grid = new Grid(gridSize);
    grid.draw();
    animation = new Animation();
    singleLogo = new SingleLogo(50, 50);
    initLogos();
    logos.forEach(logo => {
        logo.draw();
    });
}

function draw() {
    // darkmode on off
    if (darkmodeIsActive) {
        background(30);
    } else {
        background(255);
    }
    // mode: 0,1,2
    if (mode === 0) {
        animation.draw();
    }
    else if (mode === 1) {
        if (gridareaIsVisible) {
            grid.draw();
        }
        logos.forEach(logo => {
            logo.draw();
        });
    }
    else if (mode === 2) {
        singleLogo.draw();
        if (parseInt(noiseCounter) % 4 === 0) {
            singleLogo.noise(noiseCounter);
            singleLogo.randomName();
        } else {
            // pause
        }
        // update noiseCounter
        noiseCounter += logoChangeSpeed;
    } else {
        animation.draw();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    grid = new Grid(gridSize);
    initLogos();
}

// ===========================================================
// Initalisators

function initLogos() {
    logos = [];
    for (let x = 0; x < grid.hParts; x++) {
        for (let y = 0; y < grid.vParts; y++) {
            logos.push(new Logo(x * grid.pWidth, y * grid.pHeight));
        }
    }
}

// ===========================================================
// CLasses

function Logo(x, y) {
    this.x = x + grid.pWidth / 2;
    this.y = y + grid.pHeight / 2;
    this.size = gridSize * 0.7;
    this.aHalf = this.size / 2;
    this.aFifth = this.size / 5;

    this.draw = () => {
        this.drawPolygon();
        this.drawCurve();
        this.drawRuler();
    }

    this.updateSize = (size) => {
        this.size = size * 0.7;
        this.aHalf = this.size / 2;
        this.aFifth = this.size / 5;
    }

    // draw curve
    this.randomRotation1 = TWO_PI * random();
    this.randomAmplitude = random(1, 1.5);
    this.randomPeriod = random(1, 2);
    this.randomWeight = random(2, 3);
    this.drawCurve = () => {
        push();
        stroke(colors.teal70);
        strokeWeight(this.aFifth / this.randomWeight);
        noFill();
        translate(this.x, this.y);
        rotate(this.randomRotation1);
        translate(0, -this.aFifth);
        beginShape();
        for (let i = -this.aHalf; i < this.aHalf + this.aFifth; i += this.aFifth / this.randomPeriod) {
            let sx = sin(i) * (this.aFifth * this.randomAmplitude);
            let sy = i;
            curveVertex(sy, sx);
        }
        endShape();
        pop();
    }

    // draw ruler
    this.randomRotation2 = TWO_PI * random();
    this.randomParts = floor(random(5, 15));
    this.randomSize = random(1.5, 3);
    this.drawRuler = () => {
        push();
        noStroke();
        translate(this.x, this.y);
        rotate(this.randomRotation2);
        translate(0, this.aFifth);
        rectMode(RADIUS);
        fill(colors.teal100);
        rect(0, 0, this.aHalf, this.aFifth / this.randomSize, 5);
        fill(colors.white);
        let parts = this.randomParts;
        let dist = this.size / parts;
        let start = -this.aHalf + (this.size / parts);
        let end = this.aHalf - dist / 2;
        for (let i = start; i < end; i += dist) {
            rect(i, 0, this.aHalf / 49, this.aHalf / 20, 2);
        }
        pop();
    }

    // draw polygon
    this.randomRotation3 = TWO_PI * random();
    this.randomN = floor(random(3, 6));
    this.drawPolygon = () => {
        push();
        let n = this.randomN;
        let radius = this.aHalf;
        noStroke();
        fill(colors.teal30);
        translate(this.x, this.y);
        rotate(this.randomRotation3);
        let angle = TWO_PI / n;
        beginShape();
        for (let a = 0; a < TWO_PI; a += angle) {
            let sx = 0 + cos(a) * radius;
            let sy = 0 + sin(a) * radius;
            vertex(sx, sy);
        }
        endShape(CLOSE);
        pop();
    }

    this.noise = (counter) => {
        this.randomRotation1 = TWO_PI * noise(counter);
        this.randomAmplitude = between(noise(counter + 1000), 1, 1.5);
        this.randomPeriod = between(noise(counter + 2000), 1, 2);
        this.randomWeight = between(noise(counter + 3000), 2, 3);
        this.randomRotation2 = TWO_PI * noise(counter + 4000);
        this.randomParts = floor(between(noise(counter + 5000), 5, 15));
        this.randomSize = between(noise(counter + 6000), 1.5, 3);
        this.randomRotation3 = TWO_PI * noise(counter + 7000);
        this.randomN = floor(between(noise(counter + 8000), 3, 6));
    }
}

function SingleLogo() {
    this.logo = new Logo(0, 0);
    this.logo.x = windowWidth / 2;
    this.logo.y = windowHeight / 2;
    this.showText = true;
    this.logo.updateSize(500);
    this.uniName = 'Beuth Hochschule für Technik Berlin';
    this.draw = () => {
        this.updatePosition();
        if (darkmodeIsActive) {
            fill(255);
        } else {
            fill(0);
        }
        textSize(this.logo.size / 8);
        textAlign(LEFT, CENTER);
        if (this.showText) {
            text(this.uniName, this.logo.x + this.logo.size * 0.75, this.logo.y - this.logo.size / 2, this.logo.size, this.logo.size);
        } else {
            text('', this.logo.x + this.logo.size * 0.75, this.logo.y - this.logo.size / 2, this.logo.size, this.logo.size);
        }
        this.logo.draw();
    }
    this.updatePosition = () => {
        this.logo.x = windowWidth / 2 - this.logo.size / 2;
        this.logo.y = windowHeight / 2;
    }
    // Aus gegebenen Anlass:
    this.randomName = () => {
        let adjNames = ['Technische ', 'Praktische ', 'Wissenschaftliche ', ''];
        let unitypeNames = ['Hochschule ', 'Fachhochschule ', 'Ingenieurshochschule ', 'Ingenieursschule '];
        let locationNames = ['Berlin', 'Wedding', 'Mitte'];
        let newname = randomOf(adjNames) + randomOf(unitypeNames) + randomOf(locationNames);
        this.uniName = newname;
    }
    this.randomName();
    this.resize = (size) => {
        this.logo.updateSize(size);
    }
    this.noise = (counter) => {
        this.logo.noise(counter);
    }
}

function Grid(size) {
    this.init = () => {
        this.hParts = floor(windowWidth / size);
        this.pWidth = windowWidth / this.hParts;
        this.vParts = floor(windowHeight / size);
        this.pHeight = windowHeight / this.vParts;
        this.arrLength = this.hParts * this.vParts;
        this.arr = [];
    }
    this.resize = () => {
        this.init();
    }

    this.draw = () => {
        noFill();
        stroke(0);
        strokeWeight(1);
        for (let x = 0; x < this.hParts; x++) {
            for (let y = 0; y < this.vParts; y++) {
                this.drawArea(x, y);
                //rect(x * this.pWidth, y * this.pHeight, this.pWidth, this.pHeight);
            }
        }
    }

    this.drawArea = (x, y) => {
        noStroke();
        fill(colors.teal10);
        rect(x * this.pWidth + 5, y * this.pHeight + 5, this.pWidth - 10, this.pHeight - 10, 10);
    }

    this.init();
}

function Animation() {
    this.size = 300;
    this.part = this.size / 10;
    this.counter = 0;
    this.speed = 10;
    this.period = 0.5;
    this.amplitude = 1;

    this.resize = (size) => {
        this.size = size;
        this.part = this.size / 10;
    }

    this.draw = () => {
        push();
        translate(windowWidth / 2 - this.size / 2, windowHeight / 2 - this.size / 2 - this.part);
        noStroke();
        fill(colors.teal30);
        rect(0, 0, this.size, this.size, this.part);
        stroke(colors.teal70);
        strokeWeight(this.part * 1.5);
        beginShape();
        noFill();
        for (let x = -this.part; x <= this.size + this.part; x++) {
            curveVertex(x, sin((x + frameCount * this.speed) / this.part * this.period) * this.part * this.amplitude + this.size / 3);
        }
        endShape();
        fill(colors.teal100);
        noStroke();
        rect(-this.part, this.part * 6, this.size + this.part * 2, this.size / 4, this.part);
        stroke(colors.white);
        strokeWeight(this.part / 5);
        for (let x = 0; x <= this.size - this.part; x += this.part) {
            line(x + this.counter, this.size * 0.75, x + this.counter, this.size * 0.70);
        }
        this.counter -= this.speed;
        if (this.counter < 0) this.counter = this.part;
        noStroke();
        textSize(this.part);
        fill(colors.teal100);
        textAlign(CENTER, TOP);
        textStyle(BOLD);
        text('BEUTH HOCHSCHULE', -this.part, this.size * 1.1, this.size + this.part * 2, this.size);
        pop();
    }
}

// ===========================================================
// Helper

function randomOf(arr) {
    return arr[floor(random() * arr.length)];
}

function between(p, min, max) {
    return max * p - min * p + min;
}