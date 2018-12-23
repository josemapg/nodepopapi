'use strict'

// ---------------------------------- Local source code
import AdsModel from './AdsModel'
import BaseFacade from 'libs/BaseFacade'

/**
 *
 */
class AdsFacade extends BaseFacade {
  constructor () {
    super(AdsModel)
  }
}

export default AdsFacade
