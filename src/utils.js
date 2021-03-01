export const id = x => x;
export const loose = f => x => f(x) || x;
export const compose = (f, g) => x => f(g(x));
export const pipe = (...fs) => fs.reduceRight(compose, id);
export const either = p => l => r => x => p(x) ? r(x) : l(x);
export const _ = (f, x) => (...xs) => f(x, ...xs);

export const _$ = method => (...args) => a => a[method](...args);
export const $ = (x, ...xs) =>
    !xs.length
    ? _$(x)
    : Object.fromEntries(
        [x, ...xs].map(key => [key, _$(key)])
    )
;

export const stringify = x => JSON.stringify(x, null, '  ');