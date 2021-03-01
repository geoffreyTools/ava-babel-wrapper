import failure from './results/Failure.js'
import success from './results/Success.js'

export default ErrorMessage => descriptor =>
    ({ success, failure })[descriptor.type](ErrorMessage, descriptor)
;
