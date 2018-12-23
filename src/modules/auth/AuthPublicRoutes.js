'use strict'

// ---------------------------------- Local source code
import BaseRouter from 'libs/BaseRouter'
import AuthController from './AuthController'
import logger from 'config/logger'
import {
  errorCodes,
  RouteNotImplementedError
} from 'errors'

/**
 * Auth Public Routes
 */
class AuthPublicRoutes extends BaseRouter {
  /**
   *
   */
  configureRoutes () {
    const authController = new AuthController()

    this.routes.route('/token').all(
      async (req, res, next) => {
        logger.debug(`Beginning ${this.constructor.name} ${req.baseUrl}`)

        try {
          switch (req.method) {
            case 'GET':
              logger.debug(`Beginning ${this.constructor.name}[${req.method}] ${req.baseUrl}`)
              // Ejecutar la creación del usuario
              const token = await authController.auth(req, res)
              res.status(200).json(token)
              logger.debug(`Finishing ${this.constructor.name}[${req.method}] ${req.baseUrl}`)
              break
            default:
              const newNotImplementedError = new RouteNotImplementedError({
                message: `Not implemented method ${req.route.method} for ${req.baseUrl} route`,
                internalErrorStatus: errorCodes.notImplemented
              })
              next(newNotImplementedError)
              break
          }
        } catch (err) {
          next(err)
        }

        logger.debug(`Finishing ${this.constructor.name} ${req.baseUrl}`)
      })
  }
}

export default AuthPublicRoutes
