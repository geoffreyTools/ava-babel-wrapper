export default (ErrorMessage, { reject }) => error =>
    reject(ErrorMessage({ type: 'compile-time', error }))
;