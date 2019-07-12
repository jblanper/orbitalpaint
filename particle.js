//https://github.com/nature-of-code/noc-examples-processing/blob/master/chp03_oscillation/Exercise_3_16_springs_array/Mover.pde
import Vector from './vector.js';
import { circle, constrain } from './helper.js';

export default class Particle {
    constructor ({
        ctx, radius, position, velocity = new Vector(), damping = .9, fixed = false,
        boundaries = {
            n: 0, s: ctx.canvas.clientHeight,
            w: 0, e: ctx.canvas.clientWidth
        },
        G = 4, minDistance = 5, maxDistance = 25
    }) {
        this.ctx = ctx;
        this.boundaries = boundaries;
        this.radius = radius;
        this.fixed = fixed;

        this.position = position;
        this.velocity = velocity;
        this.acceleration = new Vector();

        this.damping = damping;

        // atractor
        this.G = G;
        this.minDistance = minDistance;
        this.maxDistance = maxDistance;

        // for drag
        this.dragging = false;
        this.dragOffset = new Vector();
    }

    applyForce (force) {
        this.acceleration.add(force);
    }

    update () {
        if (this.fixed) return;
        this.velocity.add(this.acceleration);
        this.velocity.mul(this.damping);
        this.position.add(this.velocity);

        this.checkEdges();

        this.acceleration.mul(0);
    }

    draw () {
        circle(this.ctx, this.radius, this.position);
        this.ctx.fill();
    }

    checkEdges () {
        if (this.position.x > this.boundaries.e || this.position.x < this.boundaries.w) {
            this.position.x = (this.position.x > this.boundaries.e)
                    ? this.boundaries.e
                    : this.boundaries.w;
            this.velocity.x *= -1;
        }
        if (this.position.y > this.boundaries.s || this.position.y < this.boundaries.n) {
            this.position.y = (this.position.y > this.boundaries.s)
                    ? this.boundaries.s
                    : this.boundaries.n;
            this.velocity.y *= -1;
        }
    }

    // Atractor
    atract (particle) {
        // Nature of Code
        let force = Vector.sub(this.position, particle.position);
        let distance = force.magnitude;
        distance = constrain(distance, this.minDistance, this.maxDistance);

        const strength = this.G / (distance * distance);

        force.normalize().mul(strength)

        return force;
    }

    // drag action
    handleClick (mx, my, isMobile = false) {
        const mousePosition = new Vector(mx, my);
        const dist = mousePosition.getDistance(this.position);

        if (dist < 10 && !isMobile || dist < 30) {
            this.dragging = true;
            this.dragOffset.set(this.position.copy().sub(mousePosition));
        }
    }

    handleDrag (mx, my) {
        if (this.dragging) {
            this.position.change(mx + this.dragOffset.x, my + this.dragOffset.y);
        }
    }

    stopDragging () {
        this.dragging = false;
    }
}
