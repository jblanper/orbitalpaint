import Particle from './particle.js';

export default class ParticlesCollection {
    constructor ({particleNumber, particleOptions}) {
        // particleOptions = {ctx, radius = [float], position = [Vector]}
        // optional: damping = [float], fixed = bool, velocity = [Vector]
        // boundaries = {n = float, s = float, e = float, w = float}
        // G = float, minDistance = [float], maxDistance = [float]
        this.particleOptions = particleOptions;
        this.particleNumber = particleNumber;
        this.ctx = particleOptions.ctx;
        this.setup();
    }

    setup () {
        const opt = this.particleOptions;

        this.particles = Array.from({length: this.particleNumber}, (_, i) => {
            let particle = new Particle({
                ctx: opt.ctx,
                radius: (typeof opt.radius == 'object')
                    ? opt.radius[i % opt.radius.length]
                    : opt.radius,
                position: opt.position[i % opt.position.length]
            });

            // optional
            if (opt.velocity) particle.velocity = opt.velocity[i % opt.velocity.length];
            if (opt.damping) particle.damping = opt.damping[i % opt.damping.length];
            if (opt.boundaries) particle.boundaries = opt.boundaries;
            if (opt.fixed) particle.fixed = opt.fixed;
            if (opt.G) particle.G = opt.G;
            if (opt.minDistance) {
                if (typeof opt.minDistance == "object" ) {
                    particle.minDistance = opt.minDistance[i % opt.minDistance.length];
                } else {
                    particle.minDistance = opt.minDistance;
                }
            }
            if (opt.maxDistance) {
                if (typeof opt.maxDistance == "object" ) {
                    particle.maxDistance = opt.maxDistance[i % opt.maxDistance.length];
                } else {
                    particle.maxDistance = opt.maxDistance;
                }
            }

            return particle;
        });
    }

    addParticle (particleOptions) {
        this.particles.push(new Particle(particleOptions));
    }

    lockParticles (...indexes) {
        if (indexes.length > 0) {
            indexes.forEach(i => this.particles[i].fixed = true);
        }
    }

    update ({forces = [], fn = null} = {}) {
        this.particles.forEach(p => {
            if (forces.length > 0) forces.forEach(f => p.applyForce(f));
            if (fn) fn(p);
            p.update();
        });
    }

    draw() {
        this.particles.forEach(p => p.draw());
    }

    // drag functionality
    setDragging (updateFn = null) {
        this.ctx.canvas.addEventListener('touchstart', e => {
            e.preventDefault();
            const touch = e.touches[0];
            this.particles.forEach(p => p.handleClick(touch.pageX, touch.pageY, true));
        });

        this.ctx.canvas.addEventListener('touchmove', e => {
            e.preventDefault();
            const touch = e.touches[0];

            this.particles.forEach(p => {
                dragging = p.handleDrag(touch.pageX, touch.pageY);
                if (updateFn && p.dragging) updateFn();
            });
        });

        this.ctx.canvas.addEventListener('touchend', e => {
            e.preventDefault();
            this.particles.forEach(p => p.stopDragging());
        });

        this.ctx.canvas.addEventListener('mousedown', e => {
            if (e.buttons === 1) {
                this.particles.forEach(p => p.handleClick(e.clientX, e.clientY));
            }
        });

        this.ctx.canvas.addEventListener('mousemove', e => {
            this.particles.forEach(p => {
                p.handleDrag(e.clientX, e.clientY)
                if (updateFn && p.dragging) updateFn();
            });

        });

        this.ctx.canvas.addEventListener('mouseup', e => {
            this.particles.forEach(p => p.stopDragging());
        });
    }
}
