import { pipe, stringify, $ } from '../utils'

const format = pipe(
    $('split')('\n'),
    $('map')(x => '     ' + x),
    $('join')('\n'),
    x => '\n' + x
);

export default({ result, error }) => stringify({
    type: 'run-time error',
    message: error.message || error,
    babelOutput: format(result.code)
});
