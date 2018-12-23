'use strict'

// ---------------------------------- Local source code
import config from 'config/settings'
import logger from 'config/logger'
import JWTHelper from 'libs/JWTHelper'
import {
  errorCodes,
  HttpUnauthorizedError
} from 'errors'

const validateJWTMiddleware = () => {
  return async (req, res, next) => {
    try {
      // Validate token received
      logger.info('Validating given JWT')
      const jwt = new JWTHelper({
        jwtSecret: config.authTokens.jwtSecret,
        jwtExpireIn: config.authTokens.jwtExpireIn
      })
      const decodedToken = await jwt.validateAccessTokenJWT(req.query.token)
      const decodedTokenString = JSON.stringify(decodedToken)
      logger.info(decodedTokenString)
      next()
    } catch (err) {
      logger.error(err)
      const newError = new HttpUnauthorizedError({
        message: `Error: ✘ User not authorized`,
        internalErrorStatus: errorCodes.Unauthorized
      })
      next(newError)
    }
  }
}

export default validateJWTMiddleware
