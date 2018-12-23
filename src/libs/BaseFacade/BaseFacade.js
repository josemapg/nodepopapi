'use strict'

// ---------------------------------- Local source code
import MongooseDAO from 'libs/MongooseDAO'

// ---------------------------------- Class: Private members

/**
 * App express instance
 */
const _dao = new WeakMap()

class BaseFacade {
  constructor (Model) {
    _dao.set(this, new MongooseDAO(Model))
  }

  async create (...args) {
    const { dao } = this._getMembers()
    const createdObj = await dao.create(...args)
    return createdObj
  }

  async find (...args) {
    const { dao } = this._getMembers()
    const objs = await dao.find(...args)
    return objs
  }

  async findOne (...args) {
    const {
      dao
    } = this._getMembers()
    const obj = await dao.findOne(...args)
    return obj
  }

  get dao () {
    return _dao.get(this)
  }

  // findById(req, res, next) {
  //   return this.facade.findById(req.params.id)
  //     .then((doc) => {
  //       if (!doc) {
  //         return res.sendStatus(404)
  //       }
  //       return res.status(200).json(doc)
  //     })
  //     .catch(err => next(err))
  // }

  /**
   *
   */
  _getMembers () {
    const dao = _dao.get(this)

    return {
      dao
    }
  }
}

export default BaseFacade
