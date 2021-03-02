import failure from './Failure.js'
import success from './Success.js'

export default ErrorMessage => descriptor =>
    ({ success, failure })[descriptor.type](ErrorMessage, descriptor)
;
