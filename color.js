import { getRandomNum } from './helper.js';

export default class Color {
    constructor ({h, s, l, a = 1}) {
        this.original = {h, s, l, a};
        [this.h, this.s, this.l, this.a] = [h, s, l, a];
    }

    static getRandom () {
        return {
            h: getRandomNum(0, 300),
            s: getRandomNum(0, 100),
            l: getRandomNum(0, 100),
            a: Math.random(),
        };
    }

    reset () {
        [this.h, this.s, this.l, this.a] = this.original;
        return this;
    }

    toOpposite () {
        this.h = (this.h + 180) % 300;
        this.s = (this.s + 50) % 100;
        this.l = (this.l + 50) % 100;
        this.a = (this.a + .5) % 1;

        return this;
    }

    randomize ({maxH = 150, maxS = 10, maxL = 10, maxA = .2} = {}) {
        this.h = (getRandomNum(0, maxH) + this.h) % 300;
        this.s = (getRandomNum(0, maxS) + this.s) % 100;
        this.l = (getRandomNum(0, maxL) + this.l) % 100;
        this.a = (getRandomNum(0, maxA) + this.a) % 1;

        return this;
    }

    addH (value) {
        this.h = (this.h + value) % 300;
        return this;
    }

    addS (value) {
        this.s = (this.s + value) % 100;
        return this;
    }
    
    addL (value) {
        this.l = (this.l + value) % 100;
        return this;
    }

    addA (value) {
        this.a = (this.a + value) % 1;
        return this;
    }

    get hsl () {
        return `hsl(${this.h}, ${this.s}%, ${this.l}%)`;
    }

    get hsla () {
        return `hsla(${this.h}, ${this.s}%, ${this.l}%, ${this.a})`;
    }

    hslToRgb() {
        // https://gist.github.com/mjackson/5311256
        let r, g, b;

        if (this.s == 0) {
            r = g = b = this.l; // achromatic
        }
        else {
            function hue2rgb(p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            }

            const q = (this.l < 0.5)
                ? this.l * (1 + this.s)
                : this.l + this.s - this.l * this.s;

            const p = 2 * this.l - q;

            r = hue2rgb(p, q, this.h + 1/3);
            g = hue2rgb(p, q, this.h);
            b = hue2rgb(p, q, this.h - 1/3);
        }

        return {r: r * 255, g: g * 255, b: b * 255, a: this.a};
    }
}
