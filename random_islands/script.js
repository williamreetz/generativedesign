// Settings
let width = 750;
let height = 750;


function setup() {
    createCanvas(width, height);
    let xOff = 0;
    for (let x = 0; x < width; x++) {
        let yOff = 0;
        for (let y = 0; y < height; y++) {
            let bright = noise(xOff, yOff)*255;
            let colors = color(25, 55, 200);
            if (bright >= 140 && bright < 255) {
                colors = color(bright, bright, 0);
            }
            else if (bright >= 100 && bright < 140) {
                colors = color(bright-65, bright-65, bright+100);
            }
            else {
                colors = color(0, 0, bright+100);
            }

            yOff += 0.01;
            set(x, y, colors);
        }
        xOff += 0.01;
    }
    updatePixels();
}