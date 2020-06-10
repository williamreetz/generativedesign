/**
 * @author William Reetz
 * Source Code inspired by Daniel Shiffman (https://www.youtube.com/watch?v=urR596FsU68)
 * 
 * Sound by: https://freesound.org/people/Mrthenoronha/sounds/376351/
 * 
 */

// ===========================================================
// globals

const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;
const Composite = Matter.Composite;
const engine = Engine.create();
const world = engine.world;

const width = 1920;
const height = 1080;

const bodies = [];
const drawables = [];
let canon;

// ===========================================================
// p5.js functions

function setup() {
    createCanvas(width, height);
    colorMode(HSB);
    background(0);
    drawBackground(300, 5, 30, 60);
    drawBackground(600, 10, 30, 60);
    drawBackground(1500, 12, 30, 60);
    Engine.run(engine);
    world.gravity.y = 1;
    initMouse();
    createBoundaries();
    createBricks();
    canon = new Canon(250, 950);
}

function draw() {
    background(10);
    drawables.forEach(drawable => {
        drawable.draw();
    });
    strokeWeight(2);
    bodies.forEach(body => {
        body.draw();
    });
    drawHelp();
}

// Controlls
function keyPressed() {
    if (keyCode === 32) canon.shot();
    if (keyCode === UP_ARROW) canon.rotateUp();
    if (keyCode === DOWN_ARROW) canon.rotateDown();
}

// ===========================================================
// initialisators

function createBoundaries() {
    let opts = { isStatic: true };
    let wallSize = 200;
    new Box(-width, height, width * 3, wallSize, null, opts);
    // new Box(0, 0, width, -wallSize, null, opts);
    // new Box(width, 0, wallSize, height, null, opts);
    // new Box(-wallSize, 0, wallSize, height, null, opts);
}

function createBalls() {
    for (let i = 0; i < 3; i++) {
        new Ball(200, height - 25, 25, 5);
    }
}

function createBricks() {
    let opts = {
        density: 0.0001,
        friction: 1,
        restitution: 0
    }
    let posx = 1100;
    let = bw = 35;
    let = bh = 70;

    for (let j = 0; j < 12; j++) {
        for (let i = 0; i < j; i++) {
            new Box(posx + j * bw, height - bh - i * bh, bw, bh, color(random(255), 20, 50), opts);
        }
    }
    for (let j = 0; j < 12; j++) {
        for (let i = 0; i < j; i++) {
            new Box(posx - j * bw + 23 * bw, height - bh - i * bh, bw, bh, color(random(255), 20, 50), opts);
        }
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
            angularStiffness: 1,
        }
    }
    let mouseConstraint = Matter.MouseConstraint.create(engine, mouseParams);
    mouseConstraint.mouse.pixelRatio = pixelDensity();
    World.add(world, mouseConstraint);
}

// ===========================================================
// drawables

function drawBackground(posx, n, bw, bh) {

    for (let j = 0; j < n; j++) {
        for (let i = 0; i < j; i++) {
            new Rect(posx + j * bw, height - bh - i * bh, bw, bh, color(random(255), 20, 50, 0.25), color(255, 0, 50, 0.1));
        }
    }
    for (let j = 0; j < n; j++) {
        for (let i = 0; i < j; i++) {
            new Rect(posx - j * bw + (n * 2 - 1) * bw, height - bh - i * bh, bw, bh, color(random(255), 20, 50, 0.25), color(255, 0, 50, 0.1));
        }
    }
}

function drawHelp() {
    textSize(15);
    noStroke();
    fill(color(0, 0, 255));
    text('CONTROLS', 20, 25);
    text('up: canon up', 20, 50);
    text('down: canon down', 20, 75);
    text('space: shoot', 20, 100);
}

function Spring(b1, b2) {
    this.bodyA = b1;
    this.bodyB = b2;
    this.draw = () => {
        stroke(50, 50, 255);
        strokeWeight(5);
        line(
            this.bodyA.position.x, this.bodyA.position.y,
            this.bodyB.position.x, this.bodyB.position.y);
    }
    drawables.push(this);
}

function Circle(x, y, r, colr) {
    this.draw = () => {
        stroke(255, 0, 255, 0.5);
        strokeWeight(2);
        fill(colr);
        ellipse(x, y, r);
    }
    drawables.push(this);
}

function Rect(x, y, w, h, colr, colr2) {
    this.colr2 = colr2 || color(255, 0, 255, 0.5);
    this.draw = () => {
        stroke(this.colr2);
        strokeWeight(2);
        fill(colr);
        rect(x, y, w, h);
    }
    drawables.push(this);
}
// ===========================================================
// classes

