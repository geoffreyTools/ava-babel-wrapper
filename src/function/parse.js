import { id, pipe, loose, either, $ } from '../utils';
const { map, filter, split, lastIndexOf, indexOf, toString } = $('map', 'filter', 'split', 'lastIndexOf', 'indexOf', 'toString');

const subBounds = rightFn => left => right => str => {
    const numOr = either(x => typeof x !== 'number')(id)
    const start = numOr(x => str.indexOf(x) + 1);
    const end = numOr(x => rightFn(x)(str));
    return str.substring(start(left), end(right));
};

const subExtremes = subBounds(lastIndexOf);
const subBetween = subBounds(indexOf);
const subBefore = subBounds(indexOf)(0)

const getFunctionBody = subExtremes('{')('}');

const getFunctionParameters = pipe(
    loose(subBefore('{')),
    loose(subBefore('=>')),
    loose(subBetween('(')(')')),
    split(','),
    map(x => x.trim()),
    filter(x => x !== '()')
);

export default pipe(
    toString(null),
    str => [getFunctionParameters(str), getFunctionBody(str)]
);