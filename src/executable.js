import { map } from './utils';

const assoc = store => map((_, i) => store[i])

export default (paramNames, scope, t) => code => {
    const paramValues = assoc([t, code])(paramNames)
    const scopeNames = Object.keys(scope);
    const scopeValues = Object.values(scope);
    const params = [...paramNames, ...scopeNames];
    const args = [...paramValues, ...scopeValues];
    new Function(params, code)(...args);
};