/**
 * @author William Reetz
 * Source Code inspired by Daniel Shiffman (https://www.youtube.com/watch?v=mhjuuHl6qHM)
 * 
 */

// ===========================================================
// Globals

let fishes = [];
let grid;
let debug = false;
let hunterCount = 2;
let preyCount = 100;
let perceptionArea = 100;
// let fps = 60;
// let capturer = new CCapture({ format: 'png', framerate: fps });

// ===========================================================
// p5.js main functions

function setup() {
    // windowWidth = 1080;
    // windowHeight = 1080;
    createCanvas(windowWidth, windowHeight);
    background(2);
    colorMode(HSB);
    createHunterfishes(hunterCount);
    createPreyfishes(preyCount);
    // frameRate(fps);
    grid = new Grid(perceptionArea);
    // capturer.start();
    if (debug) createSpecialFish();
}

function draw() {
    // if (keyCode === ENTER) {
    //     noLoop();
    //     capturer.stop();
    //     capturer.save();
    // }
    if (debug) {
        background(0);
    } else {
        background(0, 0.15);
    }
    grid.init();
    fishes.forEach(fish => {
        fish.edges();
        grid.insert(fish);
    });
    fishes.forEach(fish => {
        fish.update();
        fish.edges();
        fish.draw();
        let others = grid.retrieve(fish);
        fish.flock(others);
    });
    if (debug) {
        drawFPS();
        grid.draw();
    }
    // capturer.capture(document.getElementById('defaultCanvas0'));

}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    grid.resize();
}

// ===========================================================
// drawables

function drawFPS() {
    textSize(15);
    noStroke();
    fill(255)
    text('FPS: ' + floor(frameRate()), 10, 20);
}

// -----------------------------------------------------------
// helper

function createHunterfishes(count) {
    for (let i = 0; i < count; i++) {
        fishes.push(new Fish(random(windowWidth), random(windowHeight), {
            color: color(random(10, 40), 255, 255),
            size: random(11, 14),
            type: 'hunter',
            maxSpeed: 10,
            acc: p5.Vector.random2D().mult(5)
        })
        );
    }
}

function createPreyfishes(count) {
    for (let i = 0; i < count; i++) {
        fishes.push(new Fish(random(windowWidth), random(windowHeight), {
            color: color(random(175, 245), 255, 255),
            acc: p5.Vector.random2D().mult(5),
            size: random(6, 9)
        })
        );
    }
}

function createSpecialFish() {
    fishes.push(new Fish(random(windowWidth), random(windowHeight), {
        color: color(80, 255, 255),
        size: 12,
        type: 'special',
        maxSpeed: 4,
        acc: p5.Vector.random2D().mult(5)
    })
    );
}

function reset() {
    fishes = [];
    createHunterfishes(hunterCount);
    createPreyfishes(preyCount);
}

// -----------------------------------------------------------
// Classes

