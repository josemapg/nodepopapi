'use strict'

// ---------------------------------- Route Middleware
import {
  Router
} from 'express'

// ---------------------------------- Validate input data form request
import {
  validationResult
} from 'express-validator/check'

// ---------------------------------- Local source code
import {
  errorCodes,
  InputParamNotValidError
} from 'errors'

/**
 * Sort direction array elements
 */
const sortDir = ['asc', 'desc']

/**
 *
 */
const operators = [
  'gt',
  'gte',
  'lt',
  'lte',
  'between',
  'eq'
]

/**
 *
 */
const _generalObjectRestrictions = {
  skip: {
    noTranslate: true
  },
  top: {
    noTranslate: true
  },
  sort: {
    noTranslate: true
  },
  sortDir: {
    noTranslate: true
  }
}

// ---------------------------------- Class: Private members

/**
 * Routes protected
 */
const _routes = new WeakMap()

/**
 * Base Router
 */
class BaseRouter {
  /**
   * Router initializer
   */
  constructor () {
    // Create a new middleware object
    _routes.set(this, new Router())
    // Configure routes
    this.configureRoutes()
  }

  /**
   *
   */
  configureRoutes () {
    throw new Error('configureRoutes is not implemented')
  }

  /**
   *
   */
  prepareFieldForTranslationNoPrefix (fieldName) {
    let fieldNameResult
    if (fieldName === 'skip' || fieldName === 'top' || fieldName === 'sort' || fieldName === 'sortDir') {
      fieldNameResult = fieldName
    }
    return fieldNameResult
  }

  /**
   *
   */
  get routes () {
    return _routes.get(this)
  }

  _validationResultChain (req, res, next) {
    const error = validationResult(req)
    if (!error.isEmpty()) {
      const errorInfo = error.array({
        onlyFirstError: true
      })[0]

      // If something goes wrong then send an unknownError,
      // but using the specific InputParameter clkass
      let internalErrorStatus = errorCodes.unknownError
      switch (errorInfo.msg) {
        case 'MissingData':
          internalErrorStatus = errorCodes.objMissingDataError
          break
        case 'NotValid':
          internalErrorStatus = errorCodes.objNotValidDataError
          break
        case 'TooShort':
          internalErrorStatus = errorCodes.objTooShortDataError
          break
      }

      // Get not valid field name to attach to the message
      const errorField = errorInfo.param.split('.')[1] || errorInfo.param.split('.')[0]

      // Generic restrictions management
      let objRestrictions
      if (this.objsRestrictions) {
        objRestrictions = this.objsRestrictions[errorField]
      }
      if (!objRestrictions) {
        objRestrictions = _generalObjectRestrictions[errorField] || {}
      }

      // Prepare message translation
      const capitalizeErrorField = errorField.charAt(0).toUpperCase() + errorField.slice(1)
      let errorFieldName = errorField
      if (!objRestrictions.noTranslate) {
        errorFieldName = req.translate(this.prepareFieldForTranslation(capitalizeErrorField))
      }

      const newError = new InputParamNotValidError({
        message: `✘ Invalid input params`,
        internalErrorStatus: internalErrorStatus,
        params: {
          field: errorFieldName,
          minLength: objRestrictions.min
        }
      })
      next(newError)
    }

    next()
  }
}

export default BaseRouter

export {
  operators,
  sortDir
}
