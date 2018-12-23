'use strict'

// ---------------------------------- Extract BASIC credential from request
import basicAuth from 'basic-auth'

// ---------------------------------- Local source code
import AuthFacade from './AuthFacade'
import BaseController from 'libs/BaseController'
import logger from 'config/logger'
import {
  errorCodes,
  HttpUnauthorizedError
} from 'errors'
import config from 'config/settings'
import JWTHelper from 'libs/JWTHelper'

/**
 *
 */
class AuthController extends BaseController {
  async auth (req, res) {
    logger.debug(`Beginning ${this.constructor.name}[${this.auth.name}] ${req.baseUrl}`)

    let accessToken
    try {
      // Extract credentials
      const {
        name: email,
        pass: passwd
      } = basicAuth(req)

      // Check credentials
      const authFacade = new AuthFacade()
      await authFacade.checkUserPassword({ email, passwd })

      // Generate a token to use in the rest of the API
      logger.info('Generating a new JWT to use as access token')
      const jwt = new JWTHelper({
        jwtSecret: config.authTokens.jwtSecret,
        jwtExpireIn: config.authTokens.jwtExpireIn
      })
      accessToken = await jwt.generateJWTForAccessToken({ userId: email })
      logger.debug(`JWT generated: ${accessToken}`)
    } catch (err) {
      logger.error(err)
      const newError = new HttpUnauthorizedError({
        message: `Error: ✘ User not authorized`,
        internalErrorStatus: errorCodes.Unauthorized
      })
      throw newError
    }

    logger.debug(`Finishing ${this.constructor.name}[${this.auth.name}] ${req.baseUrl}`)

    return {
      accessToken: `${accessToken}`
    }
  }
}

export default AuthController
