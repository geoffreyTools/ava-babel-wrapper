'use strict';

var ava = require('ava');
var babel = require('@babel/core');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var ava__default = /*#__PURE__*/_interopDefaultLegacy(ava);
var babel__default = /*#__PURE__*/_interopDefaultLegacy(babel);

const id = x => x;
const loose = f => x => f(x) || x;
const compose = (f, g) => x => f(g(x));
const pipe = (...fs) => fs.reduceRight(compose, id);
const either = p => l => r => x => p(x) ? r(x) : l(x);
const _ = (f, x) => (...xs) => f(x, ...xs);

const _$ = method => (...args) => a => a[method](...args);
const $ = (x, ...xs) =>
    !xs.length
    ? _$(x)
    : Object.fromEntries(
        [x, ...xs].map(key => [key, _$(key)])
    )
;

const stringify = x => JSON.stringify(x, null, '  ');

const unescapeLideFeed = str => str.replace(/\\n/g, '\n');

var defaultHandler = t => e => {
    e && t.fail(unescapeLideFeed(e));
};

var failure = (ErrorMessage, { reject }) => error =>
    reject(ErrorMessage({ type: 'compile-time', error }))
;

var success = (ErrorMessage, { execute, reject }) => result => {
    try {
        execute(result.code);
    } catch (error) {
        reject(ErrorMessage({ type: 'run-time', result, error }));
    }
};

var ResultFactory = ErrorMessage => descriptor =>
    ({ success, failure })[descriptor.type](ErrorMessage, descriptor)
;

const { map, split, lastIndexOf, indexOf, toString } = $('map', 'split', 'lastIndexOf', 'indexOf', 'toString');

const subBounds = rightFn => left => right => str => {
    const numOr = either(x => typeof x !== 'number')(id);
    const start = numOr(x => str.indexOf(x) + 1);
    const end = numOr(x => rightFn(x)(str));
    return str.substring(start(left), end(right));
};

const subExtremes = subBounds(lastIndexOf);
const subBetween = subBounds(indexOf);
const subBefore = subBounds(indexOf)(0);

const getFunctionBody = subExtremes('{')('}');

const getFunctionParameters = pipe(
    loose(subBefore('{')),
    loose(subBefore('=>')),
    loose(subBetween('(')(')')),
    split(','),
    map(x => x.trim())
);

var parse = pipe(
    toString(null),
    str => [getFunctionParameters(str), getFunctionBody(str)]
);

var validate = ({ params, max }) => {
    if (params.length > max) {
        const n = params.length;
        const list = params.map(x => `"${x}"`).join(', ');
        throw Error(`test function expected a maximum of ${max} arguments, got ${n}: ${list}`);
    }
};

const map$1 = $('map');

const assoc = store => map$1((_, i) => store[i]);

var command = (paramNames, scope) => utils => code => {
    const paramValues = assoc([utils, code])(paramNames);
    const scopeNames = Object.keys(scope);
    const scopeValues = Object.values(scope);
    const params = [...paramNames, ...scopeNames];
    const args = [...paramValues, ...scopeValues];
    new Function(params, code)(...args);
};

var parse$1 = (func, scope) => {
    const [params, body] = parse(func);
    validate({ params, max: 2 });
    return { command: command(params, scope), body, params };
};

const { slice, join, replace } = $('slice', 'join', 'replace');


const isCodeFrameError = lines =>
    lines.length && lines.slice(1).every(x => x.includes(' |'))
;

const extractCodeFrame = pipe(slice(1), join('\n'));

const cleanup = replace('unknown: ', '');

const babelError = e => {
    const message = cleanup(e.message || e);
    const lines = message.split('\n');

    return isCodeFrameError(lines)
        ? { message: lines[0], codeFrame: extractCodeFrame(lines) }
        : { message }
};

var CompileError = ({ error }) => stringify({
    type: 'compile-time error',
    ...babelError(error)
});

var RuntimeError = ({ result, error }) => stringify({
    type: 'run-time error',
    message: error.message || error,
    babelOutput: result.code
});

var ErrorMessage = descriptor =>
  ({'compile-time': CompileError,
    'run-time': RuntimeError
  })[descriptor.type](descriptor)
;

const Result = ResultFactory(ErrorMessage);

var wrapFactory = (plugins, scope) => runner => (title, test, reject = defaultHandler) => {
    const { body, command } = parse$1(test, scope);

    runner(title, t =>
        babel__default['default'].transformAsync(body, { plugins })
        .then(
            Result({
                type: 'success',
                execute: command(t),
                reject: _(reject, t)
            }),
            Result({
                type: 'failure',
                reject: _(reject, t)
            })
        )
    );
};

const map$2 = $('map');

const wrapWith = factory => pipe(
    map$2(key => [key, factory(ava__default['default'][key])]),
    Object.fromEntries
);

var index = (plugins = [], scope = {}) => {
    const wrap = wrapFactory(plugins, scope);
    const modifiers = wrapWith(wrap)(['only', 'failing', 'serial']);
    const test = Object.assign(wrap(ava__default['default']), ava__default['default'], modifiers);
    return test;
};

module.exports = index;
//# sourceMappingURL=ava-babel-wrapper.js.map
