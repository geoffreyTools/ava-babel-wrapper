const input = 'src/index.js';

const es6 = {
    file: 'dist/ava-babel-wrapper.mjs',
    sourcemap: true,
    format: 'es'
}

const commonJS = {
    file: 'dist/ava-babel-wrapper.js',
    exports: 'default',
    sourcemap: true,
    format: 'cjs'
};

export default {
    input,
    output: [es6, commonJS],
    external: ['@babel/core', 'ava'],
};
