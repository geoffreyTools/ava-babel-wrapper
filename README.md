# ava-babel-wrapper

Dead simple wrapper for testing the behaviour of babel plugins with AVA.

## How to use
All you need to do is 
- import the factory
- feed it with your plugin
- use the returned function as usual
```javascript
const avaBabel = require('ava-babel-wrapper');
const plugin = require('../dist/your-plugin.js');
const foo = require('../path/to/foo.js');

const pluginConfig = { someOption: true };

const plugins = [[plugin, pluginConfig]]

/* if you wan to share variables in your tests,
   you will have to place them there.
*///                              ↓
const test = avaBabel(plugins, { foo });

/* The babel output is accessible there.
*///                                ↓
test('$ should do something', (t, output) => {
    const barfoo = $(foo);
    t.is(barfoo, 'something was done !');
    t.log(output);
})
```

Compile-time errors can be caught and tested as well

```javascript
test('should fail at compile time', 
    t => {
        */ code expected to cause a compile error */
    },
    (t, json) => {
        const {type, message} = JSON.parse(json);
        t.is(type, 'compile-time error');
        t.is(message, 'some error message');
    }
);
```

run-time and compile-time errors will be reported by AVA like so

```javascript
test('Should fail at run time', 
    t => {
        throw "blow up !";
    }
);
```
Default reporter output: 
```
  Suite › Should fail at run time

  {
    "type": "run-time error",
    "message": "blow up !",
    "babelOutput": "
          throw \"blow up !\";"
  }

  › log (ava-babel-wrapper.js:47:27)
  › ava-babel-wrapper.js:96:9

  ─

  1 test failed
```
The stack trace won't help you but I didn't find it to be an issue.