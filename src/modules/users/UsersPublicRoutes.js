'use strict'

// ---------------------------------- Validate input data form request
import {
  body
} from 'express-validator/check'

// ---------------------------------- Local source code
import BaseRouter from 'libs/BaseRouter'
import UsersController from './UsersController'
import logger from 'config/logger'
import {
  errorCodes,
  RouteNotImplementedError
} from 'errors'

/**
 *
 */
const _objectRestrictions = {
  passwd: {
    min: 5
  }
}

/**
 *
 */
const _userChainValidations = [
  body('data.name')
    .exists().withMessage('MissingData')
    .isLength({ min: 1 }).withMessage('MissingData'),
  body('data.email')
    .exists().withMessage('MissingData')
    .isLength({ min: 1 }).withMessage('MissingData')
    .isEmail().withMessage('NotValid'),
  body('data.passwd')
    .exists().withMessage('MissingData')
    .isLength({
      min: _objectRestrictions.passwd.min
    }).withMessage('TooShort')
]

/**
 * Ads Protected Routes
 */
class UsersPublicRoutes extends BaseRouter {
  /**
   *
   */
  configureRoutes () {
    const usersController = new UsersController()

    this.routes.route('/register').all(_userChainValidations, this._validationResultChain.bind(this),
      async (req, res, next) => {
        logger.debug(`Beginning ${this.constructor.name} ${req.baseUrl}`)

        try {
          switch (req.method) {
            case 'POST':
              logger.debug(`Beginning ${this.constructor.name}[${req.method}] ${req.baseUrl}`)
              // Ejecutar la creación del usuario
              const createdUser = await usersController.registerUser(req, res)
              res.status(201).json(createdUser)
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

  prepareFieldForTranslation (field) {
    return `keyUser${field}`
  }

  get objsRestrictions () {
    return _objectRestrictions
  }
}

export default UsersPublicRoutes
