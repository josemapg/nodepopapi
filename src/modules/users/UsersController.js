'use strict'

// ---------------------------------- Local source code
import UsersModel from './UsersModel'
import UsersFacade from './UsersFacade'
import BaseController from 'libs/BaseController'
import logger from 'config/logger'
import {
  errorCodes,
  UserRegistrationError
} from 'errors'

// ---------------------------------- Class: Private members

/**
 *
 */
class UsersController extends BaseController {
  constructor () {
    super(UsersModel)
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   */
  async registerUser (req, res) {
    logger.debug(`Beginning ${this.constructor.name}[${this.registerUser.name}] ${req.baseUrl}`)

    // Extraer user, email, and other parameter and
    const { user: newUser, plainPasswd } = this._getUserFromReq(req)
    // Removing passwd from literal object to avoid trace in logs
    const newUserString = JSON.stringify(newUser)

    logger.info(`Executing registration for the following user: ${newUserString}`)
    let newUserCreated = {}
    try {
      const userFacade = new UsersFacade()
      newUserCreated = await userFacade.registerUser(newUser, plainPasswd)
      logger.info(`The following user has been regstered  User(# user: 1,\n ${newUserString}\n)`)
    } catch (err) {
      const newError = new UserRegistrationError({
        message: `✘ Unable to create new user with ${newUserString}`,
        error: err,
        internalErrorStatus: errorCodes.userRegistrationError,
        params: {
          email: (newUser) ? newUser.email : ''
        }
      })
      throw newError
    }

    logger.debug(`Finishing ${this.constructor.name}[${this.registerUser.name}] ${req.baseUrl}`)

    return newUserCreated
  }

  _getUserFromReq (req) {
    return {
      user: {
        name: req.body.data.name,
        email: req.body.data.email
      },
      plainPasswd: req.body.data.passwd
    }
  }
}

export default UsersController
