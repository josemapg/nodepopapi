'use strict'

// ---------------------------------- Local source code
import {
  errorCodes,
  RouteNotFoundError
} from 'errors'
import BaseRouter from './libs/BaseRouter/BaseRouter'

/**
 * Global Router
 */
class FallbackErrorRoutes extends BaseRouter {
  /**
   *
   */
  configureRoutes () {
    this.routes.route('*').get((req, res, next) => {
      const newError = new RouteNotFoundError({
        message: `Path ${req.baseUrl} not matching`,
        internalErrorStatus: errorCodes.resourceNotFound
      })
      next(newError)
    })
  }
}

export default FallbackErrorRoutes
