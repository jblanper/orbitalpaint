import { createCanvas, getRandomNum, getRingPoints, getPng } from './helper.js';
import { createTogglePanelButton, createControlPanel } from './ui.js';
import Vector from './vector.js';
import ParticlesCollection from './particlesCollection.js';
import Color from './color.js';
import setAnimation from './animate.js';

function createSketch ({ctxts}) {
    // constants
    const height = ctxts[0].canvas.clientHeight;
    const width = ctxts[0].canvas.clientWidth;
    const origin = new Vector(width / 2, height / 2); 

    // variables
    let state = {
        initialFormationRadius: 140,
        particleNumber: 1000,
        atractorNumber: 2,
        color: new Color({h:0, s:0, l:0, a:.1})
    };

    let particles = new ParticlesCollection({
        particleNumber: state.particleNumber,
        particleOptions: {
            ctx: ctxts[0],
            radius: [.25],
            position: getRingPoints(state.particleNumber, state.initialFormationRadius)
                .map(v =>
                    v.add(origin)
                ),
            damping: [.998] // 1 = no damping
        }
    });

    let atractors =  new ParticlesCollection({
        particleNumber: state.atractorNumber,
        particleOptions: {
            ctx: ctxts[1],
            radius: [5],
            position: Array.from({length: state.atractorNumber}, _ => {
                return new Vector(
                    getRandomNum(origin.x - 250, origin.x + 250),
                    getRandomNum(origin.y - 250, origin.y + 250),
                );
            }),
            G: 5, minDistance: [15], maxDistance: [25],
            damping: [.9998]
        }
    });

    // draw background
    ctxts[0].fillStyle = '#fff';
    ctxts[0].fillRect(0, 0, width, height);

    // general ctx setup
    ctxts[0].fillStyle = state.color.hsla;
    ctxts[1].fillStyle = 'red';

    // initial draw for atractors
    atractors.draw();

    // hande dragging of atractors
    const atractorsUpdate = _ => {
        clean(ctxts[1]);
        atractors.draw();
        atractors.update();
    };

    atractors.setDragging(atractorsUpdate);

    // methods
    const clean = (ctx, drawBackground = false) => {
        if (drawBackground) {
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, width, height);
            ctx.fillStyle = state.color.hsla;
        } else {
            ctx.clearRect(0, 0, width, height);
        }
    };

    const draw = _ => {
        particles.draw();
    };
    
    const update = _ => {
        particles.update({
            fn: p => {
                atractors.particles.forEach(atractor => {
                    p.applyForce(atractor.atract(p));
                });
            }
        });
    };

    const animation = setAnimation(_ => {
        draw();
        update();
    }, 0);

    const resetParticles = _ => {
        clean(ctxts[0], true);

        particles.particleOptions.position = getRingPoints(
            particles.particleNumber, state.initialFormationRadius
        ).map(v => v.add(origin));

        particles.setup();
    };

    // bindings
    document.addEventListener('keyup', e => {
        if (e.key == 's') animation.toggle();
        if (e.key == 'e') clean(ctxts[0], true);
        if (e.key == 'r') {
            resetParticles();
            atractors.setup();
        }
        if (e.key == 't') {
            clean(ctxts[0], true);
            particles.setup();
            atractors.setup();
        }
    });

    // ui
    createControlPanel({
        atractors, particles, sketchState: state,
        updateFns: {
            atractorNumberSlider: _ => {
                atractors.particleOptions.position = Array.from(
                    {length: atractors.particleNumber}, _ => {
                        return new Vector(
                            getRandomNum(origin.x - 350, origin.x + 350),
                            getRandomNum(origin.y - 350, origin.y + 350),
                        );
                    }
                );

                atractors.setup();
                atractorsUpdate();
            },
            atractorsUpdate: _ => {
                atractors.setup();
                atractorsUpdate();
            },
            particleNumberSlider: _ => {
                resetParticles();
            },
            alphaSlider: _ => {
                ctxts[0].fillStyle = state.color.hsla;
            },
            initialRadiusSlider: _ => {
                resetParticles();
            }
        },
        eraseFn: _ => clean(ctxts[0], true),
        animationToggleFn: _ => animation.toggle(),
        saveImgFn: _ => {
            if (animation.animating) animation.stop();
            getPng(ctxts[0].canvas);
        }
    });

    // return obj
    return {clean, draw, update, animation};
};

createTogglePanelButton();
const ctxts = [createCanvas('#canvas1'), createCanvas('#canvas2')];
const sketch = createSketch({ctxts});
sketch.animation.start();
