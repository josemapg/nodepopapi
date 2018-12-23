'use strict'

// ---------------------------------- Local source code
import RethrownError from 'libs/errors'

/**
 * Wrap error for Nodepop application
 */
class NodepopErrorRethrow extends RethrownError {
  constructor ({ message, error, internalErrorStatus, params }) {
    super(message, error)
    // Maintain the most specific error
    this.internalErrorStatus = (error.internalErrorStatus) ? error.internalErrorStatus : internalErrorStatus
    this.params = params
  }
}

/**
 * Wrap error for Nodepop application
 */
class NodepopError extends Error {
  constructor ({
    message,
    internalErrorStatus,
    params
  }) {
    super(message)
    this.internalErrorStatus = internalErrorStatus
    this.params = params
  }
}

/**
 * MongoDb connection errors
 */
class MongoDbConnectionError extends NodepopErrorRethrow {}

/**
 * MongoDb reconnection errors
 */
class MongoDbReconnectionError extends NodepopError { }

/**
 * Route not found errors
 */
class RouteNotFoundError extends NodepopError { }

/**
 * API method not implemented
 */
class RouteNotImplementedError extends NodepopError {}

/**
 * Unathourized error
 */
class HttpUnauthorizedError extends NodepopError {}

/**
 * Error finding ads by query
 */
class AdsFindError extends NodepopErrorRethrow { }

/**
 * Error registering an user
 */
class UserRegistrationError extends NodepopErrorRethrow {}

/**
 * Error registering an user
 */
class UserRegistrationDuplicateEmailError extends NodepopError {}

/**
 * Error missing data
 */
class InputParamNotValidError extends NodepopError {}

export default NodepopError

export {
  MongoDbConnectionError,
  MongoDbReconnectionError,
  RouteNotFoundError,
  RouteNotImplementedError,
  HttpUnauthorizedError,
  AdsFindError,
  UserRegistrationError,
  UserRegistrationDuplicateEmailError,
  InputParamNotValidError
}
