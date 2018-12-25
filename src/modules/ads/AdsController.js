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
    logger.info(`Execute ${this.find.name} using the following query: skip => ${skip}, top => ${limit}, sort => ${sortString}`)

    // Retrieve query
    const query = this._getQueryFromReq(req)
    const queryString = JSON.stringify(query)
    logger.info(`Execute ${this.find.name} using the following query: ${queryString}`)

    let ads = []
    try {
      const adsFacade = new AdsFacade()
      ads.push(await adsFacade.find(query, null, { skip, limit, sort }))
      logger.info(`${this.find.name} retrieves Ads(# ads: ${ads.length},\n ${ads}\n)`)
    } catch (err) {
      const newError = new AdsFindError({
        message: `✘ Ads ${this.find.name} is not able to retrieve data using ${queryString}`,
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

  async findTags (req, res) {
    logger.debug(`Beginning ${this.constructor.name}[${this.findTags.name}] ${req.baseUrl}`)

    logger.info(`Execute ${this.findTags.name}, getting all ads`)

    let tags = []
    try {
      const adsFacade = new AdsFacade()

      // Get all data in ads
      const ads = await adsFacade.find()

      // Extract ads from ads
      tags =
        ads.map((value, index, array) => {
          return value.tags
        }).reduce((array1, array2) => {
          console.log(array1)
          console.log(array2)
          return array1.concat(array2)
        }, [])

      // Remove duplicates
      tags = Array.from(new Set(tags)).sort()

      logger.info(`${this.findTags.name} retrieves Tags(# tags: ${tags.length},\n ${tags}\n)`)
    } catch (err) {
      const newError = new AdsFindError({
        message: `✘ Ads ${this.find.name} is not able to retrieve data`,
        error: err,
        internalErrorStatus: errorCodes.adsFindError
      })
      throw newError
    }

    logger.debug(`Finishing ${this.constructor.name}[${this.findTags.name}] ${req.baseUrl}`)

    return tags
  }

  _getQueryFromReq (req) {
    // Get price filter
    const { filter: priceFilter, filterOn: priceFilterOn } =
      this._getFilter({ value: req.query.price, valueLow: req.query.priceLow, valueHigh: req.query.priceHigh, operator: req.query.priceOp })

    // Get tags filer
    const { filter: tagsFilter, filterOn: tagsFilterOn } =
      this._getFilter({ value: req.query.tags })

    let query = {
      onsale: req.query.onsale,
      price: (priceFilterOn) ? priceFilter : undefined,
      tags: (tagsFilterOn) ? tagsFilter : undefined,
      name: (req.query.name) ? new RegExp(`^${req.query.name}`, 'i') : undefined
    }

    // Remove all properties with undefined
    Object.keys(query).forEach(key => query[key] === undefined ? delete query[key] : '')

    return query
  }
}

export default AdsController
