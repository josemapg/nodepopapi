'use strict'

// ---------------------------------- Allow async / await functinality in classes
import 'babel-polyfill'

// ---------------------------------- Express && Middleware definitions
import express from 'express'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'

// ---------------------------------- Local source code
import FallbackErrorRoutes from 'routes'
import {
  errorMiddleware,
  reconnectToMongoDBMiddleware,
  validateJWTMiddleware
} from 'middlewares'
import config from 'config/settings'
import i18n from 'config/i18n'
import MongooseDbConnection from 'config/database'
import logger from 'config/logger'
import {
  errorCodes,
  RouteNotFoundError
} from 'errors'
import {
  AdsProtectedRoutes
} from 'modules/ads'
import {
  UsersPublicRoutes
} from 'modules/users'
import {
  AuthPublicRoutes
} from 'modules/auth'

// ---------------------------------- Class: Private members

/**
 * App express instance
 */
const _app = new WeakMap()

/**
 * Mongoose db connection reference
 */
const _conndb = new WeakMap()

/**
 * Global application initialization
 */
class AppServer {
  /**
   * App initializaer
   */
  constructor () {
    // Trying to restart server
    logger.info(`---------- ➥ Starting server at port ${config.server.port}`)

    // Create express application
    _app.set(this, express())

    // Connect database
    this._connectDatabase()

    // Configure middleware
    this._configureMiddleware()

    // SIGINT - kill a process
    process.on('SIGINT', () => {
      logger.warn(`---------- ➥ Received application termination SIGINT. Shutingdown nodepop application server\n\n`)
      process.exit(0)
    })
  }

  /**
   * Run server
   */
  run () {
    const { app } = this._getMembers()
    app.listen(config.server.port, () => {
      logger.info(`Server listening on port ${config.server.port}`)
    })
  }

  /**
   * Middleware configuration
   *
   */
  _configureMiddleware () {
    const {
      app, conndb
    } = this._getMembers()

    // Using default configuration, get language from 'Accept-Language'
    app.use(i18n.init)
    // Using several security profiles to protect API
    app.use(helmet())
    // Using get parameter from x-www-urlencoded & from body
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())
    app.use(bodyParser.raw())
    // Using cookie parser to receive in the future CSRF token
    app.use(cookieParser())
    // API call logger
    app.use(morgan('dev'))

    // Custom middleware to reconnect the database
    app.use(reconnectToMongoDBMiddleware(conndb))

    // ------- # Public routes
    // Public routes for registration
    const usersPublicRoutes = new UsersPublicRoutes()
    app.use(`${config.api.prefixV1}${config.api.prefixUsers}`, usersPublicRoutes.routes)

    // Token endpoint to retrieve access token
    const authPublicRoutes = new AuthPublicRoutes()
    app.use(`${config.api.prefixV1}${config.api.prefixAuth}`, authPublicRoutes.routes)

    // ------- # Protected routes
    // Routes will be protected under JWT
    app.use(validateJWTMiddleware())

    // Getting access to ads functionality
    const adsProtectedRoutes = new AdsProtectedRoutes()
    app.use(`${config.api.prefixV1}${config.api.prefixAds}`, adsProtectedRoutes.routes)

    // Fallbacks routes /api/v1 as initial prefix
    const fallbackErrorRoutes = new FallbackErrorRoutes()
    app.use(config.api.prefixV1, fallbackErrorRoutes.routes)

    app.use('/', (req, res, next) => {
      const newError = new RouteNotFoundError({
        message: `Not found ${req.baseUrl} route`,
        internalErrorStatus: errorCodes.resourceNotFound
      })
      next(newError)
    })

    // Custom middleware to manage errors
    app.use(errorMiddleware())
  }

  /**
   * Configure database
   */
  _connectDatabase () {
    try {
      _conndb.set(this, new MongooseDbConnection(config.mongo.url))
    } catch (err) {
      // Nothing to add
    }
  }

  /**
   *
   */
  _getMembers () {
    const app = _app.get(this)
    const conndb = _conndb.get(this)

    return {
      app,
      conndb
    }
  }
}

// Create a server
const appServer = new AppServer()
// Run server
appServer.run()

export default appServer
