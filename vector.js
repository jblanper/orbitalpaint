export default class Vector {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    static fromPolar(angle, radiusX, radiusY = radiusX) {
        const x = radiusX * Math.cos(angle);
        const y = radiusY * Math.sin(angle);
        return new this(Math.floor(x), Math.floor(y));
    }

    static add(vector1, vector2) {
        return new this(vector1.x + vector2.x, vector1.y + vector2.y);
    }

    static sub(vector1, vector2) {
        return new this(vector1.x - vector2.x, vector1.y - vector2.y);
    }

    static eq(vector1, vector2) {
        return vector1.x === vector2.x && vector1.y === vector2.y;
    }

    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }

    addX(x) {
        this.x += x;
        return this;
    }

    addY(y) {
        this.y += y;
        return this;
    }

    sub(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
        return this;
    }

    subX(x) {
        this.x -= x;
        return this;
    }

    subY(y) {
        this.y -= y;
        return this;
    }

    mul(num) {
        this.x = this.x * num;
        this.y = this.y * num;
        return this;
    }

    div(num) {
        if (num !== 0) {
            this.x = this.x / num;
            this.y = this.y / num;
            return this;
        }
    }

    get magnitude() {
        //return Math.sqrt(this.x * this.x + this.y * this.y);
        return Math.hypot(this.x, this.y);
    }

    normalize() {
        this.div(this.magnitude);
        return this;
    }

    getDistance(vector = {x: 0, y: 0}) {
        const xDistance = vector.x - this.x;
        const yDistance = vector.y - this.y;
        return Math.hypot(xDistance, yDistance);
    }

    getAngle(vector = {x: 0, y: 0}) {
        return Math.atan2(this.y - vector.y, this.x - vector.x)
    }

    getMiddle(vector) {
        const x = (this.x + vector.x) * 0.5
        const y = (this.y + vector.y) * 0.5
        return new Vector(x, y);
    }

    eq(vector) {
        return this.x === vector.x && this.y === vector.y;
    }

    isOpposite(vector) {
        if (this.eq(vector)) return false;
        return this.x === -vector.x && this.y === -vector.y;
    }

    copy() {
        return new Vector(this.x, this.y);
    }

    set(vector) {
        this.x = vector.x;
        this.y = vector.y;
        return this;
    }

    change(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }
};
