'use strict'

// ---------------------------------- Local source code
import logger from 'config/logger'

/**
 *
 */
class MongooseDAO {
  constructor (Model) {
    this.Model = Model
  }

  async create (...args) {
    const createdModel = await new this.Model(...args).save()

    logger.debug(`${this.constructor.name} - ${this.create.name}  created Obj(\n${createdModel}\n)`)

    return createdModel
  }

  async find (...args) {
    const objs = await this.Model
      .find(...args)
      .exec()

    logger.debug(`${this.constructor.name} - ${this.find.name} retrieved Objs(# objs: ${objs.length},\n ${objs}\n)`)

    return objs
  }

  async findOne (...args) {
    const obj = await this.Model
      .findOne(...args)
      .exec()

    logger.debug(`${this.constructor.name} - ${this.findOne.name} retrieved Obj(\n ${obj}\n)`)

    return obj
  }
}

export default MongooseDAO
