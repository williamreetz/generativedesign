/**
 * @author William Reetz
 * Source Code inspired by Daniel Shiffman (https://www.youtube.com/watch?v=4hA7G3gup-4)
 * batman logo by: https://logos-download.com/wp-content/uploads/2018/03/Batman_logo_bat.png
 * 
 * CONTROLS
 * Mousemove: Move 
 * Mouseclick: Switch Mode(Batman or Joker)
 * 
 */

// ===========================================================
// Globals

let textA = 'Batman';
let textB = 'Joker';
let sizeTextAB = 200;
let mode = 1; // 1:Joker, -1:Batman
let shuffleParticles = true;

let width;
let height;
let font;
let pointsA = [];
let pointsB = [];
let particles = [];
let boundsB;
let boundsA;
let weapon;
let batmanImg;


// ===========================================================
// p5.js functions

function preload() {
    font = loadFont('assets/Staatliches-Regular.ttf');
    batmanImg = loadImage('assets/batman.png');
}

function windowResized() {
    width = windowWidth;
    height = windowHeight;
    resizeCanvas(windowWidth, windowHeight);
}

function setup() {
    width = windowWidth;
    height = windowHeight;
    createCanvas(width, height);
    background(0);

    boundsA = font.textBounds(textA, 0, 0, sizeTextAB);
    boundsB = font.textBounds(textB, 0, 0, sizeTextAB);

    let centerA = centerIt(boundsA);
    let centerB = centerIt(boundsB);
    pointsA = font.textToPoints(textA, centerA.x, centerA.y, sizeTextAB, {
        sampleFactor: 0.1,
        simplifyThreshold: 0
    });
    pointsB = font.textToPoints(textB, centerB.x, centerB.y, sizeTextAB, {
        sampleFactor: 0.1243,
        simplifyThreshold: 0
    });

    // console.log(pointsA.length);
    // console.log(pointsB.length);

    if (shuffleParticles) {
        pointsA = shuffle(pointsA);
        pointsB = shuffle(pointsB);
    }

    for (let i = 0; i < pointsA.length; i++) {
        let ptA = pointsA[i];
        let ptB = pointsB[i];
        particles.push(new Particle(ptA.x, ptA.y, ptB.x, ptB.y));
    }

    weapon = new Weapon(0, 0);
}

function draw() {
    if (mode == 1) {
        background(0, 10);
    } else {
        background(0, 100);
    }
    particles.forEach(vehicle => {
        vehicle.behaviour();
        vehicle.update();
        vehicle.draw();
    });
    weapon.update();
    weapon.draw();
}

function mouseClicked() {
    mode *= -1;
}

// ===========================================================
// classes

function Particle(x, y, x2, y2) {
    this.pos = createVector(x, y);
    this.origin = createVector(x, y);
    this.start = createVector(x, y);
    this.target = createVector(x2, y2);
    this.vel = p5.Vector.random2D();
    this.acc = createVector();
    this.rad = 4 + random(2);
    this.maxspeed = 5;
    this.maxforce = 2;
    this.color = color(255, 0, 0);

    this.update = () => {
        this.pos.add(this.vel);
        this.vel.add(this.acc);
        this.acc.mult(0);
    }

    this.applyForce = (f) => {
        this.acc.add(f);
    }

    this.behaviour = () => {
        let force = this.arrive(this.origin);
        this.applyForce(force);

        let mouse = createVector(mouseX, mouseY);
        let flee = this.flee(mouse);
        this.applyForce(flee);
    }

    this.arrive = (target) => {
        let desired = p5.Vector.sub(target, this.pos);
        let dist = desired.mag();
        let speed = this.maxspeed;
        if (dist < 100) {
            speed = map(dist, 0, 100, 0, this.maxspeed);
        }
        desired.setMag(speed);
        let steer = p5.Vector.sub(desired, this.vel);
        steer.limit(this.maxforce);
        return steer
    }

    this.flee = (target) => {
        let desired = p5.Vector.sub(target, this.pos);
        let dm = desired.mag();
        if (dm < 40) {
            desired.setMag(this.maxspeed);
            desired.mult(-1);
            let steer = p5.Vector.sub(desired, this.vel);
            steer.limit(this.maxforce);
            if (mode == 1) {
                this.origin = this.target;
            } else {
                this.origin = this.start;
            }
            return steer;
        } else {
            return createVector(0, 0)
        }
    }

    this.draw = () => {
        stroke(this.color);
        strokeWeight(this.rad);
        point(this.pos.x, this.pos.y);
    }
}

function Weapon(x, y) {
    this.pos = createVector(x, y);
    this.size = 100;
    this.width = this.size * 0.7;
    this.height = this.size;

    this.update = () => {
        this.pos = createVector(mouseX - this.width / 2, mouseY - this.height / 2);
    }

    this.draw = () => {
        push();
        translate(this.pos.x, this.pos.y);
        if (mode == 1) {
            noStroke();
            fill(255, 255, 255);
            rect(0, 0, this.width, this.height, this.size * 0.05);
            fill(255, 0, 0);
            textSize(this.size * 0.4);
            textStyle(BOLD);
            textAlign(CENTER, CENTER);
            text('J', this.size * 0.05, 0, this.width, this.height);

            textSize(this.size * 0.15);
            textStyle(NORMAL);
            textAlign(RIGHT, TOP);
            text('J', 0, this.size * 0.05, this.width, this.height);

            textSize(this.size * 0.15);
            textStyle(NORMAL);
            textAlign(LEFT, BOTTOM);
            text('J', this.size * 0.05, 0, this.width, this.height);
        } else {
            image(batmanImg, 0, 0, this.size, this.size * 0.7);
        }
        pop();
    }
}


// ===========================================================
// utils

function centerIt(txtbounds) {
    return { x: width * 0.5 - txtbounds.w * 0.5, y: height * 0.5 - txtbounds.h * 0.5 }
}