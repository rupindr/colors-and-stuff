const windowSize = 800;
let popl;
let target;
let size = 1000;
let mutationProb = 1;
let isDone = false;
let pElement;
const repel = 100;
const timePerPopl = 300;

function getRandomForce() {
    return p5.Vector.random2D();
}

class DNA {
    constructor(seq) {
        if (seq) {
            this.sequence = [...seq];
        }
        else {
            this.sequence = [];
            for (let i = 0; i < timePerPopl; i++) {
                this.sequence[i] = getRandomForce();
            }
        }
    }
    crossover(otherDna) {
        const newDna = new DNA();
        const mid = floor(random(this.sequence.length));
        for (let i = 0; i < mid; i++) {
            newDna.sequence[i] = this.sequence[i];
        }
        for (let i = mid; i < this.sequence.length; i++) {
            newDna.sequence[i] = otherDna.sequence[i];
        }
        if (random(100) < mutationProb * 100) {
            newDna.sequence[floor(random(newDna.sequence.length))] = getRandomForce();
        }
        return newDna;
    }
}


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
    constructor(dna) {
        if (dna) {
            this.dna = dna;
        }
        else {
            this.dna = new DNA();
        }
        this.position = createVector(windowSize / 2, windowSize - 100);
        //this.position = createVector(random(windowSize), random(windowSize));
        this.acceleration = createVector();
        this.velocity = createVector();
        //this.color = new Color(100, 100, 100, 0.9);
        this.color = new Color();
        this.size = 25;
        this.isAlive = true;
        this.marked = false;
        this.isDone = false;
        this.fitness = 0;
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
    behaviour(time) {
        if (this.isAlive) {
            //this.acceleration.add(p5.Vector.random2D());
            this.acceleration.add(this.dna.sequence[time]);
        }
    }
    applyForce(force) {
        if (this.isAlive) {
            this.acceleration.add(force);
        }
    }
    dist(other) {
        return this.position.dist(other.position);
    }
    mark() {
        this.marked = true;
    }
    interact(other) {
        if (this.dist(other) < repel && this.isAlive && other.isAlive) {
            const force = -p5.Vector.sub(this.position, other.position);
            other.applyForce(force);
        }
    }
    update() {
        if (this.isAlive && !this.isDone) {
            this.velocity.add(this.acceleration);
            this.velocity.limit(4);
            this.position.add(this.velocity);
            this.acceleration.mult(0);

            if (this.position.x < this.size / 2 || this.position.x > windowSize - this.size / 2 || this.position.y < this.size / 2 || this.position.y > windowSize - this.size / 2) {
                this.isAlive = false;
            }
            if (this.marked) {
                this.color = new Color(255, 0, 0, 0.9);
                this.marked = false;
            }
            else {
                this.color = new Color(100, 100, 100, 0.9);
            }
            const dist = this.position.dist(target);
            if (dist < this.size) {
                this.isDone = true;
            }
        }
    }
    calcFitness() {
        const dist = this.position.dist(target);
        this.fitness = 1 / dist;
        if (this.isAlive) {
            this.fitness += 0.001;
        }
        if (this.isDone) {
            this.fitness += 0.001;
        }
    }
    crossover(other) {
        return new Snake(this.dna.crossover(other.dna));
    }
}

class Population {
    constructor(size) {
        this.members = [];
        this.time = 0;
        for (let i = 0; i < size; i++) {
            this.members[i] = new Snake();
        }
        this.best = 0;
        this.avg = 0;
    }
    calcFitness() {
        this.members.forEach(p => p.calcFitness());
        let totalFitness = 0;
        this.members.forEach(p => totalFitness += p.fitness);
        this.avg = totalFitness / this.members.length;
    }
    crossover() {
        let temp = [...this.members];
        temp.sort((a, b) => b.fitness - a.fitness);
        temp = temp.slice(0, floor(size / 4));
        //console.log(temp);
        this.best = temp[0].fitness;
        const newPoplmembers = [];
        while (newPoplmembers.length < size) {
            newPoplmembers.push(random(temp).crossover(random(temp)));
        }
        const newPop = new Population(1);
        newPop.size = size;
        newPop.members = newPoplmembers;
        newPop.best = popl.best;
        newPop.avg = popl.avg;
        popl = newPop;
    }
    show() {
        this.members.forEach(m => m.show());
    }
    update() {
        if (this.time < timePerPopl) {
            this.members.forEach(m => m.behaviour(this.time));
            this.members.forEach(m => m.update());
            this.time++;
        }
        else {
            this.calcFitness();
            this.crossover();
            this.time = 0;
            //background(230);
        }
        //const m = this.members[0];
        //m.mark();
        // this.members.forEach(m => {
        //     this.members.forEach(other => {
        //         m.interact(other);
        //     });
        // });
    }
    checkIfDone() {
        this.members.forEach(p => {
            if (p.checkIfDone()) {
                isDone = true;
            }
        });
    }
}

function setup() {
    createCanvas(windowSize, windowSize);
    noStroke();
    popl = new Population(size);
    target = createVector(windowSize / 2, 100);
    pElement = createP('');
}

let count = 0;
function draw() {
    count++;
    if (count > 2000 * timePerPopl) {
        return;
    }
    background(230);
    fill('red');
    circle(target.x, target.y, 30);
    popl.update();
    popl.show();
    pElement.html(`Generation: ${floor(count / timePerPopl)} <br /> Frame: ${popl.time} <br /> Best: ${popl.best} <br /> Avg: ${popl.avg}`);
}