import babel from '@babel/core';
import ava from 'ava';
import parseFunction from './parseFunction';
import executable from './executable';
import errorMessage from './errorMessage';

const test = (plugins, scope) => (title, test, reject = log) => {
    const [params, body] = parseFunction(test);
    const tooMany = maxParamsCount(2)(params);
    if (tooMany) throw tooMany;

    ava(title, t =>
        babel.transformAsync(body, { plugins })
        .then(success(t, executable(params, scope, t), reject))
        .catch(failure(t, reject))
    )
};

export default (plugins = [], scope = {}) =>
    Object.assign(test(plugins, scope), ava)
;

const log = (t, e) => { t.fail(e) };

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
}

const failure = (t, reject) => e => {
    const message = errorMessage({
        type: 'compile-time error',
        message: e.message || e
    });
    reject(t, message);
}