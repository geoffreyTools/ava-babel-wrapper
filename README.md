# ava-babel-wrapper

Test your Babel plugin's behaviour with AVA, including compile-time errors, and log the transpiled code for debugging.

## How to install

```
npm install --save-dev https://github.com/geoffreyTools/ava-babel-wrapper.git
```

ava-babel-wrapper has a dependency on `ava` and `@babel/core` so make sure you have them installed.

```
npm install --save-dev ava @babel/core
```

## How to use
### 1) Import the wrapper factory
```javascript
import avaBabel from 'ava-babel-wrapper';
```
### 2) Feed it with your plugin
It will give you back your familiar `test` function.
```javascript
import plugin from '../src/index.js';
const pluginConfig = { someOption: true };
const test = avaBabel([[plugin, pluginConfig]]);
```
Globals are no longer accessible from within the test callbacks, but you can achieve the same effect by passing an object as a second argument to the factory.
```javascript
const foo = 0;
const bar = 1;
const test = avaBabel(plugins, { foo, bar });
```

### 3) Test your plugin
```javascript
test('foo should be turned to bar', t => {
    t.is(foo, bar);
})

test.todo('some test to be written later');

test.skip('some test to be skipped', t => {
    t.not(foo, 42);
});
```
The callback provides an additional parameter for accessing the babel plugin output.
```javascript
test('foo should be turned to bar', (t, output) => {
    t.is(foo, bar);
    t.log(output);
})
```
The output will be:
```
    t.is(bar, bar);
    t.log(output);
```

Only some functions have their callback transpiled:
- `test`
- `test.failing`
- `test.only`
- `test.serial`

`test.cb` is not yet supported.

## Compile-time errors
Compile-time errors can be caught and tested via a second callback.

```javascript
test('identifier `baz` should throw', 
    t => {
        const baz = 3;
    }, (t, json) => {
        const { type, message } = JSON.parse(json);
        t.is(type, 'compile-time error');
        t.is(message, 'unknown: baz is a forbidden identitifer');
    }
);
```

Unhandled run-time and compile-time errors will be reported by AVA as shown bellow.

```javascript
test('should fail at run time', 
    t => {
        throw "blow up !";
    }
);
```
```
Suite › should fail at run time

{
"type": "run-time error",
"message": "blow up !",
"babelOutput": "
        throw \"blow up !\";"
}

› log (node_modules/ava-babel-wrapper/src/index.js:23:27)
› node_modules/ava-babel-wrapper/src/index.js:50:5

─

1 test failed
```
The stack trace won't help you but I didn't find it to be an issue.

## Test coverage analysis and mutation testing
If you want to do any one of these, passing the plugin directly as described before will not work:

```javascript
import plugin from '../src/index.js';
const test = avaBabel([plugin]);
```
The plugin package needs to be in your `node-modules` folder and referenced like so (assuming it is called "babel-plugin-foo"):

```javascript
const test = avaBabel(['foo']);
```
In order to keep your tests and plugin in the same package, you can place a link pointing to the package in the `node_modules` folder. There is no need to change your `package.json`.


In the code bellow, we create a symlink, run a test coverage analysis with nyc and AVA and delete the symlink immediately after so as to keep the `node_modules` folder clean:
```
ln -s ../ node_modules/babel-plugin-foo && nyc ava && rm ./node_modules/babel-plugin-foo
```