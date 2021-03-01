import { stringify } from '../utils'


export default({ result, error }) => stringify({
    type: 'run-time error',
    message: error.message || error,
    babelOutput: result.code
});
