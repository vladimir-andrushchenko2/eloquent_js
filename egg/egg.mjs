import {evaluate} from './evaluator.mjs'
import {parse} from './parser.mjs'
import {topScope} from './environment.mjs'

function run(program) {
    return evaluate(parse(program), Object.create(topScope));
}

run(`
  do(define(total, 0),
     define(count, 1),
     while(<(count, 11),
           do(define(total, +(total, count)),
              define(count, +(count, 1)))),
     print(total))
  `);
  // → 55