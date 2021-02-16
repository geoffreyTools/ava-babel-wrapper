import { pipe, map, split, join} from './utils'

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

export default pipe(
    formatIf('babelOutput'),
    Object.entries,
    map(([key, value]) => `\n  "${key}": "${value}"`),
    join(','),
    json => '{' + json + '\n}'
);