'use strict'

import logger from 'config/logger'

/**
 *
 */
class BaseController {
  /**
   * @param {*} req
   */
  _getPaginationFromReq (req) {
    // Calculate sorting
    let sortObject
    if (req.query.sort) {
      sortObject = {}
      sortObject[req.query.sort] = (req.query.sortDir === 'desc') ? -1 : 1
    }

    let resultConfig = {
      skip: req.query.skip || 0,
      limit: req.query.top || null,
      sort: sortObject
    }

    // Remove all properties with undefined
    Object.keys(resultConfig).forEach(key => resultConfig[key] === undefined ? delete resultConfig[key] : '')

    return resultConfig
  }

  _getFilter ({ value, valueLow, valueHigh, operator }) {
    let filterOn = false
    let filter
    let operatorFilter

    if (value) {
      // Give priority single operator if value exists
      if ((!operator) || (operator === 'between')) {
        operatorFilter = '$eq'
      } else {
        operatorFilter = `$${operator}`
      }
      filter = {}
      filter[operatorFilter] = value
      filterOn = true
    } else if (valueLow !== undefined && valueHigh !== undefined && (!operator || operator === 'between')) {
      // Between operations
      filter = { '$gte': valueLow, '$lte': valueHigh }
      filterOn = true
    }

    logger.warn(filter)
    logger.warn(filterOn)

    return { filter, filterOn }
  }
}

export default BaseController
