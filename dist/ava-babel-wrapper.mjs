import babel from '@babel/core';
import ava from 'ava';

const id = x => x;
const loose = f => x => f(x) || x;
const compose = (f, g) => x => f(g(x));
const pipe = (...fs) => fs.reduceRight(compose, id);
const either = p => l => r => x => p(x) ? r(x) : l(x);

const $ = method => arg => a => a[method](arg);
const map = $('map');
const split = $('split');
const join = $('join');

const subBounds = rightFn => left => right => str => {
    const numOr = either(x => typeof x !== 'number')(id);
    const start = numOr(x => str.indexOf(x) + 1);
    const end = numOr(x => rightFn(x)(str));
    return str.substring(start(left), end(right));
};

const subExtremes = subBounds($('lastIndexOf'));
const subBetween = subBounds($('indexOf'));
const subBefore = subBounds($('indexOf'))(0);

const getFunctionBody = subExtremes('{')('}');

const getFunctionParameters = pipe(
    loose(subBefore('{')),
    loose(subBefore('=>')),
    loose(subBetween('(')(')')),
    split(','),
    map(x => x.trim())
);

var parseFunction = pipe(
    $('toString')(),
    str => [getFunctionParameters(str), getFunctionBody(str)]
);

const assoc = store => map((_, i) => store[i]);

var executable = (paramNames, scope, t) => code => {
    const paramValues = assoc([t, code])(paramNames);
    const scopeNames = Object.keys(scope);
    const scopeValues = Object.values(scope);
    const params = [...paramNames, ...scopeNames];
    const args = [...paramValues, ...scopeValues];
    new Function(params, code)(...args);
};

const indent = n => pipe(
    split('\n'),
    map(x => '   '.repeat(n) + x),
    join('\n')
);

const escape = char => str =>
    str.replace(new RegExp(char, 'g'), '\\' + char)
;

const formatCode = pipe(escape('"'), indent(2), x => '\n' + x);

const formatIf = key => obj =>
    !obj[key]
    ? obj
    : { ...obj, [key]: formatCode(obj[key]) }
;

var errorMessage = pipe(
    formatIf('babelOutput'),
    Object.entries,
    map(([key, value]) => `\n  "${key}": "${value}"`),
    join(','),
    json => '{' + json + '\n}'
);

const testFunc = (plugins, scope) => f => (title, test, reject = log) => {
    const [params, body] = parseFunction(test);
    const tooMany = maxParamsCount(2)(params);
    if (tooMany) throw tooMany;

    f(title, t =>
        babel.transformAsync(body, { plugins })
        .then(success(t, executable(params, scope, t), reject))
        .catch(failure(t, reject))
    );
};

const apply = context => pipe(
    map(key => [key, context(ava[key])]),
    Object.fromEntries
);

var index = (plugins = [], scope = {}) => {
    const context = testFunc(plugins, scope);
    const fns = apply(context)(['only', 'failing', 'serial']);
    return Object.assign(context(ava), ava, fns)
};

const log = (t, e) => { t.fail(e); };

const maxParamsCount = max => params =>
    params.length <= max
    ? null
    : new Error(`test function expected a maximum of ${max} arguments, got ${params.length}: ${params.map(x => `"${x}"`).join(', ')}`)
;

const success = (t, execute, reject) => result => {
    try {
        execute(result.code);
    } catch (e) {
        const message = errorMessage({
            type: 'run-time error',
            message: e.message || e,
            babelOutput: result.code
        });

        reject(t, message);
    }
};

const failure = (t, reject) => e => {
    const message = errorMessage({
        type: 'compile-time error',
        message: (e.message || e).replace('unknown: ', '')
    });
    reject(t, message);
};

export default index;
//# sourceMappingURL=ava-babel-wrapper.mjs.map
