const size = 100;
const movement = 5;
const directions = [
    { x: -movement, y: 0 },
    { x: 0, y: -movement },
    { x: 0, y: movement },
    { x: movement, y: 0 },
    { x: -movement, y: -movement },
    { x: movement, y: movement },
    { x: -movement, y: movement },
    { x: movement, y: -movement }
];
let previous = {};
let counter = 0;

function getRandomDir() {
    return random(directions);
}

function getModifiedColorPart(c) {
    return (c + random(-3, 3) + 255) % 255;
}

function getModifiedRGB(color) {
    return { r: getModifiedColorPart(color.r), g: getModifiedColorPart(color.g), b: getModifiedColorPart(color.b) };
}

function getNextShape() {
    let dir = previous.dir;
    if (counter === 10) {
        dir = getRandomDir();
        while (dir.x === -previous.dir.x && dir.y === -previous.dir.y) {
            dir = getRandomDir();
        }
        counter = 0;
    }
    counter = (counter + 1);
    return {
        x: (previous.x + dir.x + windowWidth) % windowWidth,
        y: (previous.y + dir.y + windowHeight) % windowHeight,
        color: getModifiedRGB(previous.color),
        dir: dir
    };
}

function getRandomColor() {
    return {
        r: random(255),
        g: random(255),
        b: random(255)
    };
}

function setup() {
    const bg = getRandomColor();
    const color = getRandomColor();
    createCanvas(windowWidth, windowHeight);
    background(bg.r, bg.g, bg.b);
    noStroke();
    previous = {
        dir: getRandomDir(),
        x: windowWidth / 2,
        y: windowHeight / 2,
        color: color,
    };

}

function draw() {
    const shape = getNextShape();
    //stroke(shape.color.r - 20, shape.color.g - 20, shape.color.b - 20);
    fill(shape.color.r, shape.color.g, shape.color.b);
    circle(shape.x, shape.y, random(size - 20, size));
    previous = shape;
}