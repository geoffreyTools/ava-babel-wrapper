import ava from 'ava';
import { pipe, $ } from './utils';
import wrapFactory from './wrapper/wrap.js';

const map = $('map');

const wrapWith = factory => pipe(
    map(key => [key, factory(ava[key])]),
    Object.fromEntries
);

export default (plugins = [], scope = {}) => {
    const wrap = wrapFactory(plugins, scope);
    const modifiers = wrapWith(wrap)(['only', 'failing', 'serial']);
    const test = Object.assign(wrap(ava), ava, modifiers)
    return test;
};
