'use strict'

// ---------------------------------- JWT management
import jwt from 'jsonwebtoken'

// ---------------------------------- Class: Private members

/**
 * App express instance
 */
const _jwtSecret = new WeakMap()

/**
 * Mongoose db connection reference
 */
const _jwtExpireIn = new WeakMap()

/**
 *
 */
class JWTHelper {
  /**
   *
   * @param {*} jwtSecret
   * @param {*} jwtExpireIn
   */
  constructor ({ jwtSecret, jwtExpireIn }) {
    _jwtSecret.set(this, jwtSecret)
    _jwtExpireIn.set(this, jwtExpireIn)
  }

  /**
   *
   * @param {*} param0
   */
  async generateJWTForAccessToken (payload) {
    const accessToken = await this._generateJWTForAccessTokenPromiseful(payload)
    return accessToken
  }

  /**
   *
   * @param {*} param0
   */
  async validateAccessTokenJWT (accessToken) {
    const decodedToken = await this._validateAccessTokenJWTPromiseful(accessToken)
    return decodedToken
  }

  /**
   *
   */
  _generateJWTForAccessTokenPromiseful (payload) {
    const { jwtSecret, jwtExpireIn } = this._getMembers()

    const promise = new Promise((resolve, reject) => {
      // Sign JWT
      jwt.sign(payload, jwtSecret, {
        expiresIn: jwtExpireIn
      }, (err, token) => {
        if (err) {
          reject(err)
        }
        resolve(token)
      })
    })
    return promise
  }

  /**
   *
   */
  _validateAccessTokenJWTPromiseful (accessToken) {
    const {
      jwtSecret
    } = this._getMembers()

    const promise = new Promise((resolve, reject) => {
      // Verify JWT
      jwt.verify(accessToken, jwtSecret, {},
        (err, decodedToken) => {
          if (err) {
            reject(err)
          }
          resolve(decodedToken)
        })
    })
    return promise
  }

  /**
   *
   */
  _getMembers () {
    const jwtSecret = _jwtSecret.get(this)
    const jwtExpireIn = _jwtExpireIn.get(this)

    return {
      jwtSecret,
      jwtExpireIn
    }
  }
}

export default JWTHelper
