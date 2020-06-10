let balls = [];

function setup() {
    createCanvas(windowWidth, windowHeight);
    colorMode(HSB, 1);
    background(0);
    for (let i = 0; i < 5; i++) {
        spawn();
    }
}

function draw() {
    // background(0,100)
    balls.forEach(ball => {
        ball.update();
        ball.bounds();
        ball.draw();
    });

}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function spawn() {
    balls.push(new Ball(windowWidth / 2, windowHeight / 2));
}

class Ball {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.oldPos = this.pos;
        this.vel = createVector(random(), random()).mult(20);
        this.acc = createVector(0, 0);
        this.maxSpeed = 20;
        this.hue  = random();
    }

    draw() {
        stroke(this.hue,1,1,1);
        strokeWeight(1);
        line(this.oldPos.x, this.oldPos.y, this.pos.x, this.pos.y);
    }

    update() {
        this.oldPos = createVector(this.pos.x, this.pos.y);
        this.vel.add(this.acc);
        this.vel.limit(this.maxSpeed);
        this.pos.add(this.vel);
        this.acc.mult(0);
    }

    bounds() {
        if (this.pos.x > windowWidth ||
            this.pos.x < 0) {
            this.vel.x *= -1;
        }
        if (this.pos.y > windowHeight ||
            this.pos.y < 0) {
            this.vel.y *= -1;
        }
    }
}


