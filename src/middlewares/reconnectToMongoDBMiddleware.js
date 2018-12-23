'use strict'

const reconnectToMongoDBMiddleware = (conndb) => {
  return async (req, res, next) => {
    try {
      await conndb.tryToReconnect()
      next()
    } catch (err) {
      next(err)
    }
  }
}

export default reconnectToMongoDBMiddleware
