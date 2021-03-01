export default (ErrorMessage, { execute, reject }) => result => {
    try {
        execute(result.code);
    } catch (error) {
        reject(ErrorMessage({ type: 'run-time', result, error }));
    }
}
