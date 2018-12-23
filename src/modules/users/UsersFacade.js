'use strict'

// ---------------------------------- Local source code
import UsersModel from './UsersModel'
import BaseFacade from 'libs/BaseFacade'
import PasswordHelper from 'libs/PasswordHelper'
import config from 'config/settings'
import logger from 'config/logger'
import {
  errorCodes,
  UserRegistrationDuplicateEmailError
} from 'errors'

/**
 *
 */
class UsersFacade extends BaseFacade {
  constructor () {
    super(UsersModel)
  }

  async registerUser (newUser, plainPassword, returnPasswd = false) {
    logger.debug(`Beginning ${this.constructor.name}[${this.registerUser.name}] ${newUser.email}`)

    // Validate not using a duplicate email
    const userWithSameEmail = await this.getUserByEmail(newUser.email, returnPasswd = false)
    if (userWithSameEmail) {
      const newError = new UserRegistrationDuplicateEmailError({
        message: `✘ Duplicate email ${newUser.email}`,
        internalErrorStatus: errorCodes.userRegistrationDuplicateEmailError,
        params: {
          email: newUser.email
        }
      })
      throw newError
    }

    // Create hashed password based on plain passwrod received
    const passwdHelper = new PasswordHelper()
    const passwdHashed = await passwdHelper.generatePassword({
      password: plainPassword,
      bcryptSaltRounds: config.bcryptSaltRounds
    })
    logger.info('New hashed password generated')

    // Create new UserModel based on received data
    const newUserModel = this._getUserModelFromObject(newUser, passwdHashed)

    // Register user in database
    const newUserModelCreated = await this.create(newUserModel)
    const newUserCreated = this._getObjectFromModel(newUserModelCreated, returnPasswd = false)

    logger.debug(`Finishing ${this.constructor.name}[${this.registerUser.name}] ${newUser.email}`)

    return newUserCreated
  }

  async getUserByEmail (userEmail, returnPasswd = false) {
    const userModel = await this.findOne({ email: userEmail })
    const user = this._getObjectFromModel(userModel, returnPasswd)
    return user
  }

  _getUserModelFromObject (newUser, passwdHashed) {
    // Change to use object spread operator
    return new UsersModel({
      name: newUser.name,
      email: newUser.email,
      passwd: passwdHashed
    })
  }

  _getObjectFromModel (userModel, returnPasswd = false) {
    let user
    if (userModel) {
      user = {}
      Object.assign(user, userModel._doc)
      if (!returnPasswd) {
        delete user.passwd
      }
      delete user.__v
    }
    return user
  }
}

export default UsersFacade
