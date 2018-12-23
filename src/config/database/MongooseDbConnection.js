'use strict'

// ---------------------------------- Database
import mongoose from 'mongoose'

// ---------------------------------- Local source code
import {
  errorCodes,
  MongoDbConnectionError,
  MongoDbReconnectionError
} from 'errors'
import logger from 'config/logger'

// ---------------------------------- Class: Private members
/**
 * Reference to connection
 */
const _conn = new WeakMap()

/**
 * Reference to mongodb url use to open the connection
 */
const _mongodbUrl = new WeakMap()

/**
 * Reference if events hasn't been setup already or not
 */
const _setupEventsDone = new WeakMap()

/**
 *
 */
class MongooseDbConnection {
  /**
   *
   * @param {*} mongodbUrl
   */
  constructor (mongodbUrl) {
    // Setup promise framework to use
    mongoose.Promise = global.Promise

    // Init mongodb url
    _mongodbUrl.set(this, mongodbUrl)

    // Connect to db
    this._connect().catch((err) => { logger.error(err.stack) })

    // Avoid the following warning: 'DeprecationWarning: collection.ensureIndex'
    mongoose.set('useCreateIndex', true)
  }

  /**
   * Return if mongodb connection is ready to use
   */
  isConnected () {
    const {
      conn
    } = this._getMembers()

    // Checking if connection is ready to use
    return conn && conn.readyState === 1
  }

  /**
   * Reconnect if it's not connected yet
   */
  async tryToReconnect () {
    const connected = this.isConnected()

    // Rerun the connection only if it's not connected
    if (!connected) {
      try {
        await this._connect()
      } catch (err) {
        throw err
      }
    }
  }

  /**
   *
   */
  async _connect () {
    const {
      mongodbUrl,
      setupEventsDone
    } = this._getMembers()

    try {
      logger.info(`➥ Trying to open a connection to mongoDB at ${mongodbUrl}`)

      // Connect to the given mongodb database
      await mongoose.connect(mongodbUrl, {
        useNewUrlParser: true,
        reconnectTries: 2
      })

      if (!setupEventsDone) {
        logger.info(`➥ Mongodb default connection is connected from ${mongodbUrl}`)

        // Store connection
        _conn.set(this, mongoose.connection)
        // Initialize events
        this._initEvents()
      }
    } catch (err) {
      const newError = new MongoDbConnectionError({
        message: `✘ Not able to connect to ${mongodbUrl}`,
        error: err,
        internalErrorStatus: errorCodes.notAvailableDbConnection
      })
      throw newError
    }

    // Check if db is reconnected
    if (!this.isConnected()) {
      const newError = new MongoDbReconnectionError({
        message: `✘ Not able to reconnect to ${mongodbUrl}`,
        internalErrorStatus: errorCodes.notAvailableDbConnectionAfterRetry
      })
      throw newError
    }
  }

  /**
   *
   */
  _initEvents () {
    const {
      conn,
      mongodbUrl,
      setupEventsDone
    } = this._getMembers()

    if (conn && !setupEventsDone) {
      // Open db
      conn.on('open', () => {
        logger.info(`➥ Connection open sucessfully ⚽  to mongoDB at ${mongodbUrl}`)
      })

      // Connected
      conn.on('connected', () => {
        logger.info(`➥ Mongodb default connection is connected from ${mongodbUrl}`)
      })

      // Disconnected
      conn.on('disconnected', () => {
        logger.warn(`➥ Mongodb default connection is disconnected from ${mongodbUrl}`)
      })

      // Error
      conn.on('error', (err) => {
        logger.error(`➥ Mongodb connection error at ${mongodbUrl}: ${err}`)
      })

      // SIGINT - kill a process
      process.on('SIGINT', () => {
        conn.close(() => {
          logger.warn(`➥ Received application termination SIGINT. So mongoose will disconnect from ${mongodbUrl}`)
        })
        process.exit(0)
      })

      // Set event setup as done
      this._setSetupEventsDone(true)
    }
  }

  _setSetupEventsDone (value) {
    _setupEventsDone.set(this, value)
  }

  /**
   *
   */
  _getMembers () {
    const conn = _conn.get(this)
    const mongodbUrl = _mongodbUrl.get(this)
    const setupEventsDone = _setupEventsDone.get(this)

    return {
      conn,
      mongodbUrl,
      setupEventsDone
    }
  }
}

export default MongooseDbConnection
