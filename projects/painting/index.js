let windowSize = 900;
let popl;
let size = 1000;
class Color {
    constructor(r, g, b, a) {
        this.r = r || floor(random(200));
        this.g = g || floor(random(200));
        this.b = b || floor(random(200));
        this.a = a || 0.9;
    }

    rgba() {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    }
}

class Snake {
    constructor() {
        this.position = createVector(windowSize / 2, windowSize / 2);
        //this.position = createVector(random(windowSize), random(windowSize));
        this.acceleration = createVector();
        this.velocity = createVector();
        this.color = new Color();
        this.size = 25;
        this.isAlive = true;
    }
    show() {
        push();
        fill(this.color.rgba());
        translate(this.position.x, this.position.y);
        rotate(this.velocity.heading());
        rectMode(CENTER);
        rect(0, 0, this.size, 5, 2);
        pop();
    }
    behaviour() {
        if (this.isAlive)
            this.acceleration.add(p5.Vector.random2D());
    }
    update() {
        if (this.isAlive) {
            this.velocity.add(this.acceleration);
            //this.velocity.limit(4);
            this.position.add(this.velocity);
            this.acceleration.mult(0);

            if (this.position.x < this.size / 2 || this.position.x > windowSize - this.size / 2 || this.position.y < this.size / 2 || this.position.y > windowSize - this.size / 2) {
                this.isAlive = false;
            }
        }
    }
}

class Population {
    constructor(size) {
        this.members = [];
        for (let i = 0; i < size; i++) {
            this.members[i] = new Snake();
        }
    }
    show() {
        this.members.forEach(m => m.show());
    }
    update() {
        this.members.forEach(m => m.behaviour());
        this.members.forEach(m => m.update());
    }
}

function setup() {
    windowSize = min(windowWidth, windowHeight);
    createCanvas(windowSize, windowSize);
    background(new Color().rgba());
    noStroke();
    popl = new Population(size);
}

function draw() {
    popl.show();
    popl.update();
}