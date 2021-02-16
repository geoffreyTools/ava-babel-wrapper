export const id = x => x;
export const loose = f => x => f(x) || x;
export const compose = (f, g) => x => f(g(x));
export const pipe = (...fs) => fs.reduceRight(compose, id);
export const either = p => l => r => x => p(x) ? r(x) : l(x);

export const $ = method => arg => a => a[method](arg);
export const map = $('map');
export const split = $('split');
export const join = $('join');