'use strict'

// ---------------------------------- Local source code
import AdsModel from './AdsModel'
import AdsFacade from './AdsFacade'
import BaseController from 'libs/BaseController'
import logger from 'config/logger'
import {
  errorCodes,
  AdsFindError
} from 'errors'

/**
 *
 */
class AdsController extends BaseController {
  constructor () {
    super(AdsModel)
  }

  async find (req, res) {
    logger.debug(`Beginning ${this.constructor.name}[${this.find.name}] ${req.baseUrl}`)

    // Retrieve pagination from query skip & top parameteres
    const { skip, limit, sort } = this._getPaginationFromReq(req)
    const sortString = JSON.stringify(sort)
    logger.info(`Execute find using the following query: skip => ${skip}, top => ${limit}, sort => ${sortString}`)

    // TODO: Add rest of input parameters
    // Retrieve query
    const query = this._getQueryFromReq(req)
    const queryString = JSON.stringify(query)
    logger.info(`Execute find using the following query: ${queryString}`)

    let ads = []
    try {
      const adsFacade = new AdsFacade()
      ads.push(await adsFacade.find(query, null, { skip, limit, sort }))
      logger.info(`find retrieves Ads(# ads: ${ads.length},\n ${ads}\n)`)
    } catch (err) {
      const newError = new AdsFindError({
        message: `✘ Ads find is not able to retrieve data using ${queryString}`,
        error: err,
        internalErrorStatus: errorCodes.adsFindError,
        params: {
          query: queryString
        }
      })
      throw newError
    }

    logger.debug(`Finishing ${this.constructor.name}[${this.find.name}] ${req.baseUrl}`)

    return ads
  }

  _getQueryFromReq (req) {
    // Get price filter
    const { filter: priceFilter, filterOn: priceFilterOn } =
      this._getNumericFilter(req.query.price, req.query.priceLow, req.query.priceHigh, req.query.priceOp)

    let query = {
      onsale: req.query.onsale,
      price: (priceFilterOn) ? priceFilter : undefined
    }

    // Remove all properties with undefined
    Object.keys(query).forEach(key => query[key] === undefined ? delete query[key] : '')

    return query
  }
}

export default AdsController
