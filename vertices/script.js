const nodes = [];
let off = 0;
const numberOfNodes = 100;
const hue = 0;
// const windowWidth = 1080
// const windowHeight = 1080
let fps = 60;
let capturer = new CCapture({ format: 'png', framerate: fps });
let action = false;

function setup() {
    createCanvas(windowWidth, windowHeight);
    createNodes();
    background(0);
    colorMode(HSB, 1);
    frameRate(fps);
}

function draw() {
    if (keyCode === ENTER) {
        console.log('... stop recording');
        noLoop();
        capturer.stop();
        capturer.save();
    }
    if (keyCode === UP_ARROW && !action) {
        console.log('start recording ...');
        capturer.start();
        action = true;
    }
    background(0, 1);
    nodes.forEach(node => {
        let numberOfNearNodes = 0;
        node.move();
        node.bounds();
        nodes.forEach(node2 => {
            let n = node.lineToNearNodes(node2);
            if (n) numberOfNearNodes++;
        });
        node.numberOfNearNodes = numberOfNearNodes;
        node.draw();
    });
    off += 0.005;
    // capturer.capture(document.getElementById('defaultCanvas0'));
}

function createNodes() {
    for (let n = 0; n < numberOfNodes; n++) {
        let x = random(windowWidth);
        let y = random(windowHeight);
        nodes.push(new Node(x, y, 4))
    }
}

class Node {

    constructor(x, y, size) {
        this.randomNumber = random(1000) * 100;
        this.size = size;
        this.pos = createVector(x, y);
        this.acc = createVector(0, 0);
        this.vel = p5.Vector.random2D().mult(0.5);
        this.numberOfNearNodes = 0;
        this.hue = 0;
    }

    lineToNearNodes(node) {
        if (node === this) return false;
        const x1 = this.pos.x;
        const y1 = this.pos.y;
        const x2 = node.pos.x;
        const y2 = node.pos.y;
        const distance = int(dist(x1, y1, x2, y2))
        const minDistance = 100;
        if (distance < minDistance) {
            stroke(this.hue, 1, 1, map(distance, 0, minDistance, 1, 0))
            strokeWeight(map(distance, 0, minDistance, 4, 0))
            line(x1, y1, x2, y2);
            return true
        }
        return false;
    }


    draw() {
        this.hue = map(this.numberOfNearNodes, 0, numberOfNodes*0.2, 0, 1) + hue;
        stroke(this.hue, 1, 1, 0.075);
        for (let n = 0; n <= 15; n+=1) {
            strokeWeight(n);
            point(this.pos.x, this.pos.y);
        }
    }

    move() {
        const nx = noise(off + this.randomNumber) * windowWidth;
        const ny = noise(off + this.randomNumber + 1500) * windowHeight;
        const tollerance = 100;
        this.pos.x = map(nx, 0, windowWidth, -tollerance, windowWidth + tollerance);
        this.pos.y = map(ny, 0, windowHeight, -tollerance, windowHeight + tollerance);
        // this.vel.add(this.acc);
        // this.pos.add(this.vel);
        // this.acc.mult(0);
    }

    bounds() {
        const tollerance = 250
        if (this.pos.x + tollerance < 0) {
            this.pos.x = windowWidth;
        }
        if (this.pos.x - tollerance > windowWidth) {
            this.pos.x = 0
        }
        if (this.pos.y + tollerance < 0) {
            this.pos.y = windowHeight;
        }
        if (this.pos.y - tollerance > windowHeight) {
            this.pos.y = 0;
        }
    }

}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
