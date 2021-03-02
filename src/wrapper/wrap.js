import babel from '@babel/core';
import defaultHandler from './defaultErrorHandler.js'
import ResultFactory from '../results/Result.js';
import parse from '../function/getFunction.js';
import ErrorMessage from '../messages/ErrorMessage.js';
import { _ } from '../utils.js';

const Result = ResultFactory(ErrorMessage);

export default (plugins, scope) => runner => (title, test, reject = defaultHandler) => {
    const { body, command } = parse(test, scope);

    runner(title, t =>
        babel.transformAsync(body, { plugins })
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
