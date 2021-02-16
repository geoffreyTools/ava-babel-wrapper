const avaBabel = require('../dist/ava-babel-wrapper.js');

const foo = () => 'foo';
const bar = () => 'bar';

const scope = { foo, bar };

const plugins = [
    () => ({
        visitor: {
            Identifier(path) {
                if (path.isIdentifier({ name: 'foo' })) 
                    path.node.name = 'bar';
            },
        },
    })
];

const test = avaBabel(plugins, scope);

test('`foo()` should be turned to `bar()`', (t, code) => {
    t.is(foo(), 'bar');
    t.log(code);
})