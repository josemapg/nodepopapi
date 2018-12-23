'use strict'

// ---------------------------------- Local source code
import BaseFacade from 'libs/BaseFacade'
import UsersFacade from 'modules/users/UsersFacade'
import PasswordHelper from 'libs/PasswordHelper'
import NodepopError from '../../errors/Errors'
import logger from 'config/logger'

/**
 *
 */
class AuthFacade extends BaseFacade {
  async checkUserPassword ({ email, passwd }) {
    try {
      // Check credentials exists
      if (email && passwd) {
        logger.info('email & password are not empty')

        // Get users by email
        const usersFacade = new UsersFacade()
        const returnPasswd = true
        logger.info(`email ${email}`)
        const userByEmail = await usersFacade.getUserByEmail(email, returnPasswd)

        // If not user available run an exception
        if (!userByEmail) {
          throw new NodepopError({ message: `Error: ✘ Not user retrieved using the following email ${email}` })
        }

        // Check passwords
        logger.info('Validating password given onto password stored for the registered user')
        const passwordHelper = new PasswordHelper()
        await passwordHelper.validatePassword({
          givenPassword: passwd,
          storedUserPassword: userByEmail.passwd
        })
        logger.info('Sucessful password validation')
      } else {
        throw new NodepopError({ message: `Error: ✘ Not email or password provided ${email}` })
      }
    } catch (err) {
      logger.error(err)
      throw new NodepopError({ message: `Error: ✘ assert user password failed for ${email}` })
    }
  }
}

export default AuthFacade
