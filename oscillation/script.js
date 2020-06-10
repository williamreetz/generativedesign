/**
 * @author William Reetz
 * Source Code inspired by Daniel Shiffman (https://www.youtube.com/watch?v=Mm2eYfj0SgA)
 */

// ===========================================================
// SETTINGS

let showTime = false;
let showWave = false;
let timelapse = false;
let showParts = false;
let timelapseSpeed = 65;
let period = 1;
let size = 600;

// other globals
let timer;
let wave = [];

// ===========================================================
// p5.js functions

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(0);
    timer = new Timer();
    timer.setTime(hour(), minute(), second());
}

function draw() {
    background(0);

    timer.tick();

    if (showTime) drawTime();
    stroke(255);
    strokeWeight(2);
    fill(255, 75);

    push();
    translate(windowWidth / 3, windowHeight / 2);

    circle(0, 0, size); // DAY

    let hoursArc = hoursToArc(timer.getHours());
    let x = size / 4 * cos(hoursArc);
    let y = size / 4 * sin(hoursArc);
    circle(x, y, size / 2); // HOURS

    let minutesArc = minutesToArc(timer.getMinutes());
    let x2 = x + size / 8 * cos(minutesArc);
    let y2 = y + size / 8 * sin(minutesArc);
    circle(x2, y2, size / 4); // MINUTES


    let secondsArc = secondsToArc(timer.getSeconds());
    let x3 = x2 + size / 16 * cos(secondsArc);
    let y3 = y2 + size / 16 * sin(secondsArc);
    circle(x3, y3, size / 8); // SECONDS

    if (showParts) {
        stroke(255, 0, 0);
        drawMarker(0, 0, size / 2, 24);
        stroke(0, 255, 0);
        drawMarker(x, y, size / 4, 60);
        stroke(0, 0, 255);
        drawMarker(x2, y2, size / 8, 60);
        stroke(255);
        line(0, 0, x, y);
        line(x, y, x2, y2);
        line(x2, y2, x3, y3);
    }

    if (showWave) {
        wave.unshift(y3);
        noFill();
        strokeWeight(1);
        beginShape();
        for (let i = 0; i < wave.length; i++) {
            vertex(i * period + size / 2, wave[i]);
        }
        endShape();
    }
    pop();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
// ===========================================================
// drawables

function drawTime() {
    textSize(30);
    textAlign(CENTER);
    fill(255);
    noStroke();
    text(timer.getTime(), windowWidth / 3, height * 0.9);
}

function drawMarker(ox, oy, d, count) {
    for (let i = 0; i < TWO_PI; i += TWO_PI / count) {
        let x = ox + d * cos(i);
        let y = oy + d * sin(i);
        strokeWeight(1);
        line(ox, oy, x, y);
    }
    strokeWeight(2);
}

// ===========================================================
// utils

function changeTimeZone(tz) {
    switch (tz) {
        case 2: // new york
            timer.setTime(timeshift(-6), minute(), second());
            break;
        case 3: // tokio
            timer.setTime(timeshift(8), minute(), second());
            break;
        default: // berlin
            timer.setTime(hour(), minute(), second());
    }
}

function timeshift(h) {
    return (hour() + h) % 24;
}

function hoursToArc(h) {
    return TWO_PI / 24 * h - HALF_PI;
}

function minutesToArc(m) {
    return TWO_PI / 60 * m - HALF_PI;
}

function secondsToArc(s) {
    return TWO_PI / 60 * s - HALF_PI;
}

// ===========================================================
// classes

function Timer() {
    this.seconds = 0;
    this.speed = 1;

    this.s = 0;
    this.m = 0;
    this.h = 0;

    this.tick = () => {
        this.seconds += this.speed;
        if (this.seconds >= 86400) {
            this.seconds = 0;
        }
        this.update();
    }

    this.tack = () => {
        this.seconds -= this.speed;
        if (this.seconds < 0) {
            this.seconds = 86399;
        }
        this.update();
    }

    this.update = () => {
        this.updateSpeed();
        this.s = this.seconds % 60;
        this.m = this.seconds / 60 % 60;
        this.h = this.seconds / 3600;
    }

    this.updateSpeed = () => {
        if (timelapse) {
            this.speed = timelapseSpeed;
        } else {
            let fr = frameRate();
            if (fr !== 0) this.speed = 1 / frameRate();
        }
    }

    this.setTime = (h, m, s) => {
        let hours = h || 0;
        let minutes = m || 0;
        let seconds = s || 0;
        this.seconds = seconds + minutes * 60 + hours * 3600;
    }

    this.getHours = () => { return this.h }
    this.getMinutes = () => { return this.m }
    this.getSeconds = () => { return this.s }
    this.getTime = () => {
        return ('0' + floor(this.h)).slice(-2) + ':'
             + ('0' + floor(this.m)).slice(-2) + ':'
             + ('0' + floor(this.s)).slice(-2);
    }

}
