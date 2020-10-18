var size = 100;
var movement = 5;
var directions = [
    { x: -movement, y: 0 },
    { x: 0, y: -movement },
    { x: 0, y: movement },
    { x: movement, y: 0 },
    { x: -movement, y: -movement },
    { x: movement, y: movement },
    { x: -movement, y: movement },
    { x: movement, y: -movement }
];
var previous = {};
var counter = 0;

function getRandomDir() {
    return directions[Math.floor(Math.random() * directions.length)];
}

function getModifiedColorPart(c) {
    return (c + Math.floor(Math.random() * 6) - 3 + 255) % 255;
}

function getModifiedRGB(color) {
    return { r: getModifiedColorPart(color.r), g: getModifiedColorPart(color.g), b: getModifiedColorPart(color.b) };
}

function getNextShape() {
    var dir = previous.dir;
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
        r: Math.floor(Math.random() * 255),
        g: Math.floor(Math.random() * 255),
        b: Math.floor(Math.random() * 255)
    };
}

function setup() {
    var bg = getRandomColor();
    var color = getRandomColor();
    createCanvas(windowWidth, windowHeight);
    background(bg.r, bg.g, bg.b);
    noStroke();
    previous = {
        dir: getRandomDir(),
        x: Math.floor(Math.random() * windowWidth),
        y: Math.floor(Math.random() * windowHeight),
        color: color,
    };

}

function draw() {
    const shape = getNextShape();
    fill(shape.color.r, shape.color.g, shape.color.b);
    circle(shape.x, shape.y, Math.random() * 20 + size);
    previous = shape;
}