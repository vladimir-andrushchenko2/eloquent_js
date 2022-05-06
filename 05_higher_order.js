function flatten(array) {
    return array.reduce((prev, cur) => prev.concat(cur), []);
}

function loop(value, test_function, update_function, body_function) {
    for (value; test_function(value); value = update_function(value)) {
        body_function(value);
    }
}

// function every(array, test) {
//     for (let element of array) {
//         if (!test(element)) {
//             return false;
//         }
//     }

//     return true;
// }

function every(array, test) {
    return !array.some(element => !test(element));
}

const SCRIPTS = require("./scripts");

function characterScript(code) {
    for (let script of SCRIPTS) {
        if (script.ranges.some(([from, to]) => {
            return code >= from && code < to;
        })) {
            return script;
        }
    }
    return null;
}

function countBy(items, groupName) {
    let counts = [];
    for (let item of items) {
        let name = groupName(item);
        let known = counts.findIndex(c => c.name == name);
        if (known == -1) {
            counts.push({ name, count: 1 });
        } else {
            counts[known].count++;
        }
    }
    return counts;
}

function textScripts(text) {
    let scripts = countBy(text, char => {
        let script = characterScript(char.codePointAt(0));
        return script ? script.name : "none";
    }).filter(({ name }) => name != "none");

    let total = scripts.reduce((n, { count }) => n + count, 0);
    if (total == 0) return "No scripts found";

    return scripts.map(({ name, count }) => {
        return `${Math.round(count * 100 / total)}% ${name}`;
    }).join(", ");
}

function dominantDirection(text) {
    let scripts = countBy(text, char => {
        let script = characterScript(char.codePointAt(0));
        return script ? script.direction : "none";
    }).filter(({ name }) => name != "none");

    let max_count = scripts[0];

    for (let script of scripts) {
        if (script.count > max_count.count) {
            max_count = script;
        }
    }

    return  max_count.name;
}
