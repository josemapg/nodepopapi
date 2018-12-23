'use strict'

// ---------------------------------- Local source code
import ExtendedError from './ExtendedError'

class RethrownError extends ExtendedError {
  constructor (message, error) {
    super(message)
    if (!error) throw new Error('RethrownError requires a message and error')
    let messageLines = (this.message.match(/\n/g) || []).length + 1
    this.stack = this.stack.split('\n').slice(0, messageLines + 1).join('\n') + '\n' +
      error.stack
  }
}

export default RethrownError
