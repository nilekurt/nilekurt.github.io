// Produces an array [0..n-1]
export function range(n) {
    return Array.from({ length: n }, (value, key) => key);
}

// Generates a dim(xs) by dim(xs) translation matrix
export function translate(xs) {
    const len = xs.size()[0] - 1;
    const m = math.identity(len + 1);
    const translation = math.subset(m, math.index(range(len), len), math.subset(xs, math.index(range(len), 0)));
    return translation;
}

export function position(m) {
    return math.subset(m, math.index(range(4), 3));
}