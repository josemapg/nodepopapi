'use strict'

// ---------------------------------- Local source code
import BaseRouter, {
  sortDir,
  operators
} from 'libs/BaseRouter'
import AdsController from './AdsController'
import logger from 'config/logger'
import {
  errorCodes,
  RouteNotImplementedError
} from 'errors'
import {
  query
} from 'express-validator/check'

/**
 * List of properties
 */
const _properties = [
  'name',
  'onsale',
  'price'
]

/**
 *
 */
const _adsChainValidations = [
  query('skip')
    .optional().isInt().withMessage('NotValid').toInt(),
  query('top')
    .optional().isInt().withMessage('NotValid').toInt(),
  query('onsale')
    .optional().isBoolean().withMessage('NotValid'),
  query('sort')
    .optional().isIn(_properties).withMessage('NotValid'),
  query('sortDir')
    .optional().isIn(sortDir).withMessage('NotValid'),
  query('price')
    .optional().isFloat().withMessage('NotValid').toFloat(),
  query('priceLow')
    .optional().isFloat().withMessage('NotValid').toFloat(),
  query('priceHigh')
    .optional().isFloat().withMessage('NotValid').toFloat(),
  query('priceOp')
    .optional().isIn(operators).withMessage('NotValid')
]

/**
 * Ads Protected Routes
 */
class AdsProtectedRoutes extends BaseRouter {
  /**
   *
   */
  configureRoutes () {
    const adsController = new AdsController()

    this.routes.route('/').all(_adsChainValidations, this._validationResultChain.bind(this),
      async (req, res, next) => {
        logger.debug(`Beginning ${this.constructor.name} ${req.baseUrl}`)

        try {
          switch (req.method) {
            case 'GET':
              logger.debug(`Beginning ${this.constructor.name}[${req.method}] ${req.baseUrl}`)
              // Ejecutar la búsqueda
              const ads = await adsController.find(req, res)
              res.json(ads)
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

  prepareFieldForTranslation (fieldName) {
    let fieldNamePrefixed = this.prepareFieldForTranslationNoPrefix(fieldName)
    if (!fieldNamePrefixed) {
      fieldNamePrefixed = `keyAds${fieldName}`
    }
    return fieldNamePrefixed
  }
}

export default AdsProtectedRoutes
