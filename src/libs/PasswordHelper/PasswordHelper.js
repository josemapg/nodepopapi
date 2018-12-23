'use strict'

// ---------------------------------- Encryption
import bcrypt from 'bcrypt'

/**
 *
 */
class PasswordHelper {
  /**
   *
   * @param {*} param0
   */
  async generatePassword ({ password, bcryptSaltRounds }) {
    const hashPwd = await bcrypt.hash(password, bcryptSaltRounds)
    return hashPwd
  }

  /**
   *
   * @param {*} param0
   */
  async validatePassword ({ givenPassword, storedUserPassword }) {
    const isSame = await bcrypt.compare(givenPassword, storedUserPassword)
    if (!isSame) {
      const newError = new Error('Error: Failed password comparison. Password are not equal')
      throw newError
    }
  }
}

export default PasswordHelper
