class Vec {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    plus(right) {
        return new Vec(this.x + right.x, this.y + right.y);
    }

    minus(right) {
        return new Vec(this.x + right.x, this.y - right.y);
    }

    get length() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
}

class Group {
    constructor() {
        this.data = [];
    }

    static from(iterable) {
        let group = new Group();

        for (let element of iterable) {
            group.add(element);
        }

        return group;
    }

    [Symbol.iterator]() {
        return new GroupIterator(this);
    }

    add(element) {
        if (this.data.indexOf(element) === -1) {
            this.data.push(element);
        }
    }

    has(element) {
        if (this.data.indexOf(element) !== -1) {
            return true;
        }

        return false;
    }

    delete(element) {
        let index = this.data.indexOf(element);

        if (index !== -1) {
            this.data.splice(index, 1);
        }
    }
}

class GroupIterator {
    constructor(group) {
        this.index = 0;
        this.group = group;
    }

    next() {
        if (this.index < this.group.data.length) {
            let output = {value: this.group.data[this.index], done: false};

            this.index++;

            return output;

        } else {
            return {done : true};
        }
    }
};

let map = {one: true, two: true, hasOwnProperty: true};

// Fix this call
console.log(Object.prototype.hasOwnProperty.call(map, "one"));
// → true