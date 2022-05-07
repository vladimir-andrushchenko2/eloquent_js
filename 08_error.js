class MultiplicatorUnitFailure extends Error {}

function primitiveMultiply(a, b) {
  if (Math.random() < 0.5) {
    return a * b;
  } else {
    throw new MultiplicatorUnitFailure("Klunk");
  }
}

function reliableMultiply(a, b) {
    try {
        return primitiveMultiply(a, b);
    } catch (e) {
        if (e instanceof MultiplicatorUnitFailure) {
            console.log('caught an error');

            return a * b;
        }
    }
}

console.log(reliableMultiply(8, 8));
// → 64
