'use strict'

class ExtendedError extends Error {
  constructor (message) {
    super(message)
    this.name = this.constructor.name
    this.message = message
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this)
    } else {
      this.stack = (new Error(message)).stack
    }
  }
}

export default ExtendedError
