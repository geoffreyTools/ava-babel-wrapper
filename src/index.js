import ava from 'ava';
import { pipe, $ } from './utils';
import testAbstractFactory from './test.js';

const map = $('map');

const build = factory => pipe(
    map(key => [key, factory(ava[key])]),
    Object.fromEntries
);

export default (plugins = [], scope = {}) => {
    const testFactory = testAbstractFactory(plugins, scope);
    const modifiers = build(testFactory)(['only', 'failing', 'serial']);
    const test = Object.assign(testFactory(ava), ava, modifiers)
    return test;
};
