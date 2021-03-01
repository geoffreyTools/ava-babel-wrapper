import { $ } from '../utils';
const map = $('map');

const assoc = store => map((_, i) => store[i])

export default (paramNames, scope) => utils => code => {
    const paramValues = assoc([utils, code])(paramNames)
    const scopeNames = Object.keys(scope);
    const scopeValues = Object.values(scope);
    const params = [...paramNames, ...scopeNames];
    const args = [...paramValues, ...scopeValues];
    new Function(params, code)(...args);
};
