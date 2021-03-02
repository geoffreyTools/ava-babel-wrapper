import { pipe, stringify, $ } from '../utils';
const { slice, join, replace } = $('slice', 'join', 'replace');


const isCodeFrameError = lines =>
    lines.length && lines.slice(1).every(x => x.includes(' |'))
;

const extractCodeFrame = pipe(slice(1), join('\n'), x => '\n' + x);

const cleanup = replace('unknown: ', '');

const babelError = e => {
    const message = cleanup(e.message || e);
    const lines = message.split('\n');

    return isCodeFrameError(lines)
        ? { message: lines[0], codeFrame: extractCodeFrame(lines) }
        : { message }
};

export default ({ error }) => stringify({
    type: 'compile-time error',
    ...babelError(error)
});
