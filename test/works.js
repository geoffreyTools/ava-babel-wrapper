import avaBabel from 'ava-babel-wrapper';

const plugin = () => ({
    visitor: {
        Identifier(path) {
            if (path.isIdentifier({ name: 'foo' })) 
                path.node.name = 'bar';
            else if (path.isIdentifier({ name: 'baz' }))
                throw new Error('baz is a forbidden identitifer')
        },
    },
});

const foo = 0;
const bar = 1;

const test = avaBabel([plugin], { foo, bar });

test('foo should be turned to bar', (t, code) => {
    t.is(foo, bar);
    t.log(code);
});

test('identifier `baz` should throw', 
    t => {
        const baz = 'baz';
    }, (t, json) => {
        const { type, message } = JSON.parse(json);
        t.is(type, 'compile-time error');
        t.is(message, 'unknown: baz is a forbidden identitifer');
    }
);

test.todo('some test to be written later');

test.skip('some test to be skipped', t => {
    t.not(foo, 42);
});

test.failing('should fail', (t, code) => {
    t.is(foo, 'foo');
})

test.serial('should come 1st', (t, code) => {
    t.is(foo, bar);
});

test.serial('should come 2nd', (t, code) => {
    t.is(foo, bar);
});

test.serial('should come 3rd', (t, code) => {
    t.is(foo, bar);
});

// test.only('should be the only test run', (t, code) => {
//    t.is(foo, bar);
// });