function Canon(x, y) {

    this.ready = true;
    let size = 50;
    let length = 200;
    let opts = { isStatic: true };
    let opts2 = { density: 1, friction: 0.0, restitution: 0.5 };

    let tubeTop = new Box(x + size, y - size * 1.5, length, size / 2, null, opts);
    let tubeBottom = new Box(x + size, y, length, size / 2, null, opts);
    let plugStatic = new Box(x - length, y - size, size / 2, size * 0.99, null, opts);
    let plugDynamic = new Ball(x - length / 2, y - size, size / 2, opts2, 50);
    let backTubeA = new Box(x - size * 4, y - size * 1.5, length * 1.5, size / 2, null, opts);
    let backTubeB = new Box(x - size * 4, y, length * 1.5, size / 2, null, opts);
    let stopper = new Box(x - size, y - size, size, size, null, opts);
    new Spring(plugStatic.body, plugDynamic.body);
    let spring = Matter.Constraint.create({
        bodyA: plugStatic.body,
        bodyB: plugDynamic.body,
        length: length * 1.5,
        stiffness: 0.025
    });
    let composition = Composite.create();
    Composite.add(composition, [
        tubeBottom.body, tubeTop.body,
        backTubeA.body, backTubeB.body,
        plugStatic.body, plugDynamic.body,
        stopper.body
    ]);
    World.add(world, [spring]);

    this.shot = () => {
        if (this.ready) {
            this.ready = false;
            let sb = stopper.body;
            Body.translate(sb, { x: cos(sb.angle - PI / 2) * 50, y: sin(sb.angle - PI / 2) * 50 });
            window.setTimeout(() => {
                this.close();
                this.ready = true;
            }, 1000);
        }
    }

    this.close = () => {
        let sb = stopper.body;
        let pd = plugDynamic.body;
        Body.translate(sb, { x: cos(sb.angle - PI / 2) * -50, y: sin(sb.angle - PI / 2) * -50 });
        Body.translate(pd, { x: cos(sb.angle - PI) * 200, y: sin(sb.angle - PI) * 200 });
        Body.setAngle(pd, sb.angle);
        this.reload();
    }

    let drawColor = color(255, 0, 255, 0.1);
    let onlyStroke = color(0, 0, 0, 0);
    new Circle(x - 25, y - 25, 250, drawColor);
    new Circle(x - 25, y - 25, 25, onlyStroke);
    new Rect(x - length / 1.5, y + size * 2, size * 4, size, drawColor);

    this.reload = () => {
        let property = { density: 0.002, friction: 0.0, restitution: 0.0 };
        let sb = stopper.body;
        new Ball(sb.position.x + cos(sb.angle) * 25, sb.position.y + sin(sb.angle) * 25, 25, property);
    }

    this.reload();

    this.rotateUp = () => {
        Composite.rotate(composition, -0.1, { x: x - 25, y: y - 25 });
    }

    this.rotateDown = () => {
        Composite.rotate(composition, 0.1, { x: x - 25, y: y - 25 });
    }
}

function Box(x, y, w, h, col, options) {
    this.options = options || {
        friction: 0,
        restitution: 0
    }
    this.body = Bodies.rectangle(w / 2 + x, h / 2 + y, w, h, this.options);
    this.width = w;
    this.height = h
    this.color = col || color(0, 0, 50, 0.8);
    World.add(world, this.body);
    bodies.push(this);
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


function Ball(x, y, radius, options, colr) {
    this.options = options || {
        friction: 0,
        restitution: 0
    }
    this.radius = radius;
    this.diameter = radius * 2;
    this.color = colr || random(0, 20);
    this.body = Bodies.circle(x, y, this.radius, this.options);
    World.add(world, this.body);
    bodies.push(this);
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


function Polygon(x, y, sides, radius, options) {
    this.options = options || {
        friction: 0.0,
        restitution: 0.1
    }
    this.body = Bodies.polygon(x, y, sides, radius, options);
    World.add(world, this.body);
    this.draw = () => {
        push();
        stroke(255, 255, 255);
        fill(255, 200, 100, 0.5);
        translate(this.body.position.x, this.body.position.y);
        rotate(this.body.angle - PI);
        this.createShape(0, 0, sides, radius);
        pop();
    }
    this.createShape = (x, y, sides, radius) => {
        let angle = TWO_PI / sides;
        beginShape();
        for (let a = 0; a < TWO_PI; a += angle) {
            let sx = x + cos(a) * radius;
            let sy = y + sin(a) * radius;
            vertex(sx, sy);
        }
        endShape();
    }
}