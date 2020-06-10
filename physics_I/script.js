/**
 * @author William Reetz
 * Source Code inspired by Daniel Shiffman (https://www.youtube.com/watch?v=urR596FsU68)
 * 
 */

// ===========================================================
// globals

const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;

const width = 1920;
const height = 1080;

let engine;
let world;

let bodies = [];
let stages = [];
let pushers = [];
let propeller = [];

// ===========================================================
// p5.js functions

function setup() {
    createCanvas(width, height);
    background(0);
    colorMode(HSB);

    engine = Engine.create();
    world = engine.world;
    world.gravity.y = 2;

    Engine.run(engine);

    createBasket(450, 380);
    createWalls();
    createStages();
    createPusher();
    createBalls();
    initMouse();
}

function draw() {
    background(10);
    strokeWeight(2);
    bodies.forEach(body => {
        body.draw();
    });
    let off = 0;
    stages.forEach(stage => {
        stage.draw();
        off -= 0.50;
        stage.setPosY(sin(frameCount * PI / 50 + off) * 100 + height);
    });
    pushers.forEach(pusher => {
        pusher.setPosY(sin(frameCount / 25) * height + height * 1.5);
        pusher.draw();
    })
    propeller.rotate(PI / 100);
    propeller.draw();
}

// ===========================================================
// initialisators

function createWalls() {
    const leftWall = new Box(-50, height / 2, 100, height, null, { isStatic: true });
    const rightWall = new Box(width, height / 2, 100, height * 2, null, { isStatic: true });
    const wall1 = new Box(width * 0.75, height / 5 - 70, width * 0.24, 25, null, { isStatic: true });
    const wall2 = new Box(width - 50, -30, 240, 240, null, { isStatic: true });
    const wall3 = new Box(width * 0.70, -90, 50, 300, null, { isStatic: true });
    const wall4 = new Box(width * 0.55, height / 4 - 70, width * 0.1, 25, null, { isStatic: true });
    const wall5 = new Box(width * 0.42, height / 4 - 30, width * 0.1, 25, null, { isStatic: true });
    propeller = new Box(width / 2 + 200, -10, 10, 300, null, { isStatic: true });
    wall2.rotate(PI * 0.25);
    wall1.rotate(PI * -0.04);
    wall4.rotate(PI * -0.04);
    wall5.rotate(PI * -0.04);
    bodies.push(wall1, wall2, wall3, wall4, wall5, leftWall, rightWall, propeller);
}

function createBasket(x, y) {
    const dimX = 480;
    const dimY = 210;
    const left = new Box(x - dimX / 2 + 12.5, y, 25, dimY, null, { isStatic: true });
    const right = new Box(x + dimX / 2 - 12.5, y, 25, dimY, null, { isStatic: true });
    const bottom = new Box(x, y + dimY / 2 + 12.5, dimX, 25, null, { isStatic: true });
    bodies.push(left, right, bottom);
}

function createPusher() {
    let count = 1;
    for (let i = 0; i < count; i++) {
        let box = new Box(width, height, 400, height, null, { isStatic: true });
        pushers.push(box);
    }
}

function createStages() {
    let count = 30;
    let rowlen = width / count;
    for (let i = 0; i < count; i++) {
        let box = new Box(i * rowlen + rowlen / 2, height, rowlen, 200, null, { isStatic: true });
        stages.push(box);
    }
}

function createBalls() {
    for (let i = 100; i < 118; i++) {
        let ball = new Box(110, -i * 50, 70, 70, color(30, 100, 100, 0.75))
        bodies.push(ball);
    }
    for (let i = 0; i < 100; i++) {
        let ball = new Ball(25, -i * 100, 30)
        bodies.push(ball);
    }
}

/**  
 * Enables mouse handling of bodies
 * Based on code from D. Shiffman - https://github.com/shiffman/p5-matter/blob/master/02_bouncing_balls/sketch.js
 * Author: E. Hoefig
 */
function initMouse() {
    let mouse = Matter.Mouse.create(canvas.elt);
    let mouseParams = {
        mouse: mouse,
        constraint: {
            stiffness: 1.0,
            angularStiffness: 0.5,
        }
    }
    let mouseConstraint = Matter.MouseConstraint.create(engine, mouseParams);
    mouseConstraint.mouse.pixelRatio = pixelDensity();
    Matter.World.add(world, mouseConstraint);
}

// ===========================================================
// classes

function Box(x, y, width, height, col, options) {
    this.options = options || {
        friction: 0.0,
        restitution: 0.1
    }
    this.body = Bodies.rectangle(x, y, width, height, this.options);
    this.width = width;
    this.height = height
    this.color = col || color(0, 0, 50, 0.8);
    World.add(world, this.body);


    this.setPosY = (y) => {
        Body.setPosition(this.body, { x: this.body.position.x, y: y })
    }

    this.rotate = (a) => {
        Body.rotate(this.body, a);
    }

    this.draw = () => {
        push();
        stroke(255, 0, 100);
        fill(this.color);
        translate(this.body.position.x, this.body.position.y);
        rotate(this.body.angle);
        rectMode(CENTER);
        rect(0, 0, this.width, this.height);
        pop();
    }
}

function Ball(x, y, radius, options) {
    this.options = options || {
        friction: 0,
        restitution: 0
    }
    this.radius = radius;
    this.diameter = radius * 2;
    this.color = random(180, 250);
    this.body = Bodies.circle(x, y, this.radius, this.options);
    World.add(world, this.body);

    this.draw = () => {
        push();
        stroke(this.color, 255, 255);
        fill(this.color, 200, 100, 0.5);
        translate(this.body.position.x, this.body.position.y);
        rotate(this.body.angle);
        ellipse(0, 0, this.diameter);
        pop();
    }
}
