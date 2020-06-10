/**
 * @author William Reetz
 * Source Code inspired by Daniel Shiffman (https://www.youtube.com/watch?v=CKeyIbT3vXI)
 * 
 * Assets:
 * Sounds by https://freesound.org/people/Rudmer_Rotteveel/sounds/336008/
 * Fonts by 
 * purdy design https://www.dafont.com/de/emoticons.font
 * deFharo https://www.1001fonts.com/bocartes-fritos-font.html
 * su-lucas https://www.fontspace.com/su-lucas/sl-mythological-silhouettes
 * cosmorama https://www.fontspace.com/cosmorama/astro
 * pizzadude https://www.1001freefonts.com/pizzadude-stars.font
 */

// ===========================================================
// Globals

let fireworks = [];
let gravity;
let possibility = 0.035;
let showFPS = false;

// sounds
let igniteSound;
let explodeSound;

// fonts
let emoticonsFont;
let fritosFont;
let mythFont;
let astroFront;
let stars;

// ===========================================================
// p5.js main functions

function preload() {
    emoticonsFont = loadFont('assets/fonts/emoticons.ttf');
    fritosFont = loadFont('assets/fonts/bocartes-fritos.ttf');
    mythFont = loadFont('assets/fonts/mythological.ttf');
    astroFront = loadFont('assets/fonts/astro.ttf');
    stars = loadFont('assets/fonts/stars.ttf');

    igniteSound = loadSound('assets/sounds/ignite.wav');
    explodeSound = loadSound('assets/sounds/explode.wav');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(0);
    colorMode(HSB);
    stroke(255);
    strokeWeight(3);
    noSmooth();
    gravity = createVector(0, 0.1);
}

function draw() {
    if (random() < possibility) {
        igniteSound.play();
        fireworks.push(new FireworkRocket());
    }
    background(0, 0, 0, 0.13);
    for (let i = fireworks.length - 1; i >= 0; i--) {
        const firework = fireworks[i];
        firework.update();
        firework.draw();
        if (firework.done()) {
            fireworks.splice(i, 1);
        }
    };
    if (showFPS) {
        drawFPS();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
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

function getRandomLetter() {
    let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnop';
    return letters.charAt(random(letters.length));
}

function getRandomFont() {
    let fonts = [stars, emoticonsFont, emoticonsFont, mythFont, astroFront, fritosFont];
    return fonts[parseInt(random(0, fonts.length - 1))];

}

// -----------------------------------------------------------
// Classes

function Particle(x, y, fireworkStar) {
    this.hue = fireworkStar.hue;
    this.target = createVector(x, y);
    this.acc = createVector(0, 0);
    this.pos = createVector(x, y);
    this.lifespan = 1;

    if (fireworkStar.type === 'rocket') {
        this.vel = createVector(random(-2, 2), random(-8, -13));
    } else if (fireworkStar.type === 'font') {
        this.vel = p5.Vector.random2D();
        this.vel.mult(random(1, 2));
    } else if (fireworkStar.type === 'big') {
        this.vel = p5.Vector.random2D();
        this.vel.mult(random(1, 20));
    } else {
        this.vel = p5.Vector.random2D();
        this.vel.mult(random(1, 5));
    }

    this.update = () => {
        if (fireworkStar.type !== 'rocket') {
            this.vel.mult(0.95);
            this.lifespan -= 0.01;
        }
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);
    }

    this.applyForce = (f) => {
        this.acc.add(f);
    }

    this.arrive = (target) => {
        let desired = p5.Vector.sub(target, this.pos).mult(0.05);
        let steer = p5.Vector.sub(desired, this.vel);
        this.acc.add(steer);
    }

    this.isDone = () => {
        return this.lifespan < 0;
    }

    this.draw = () => {
        if (fireworkStar.type === 'rocket') {
            stroke(50, 50, 255);
        } else {
            stroke(this.hue, random(0, 255), random(0, 255), this.lifespan);
            strokeWeight(4);
        }
        point(this.pos.x, this.pos.y);
    }
}

function FireworkRocket() {
    this.padding = 500;
    this.rand255 = random(255);
    this.firework = new Particle(random(windowWidth - this.padding) + this.padding / 2, windowHeight, new FireworkStar('rocket'));
    this.exploded = false;
    this.particles = [];

    this.done = () => {
        return this.exploded && this.particles.length === 0;
    }

    this.update = () => {
        if (!this.exploded) {
            this.firework.applyForce(gravity);
            this.firework.update();
            if (this.firework.vel.y >= 0) {
                explodeSound.play();
                this.exploded = true;
                this.explode();
            }
        }
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.applyForce(gravity);
            particle.update();
            if (particle.isDone()) {
                this.particles.splice(i, 1);
            }

        }
    }

    this.explode = () => {
        let rand = random();
        if (rand < 0.5) {
            this.explodeAsFont(getRandomFont(), getRandomLetter());
        } else if (rand >= 0.5 && rand < 0.6) {
            this.explodeAsBig();
        } else if (rand >= 0.6 && rand < 0.8) {
            this.explodeAsColorful();
        }else{
            this.explodeAsDefault();
        }
    }

    this.explodeAsFont = (font, txt) => {
        let randSize = random(200, 400);
        let randHue = random(0, 255);
        let points = font.textToPoints(txt, this.firework.pos.x, this.firework.pos.y, randSize, {
            sampleFactor: 0.075,
            simplifyThreshold: 0
        });
        let txtCenter = font.textBounds(txt, 0, 0, randSize);
        for (let i = 0; i < points.length; i++) {
            let pt = points[i];
            let target = createVector(pt.x - txtCenter.w / 2, pt.y + txtCenter.h / 2);
            this.particles.push(new Particle(this.firework.pos.x, this.firework.pos.y, new FireworkStar('font', randHue)));
            this.particles[i].arrive(target);
        }
    }

    this.explodeAsDefault = () => {
        let rand = random(50, 100);
        let randHue = random(0, 255);
        for (let i = 0; i < rand; i++) {
            let p = new Particle(this.firework.pos.x, this.firework.pos.y, new FireworkStar('default', randHue));
            this.particles.push(p);
        }
    }

    this.explodeAsBig = () => {
        let rand = random(100, 150);
        let randHue = random(0, 255);
        for (let i = 0; i < rand; i++) {
            let p = new Particle(this.firework.pos.x, this.firework.pos.y, new FireworkStar('big', randHue));
            this.particles.push(p);
        }
    }

    this.explodeAsColorful = () => {
        let rand = random(50, 100);
        for (let i = 0; i < rand; i++) {
            let p = new Particle(this.firework.pos.x, this.firework.pos.y, new FireworkStar('default', random(0, 255)));
            this.particles.push(p);
        }
    }


    this.draw = () => {
        if (!this.exploded) {
            this.firework.draw();
        }
        this.particles.forEach(particle => {
            particle.draw();
        });
    }
}

function FireworkStar(fwType, hue) {
    this.type = fwType || 'default';
    this.hue = hue || random(255);
}