function setup() {
    createCanvas(windowWidth, windowHeight);
}

function draw() {
    // 1. Blue Background
    background(0, 0, 150);

    // 2. diagonal cross
    stroke(0, 0, 255);
    strokeWeight(1); 
    line(0, 0, windowWidth, windowHeight);
    line(0, windowHeight, windowWidth, 0);
    
    // 3. points
    stroke(255, 255, 255);
    strokeWeight(10);
    point(windowWidth/2,windowHeight/2);
    point(windowWidth/2,windowHeight/3);
    
    // 4. ellipse and rectangle
    ellipseMode(CENTER); 
    stroke(0,255,0); 
    strokeWeight(1);
    noFill();
    ellipse(windowWidth / 2, windowHeight / 2, windowWidth / 2, windowHeight / 2); // Draw white ellipse using RADIUS
    
    stroke(255,200,0);
    rect(windowWidth / 4, windowHeight / 4, windowWidth / 2, windowHeight / 2);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}