import parse from './parse';
import validate from './validate';
import command from './command';

export default (func, scope) => {
    const [params, body] = parse(func);
    validate({ params, max: 2 });
    return { command: command(params, scope), body, params };
};
