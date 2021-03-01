import CompileError from './CompileError';
import RuntimeError from './RuntimeError';

export default descriptor =>
  ({'compile-time': CompileError,
    'run-time': RuntimeError
  })[descriptor.type](descriptor)
;
