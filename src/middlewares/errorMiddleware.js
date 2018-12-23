'use strict'

// ---------------------------------- Local source code
import config from 'config/settings'
import { errorCodes } from 'errors'
import logger from 'config/logger'

const errorMiddleware = () => {
  return (err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.internalError = {
      httpStatus: (err.internalErrorStatus) ? err.internalErrorStatus.httpStatus : errorCodes.unknownError.httpStatus,
      message: err.message || req.translate(errorCodes.unknownError.msgKey),
      userMessage: req.translate((err.internalErrorStatus) ? err.internalErrorStatus.msgKey : errorCodes.unknownError.msgKey, err.params),
      code: (err.internalErrorStatus) ? err.internalErrorStatus.internalCode : errorCodes.unknownError.internalCode,
      stack: config.environment === 'dev' ? `${err.stack}` : {}
    }

    // logging error
    logger.error(`(code=${res.locals.internalError.code}, httpStatus=${res.locals.internalError.httpStatus}) ${res.locals.internalError.stack}`)

    // if 401 is httpStatus then add realm
    if (res.locals.internalError.httpStatus === 401) {
      res.set('WWW-Authenticate', 'Basic realm=Nopepop')
    }

    // render the error page
    res.status(res.locals.internalError.httpStatus)
    if (res.locals.internalError.httpStatus !== 401) {
      res.json({
        code: res.locals.internalError.code,
        type: 'E',
        message: res.locals.internalError.userMessage,
        stack: res.locals.internalError.stack
      })
    } else {
      res.json()
    }
  }
}

export default errorMiddleware
