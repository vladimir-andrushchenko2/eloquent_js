'use strict'

const char_to_number = {
    'a': 2,
    'b': 2,
    'c': 2,
    'd': 3,
    'e': 3,
    'f': 3,
    'g': 4,
    'h': 4,
    'i': 4,
    'j': 5,
    'k': 5,
    'l': 5,
    'm': 6,
    'n': 6,
    'o': 6,
    'p': 7,
    'q': 7,
    'r': 7,
    's': 7,
    't': 8,
    'u': 8,
    'v': 8,
    'w': 9,
    'x': 9,
    'y': 9,
    'z': 9
};

function ReverseDict(dict) {
    let output = new Map();

    for (const key in dict) {
        let value = dict[key];

        if (Array.isArray(output[value])) {
            output[value].push(key);
        } else {
            output[value] = [key];
        }
    }

    return output;
}

const number_to_char = ReverseDict(char_to_number);

const adjacency_list = {
    1 : new Set([2, 4, 10, 3]),
    2 : new Set([2, 4, 10, 3]),
}