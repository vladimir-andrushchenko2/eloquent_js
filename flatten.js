
// возвращает
//[1, 'any [complex] string', null, function() {}, 1, 2, 3, '4', 0, { a: 1 }]
flatten([[[[1]]], [2]]) //[1,2]

/**
 * 
 * @param {*[]} list 
 * @returns 
 */
function flatten(list) {
    let output = []

    for (let i = 0; i < list.length; ++i) {
        if (Array.isArray(list[i])) {
            let flattened_part = flatten(list[i]);

            for (let e of flattened_part) {
                output.push(e)
            }
        } else {
            output.push(list[i]);
        }
    }

    return output;
}

console.log(flatten([1, 'any [complex] string', null, function () { }, [1, 2, [3, '4'], 0], [], { a: 1 }]));