// Settings
let width = 500;
let height = 500;

let inc = 0.008;

function setup() {
    createCanvas(width, height);
    let xOff = 0;
    for (let x = 0; x < width; x++) {
        let yOff = 0;
        for (let y = 0; y < height; y++) {
            let r = noise(xOff, yOff)*255;
            let g = noise(xOff+width, yOff+height)*255;
            let b = noise(xOff+2*width, yOff+2*height)*255;
            set(x, y, color(r, g, b));
            yOff += inc;
        }
        xOff += inc;
    }
    updatePixels();
}
