import avaBabel from 'ava-babel-wrapper';

const plugin = () => ({
    visitor: {
        Identifier(path) {
            if (path.isIdentifier({ name: 'foo' }))
                path.node.name = 'bar';
            else if (path.isIdentifier({ name: 'baz' }))
                throw path.buildCodeFrameError('baz is a forbidden identitifer');
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

test('identifier `baz` should throw at compile-time', () => {
    const baz = 'baz';
});

test('caught: identifier `baz` should throw at compile-time',
    () => {
        const baz = 'baz';
    }, (t, json) => {
        const { type, message, codeFrame } = JSON.parse(json);
        t.is(type, 'compile-time error');
        t.is(message, 'baz is a forbidden identitifer');
        t.log(codeFrame)
    }
);

test('should throw at runtime', () => {
    if (true) {
        throw new Error('some error')
    }
});

test('caught: should throw at runtime',
    () => {
        if (true) {
            throw new Error('some error')
        }
    }, (t, json) => {
        const { type, message, babelOutput } = JSON.parse(json);
        t.is(type, 'run-time error');
        t.is(message, 'some error');
        t.log(babelOutput)
    }
);

test.todo('some test to be written later');

test.skip('some test to be skipped', t => {
    t.not(foo, 42);
});

test.failing('should fail', t => {
    t.is(foo, 'foo');
})

test.serial('should come 1st', t => {
    t.is(foo, bar);
});

test.serial('should come 2nd', t => {
    t.is(foo, bar);
});

test.serial('should come 3rd', t => {
    t.is(foo, bar);
});

// test.only('should be the only test run', t => {
//    t.is(foo, bar);
// });