function Fish(x, y, options) {
    if (!options) options = {};
    this.rand = random(PI);
    this.pos = createVector(x, y);
    this.perceptionArea = perceptionArea;
    this.acc = options.acc || createVector();
    this.vel = options.vel || createVector();
    this.size = options.size || 7;
    this.maxForce = options.maxForce || 0.5;
    this.maxSpeed = options.maxSpeed || 3;
    this.color = options.color || color(255, 0, 255);
    this.type = options.type || 'prey';
    this.align = (others) => {
        let pRadius = 100;
        let force = createVector();
        let total = 0;
        others.forEach(other => {
            if (other.type !== 'hunter') {
                let d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
                if (other !== this && d < pRadius) {
                    force.add(other.vel);
                    total++;
                }
            }
        });
        if (total > 0) {
            force.div(total);
            force.setMag(this.maxSpeed);
            force.sub(this.vel);
            force.limit(this.maxForce);
        }
        return force;
    }
    this.flee = (others) => {
        let pRadius = 130;
        let force = createVector();
        let total = 0;
        others.forEach(other => {
            if (other.type === 'hunter') {
                let d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
                if (other !== this && d < pRadius) {
                    let diff = p5.Vector.sub(this.pos, other.pos);
                    force.add(diff);
                    total++;
                }
            }
        });
        if (total > 0) {
            this.maxSpeed = 3.5;
            force.div(total);
            force.sub(this.vel);
            force.setMag(this.maxSpeed);
            force.limit(this.maxForce);
        } else {
            this.maxSpeed = 2;
        }
        return force;
    }
    this.hunt = (others) => {
        let pRadius = 150;
        let force = createVector();
        let total = 0;
        others.forEach(other => {
            if (other.type !== 'hunter') {
                let d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
                if (other !== this && d < pRadius) {
                    let diff = p5.Vector.sub(this.pos, other.pos);
                    force.sub(diff);
                    total++;
                }
            }
        });
        if (total > 0) {
            this.maxSpeed = 4;
            force.div(total);
            force.sub(this.vel);
            force.setMag(this.maxSpeed);
            force.limit(this.maxForce);
        } else {
            this.maxSpeed = 3;
        }
        return force;
    }
    this.separation = (others) => {
        let pRadius = 55;
        let force = createVector();
        let total = 0;
        others.forEach(other => {
            let d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
            if (other !== this && d < pRadius) {
                let diff = p5.Vector.sub(this.pos, other.pos);
                diff.mult(1 / d)
                force.add(diff);
                total++;
            }
        });
        if (total > 0) {
            force.div(total);
            force.setMag(this.maxSpeed * 1.25);
            force.sub(this.vel);
            force.limit(this.maxForce * 1.25);
        }
        return force;
    }
    this.cohesion = (others) => {
        let pRadius = 25;
        let force = createVector();
        let total = 0;
        others.forEach(other => {
            let d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
            if (other !== this && d < pRadius) {
                force.add(other.pos);
                total++;
            }
        });
        if (total > 0) {
            force.div(total);
            force.sub(this.pos);
            force.setMag(this.maxSpeed);
            force.sub(this.vel);
            force.limit(this.maxForce);
        }
        return force;
    }
    this.dectectWall = () => {
        let force = createVector();
        let pRadius = 25;
        // top
        if (this.pos.y < pRadius) {
            let diff = p5.Vector.sub(this.pos, createVector(this.pos.x, -windowHeight));
            force.add(diff);
            force.sub(this.vel);
            force.setMag(this.maxSpeed*2);
            force.limit(this.maxForce*2);
        }
        // bottem
        if (this.pos.y > windowHeight - pRadius) {
            let diff = p5.Vector.sub(this.pos, createVector(this.pos.x, windowHeight*2));
            force.add(diff);
            force.sub(this.vel);
            force.setMag(this.maxSpeed);
            force.limit(this.maxForce);
        }
        // left
        if (this.pos.x < 0) {
            force.y = 0;
        }
        // left
        if (this.pos.x > windowWidth) {
            force.y = 0;
        }
        force.setMag(this.maxSpeed);
        force.limit(this.maxForce);
        return force;
    }
    this.flock = (others) => {
        if (this.type !== 'hunter') {
            this.acc.add(this.flee(others));
            this.acc.add(this.align(others));
            this.acc.add(this.cohesion(others));
        } else {
            this.acc.add(this.hunt(others));
        }
        this.acc.add(this.separation(others));
        this.acc.add(this.dectectWall());
    }
    this.update = () => {
        this.pos.add(this.vel);
        this.vel.add(this.acc);
        this.vel.limit(this.maxSpeed);
        this.acc.mult(0);
    }
    this.draw = () => {
        noFill();
        stroke(this.color);
        strokeWeight(1);
        if (debug) {
            ellipse(this.pos.x, this.pos.y, this.perceptionArea);
        } else {
            this.vel.rotate(sin((frameCount + this.rand) * 0.4) * 0.17);
        }
        strokeWeight(this.size);
        point(this.pos.x, this.pos.y);
        this.edges();
    }
    this.edges = () => {
        let tollerance = 50;
        if (this.pos.x > windowWidth + tollerance) this.pos.x = -tollerance;
        if (this.pos.x < -tollerance) this.pos.x = windowWidth + tollerance;
        if (this.pos.y > windowHeight + tollerance) this.pos.y = -tollerance;
        if (this.pos.y < -tollerance) this.pos.y = windowHeight + tollerance;
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
        this.clear();
    }
    this.resize = () => {
        this.init();
    }
    this.retrieve = (item) => {
        let index = this.getIndex(item.pos.x, item.pos.y);
        if (index === -1) return [];
        let neighbors = this.getNeighbors(index);
        result = this.arr[index];
        if (item.type === 'special') {
            this.fillCell(index);
        }
        neighbors.forEach(neighbor => {
            if (neighbor != null) {
                if (item.type === 'special') {
                    this.fillCell(neighbor);
                }
                result = [...result, ...this.arr[neighbor]];
            }
        });
        return result;
    }
    this.insert = (item) => {
        let index = this.getIndex(item.pos.x, item.pos.y);
        if (index === -1) return [];
        this.arr[index].push(item);
    }
    this.clear = () => {
        for (let i = 0; i < this.arrLength; i++) {
            this.arr.push(new Array());
        }
    }
    this.getIndex = (x, y) => {
        let rx = floor(x / this.pWidth);
        let ry = floor(y / this.pHeight);
        let index = rx + ry * this.hParts;
        if (index >= this.arr.length || index < 0) {
            return -1;
        } else {
            return index;
        }
    }
    this.getNeighbors = (index) => {
        let top = index < this.hParts;
        let bottom = index + 1 > this.hParts * (this.vParts - 1);
        let left = index % this.hParts === 0;
        let right = (index + 1) % this.hParts === 0;
        let n = top ? null : index - this.hParts;
        let e = right ? index - this.hParts + 1 : index + 1;
        let s = bottom ? null : index + this.hParts;;
        let w = left ? index + this.hParts - 1 : index - 1;
        let ne = top || right ? null : index - this.hParts + 1;
        let se = bottom || right ? null : index + this.hParts + 1;
        let sw = bottom || left ? null : index + this.hParts - 1;;
        let nw = top || left ? null : index - this.hParts - 1;;;
        return [n, ne, e, se, s, sw, w, nw];
    }
    this.draw = () => {
        noFill();
        stroke(255, 0.2);
        strokeWeight(1);
        for (let x = 0; x < this.hParts; x++) {
            for (let y = 0; y < this.vParts; y++) {
                rect(x * this.pWidth, y * this.pHeight, this.pWidth, this.pHeight);
            }
        }
    }
    this.fillCell = (n) => {
        let rx = n % this.hParts;
        let ry = floor(n / this.hParts);
        let x = rx * this.pWidth;
        let y = ry * this.pHeight;
        noStroke();
        fill(255, 0, 255, 0.3);
        rect(x, y, this.pWidth, this.pHeight);
    }
    this.init();
}