export default ({ params, max }) => {
    if (params.length > max) {
        const n = params.length;
        const list = params.map(x => `"${x}"`).join(', ');
        throw Error(`test function expected a maximum of ${max} arguments, got ${n}: ${list}`);
    }
};
