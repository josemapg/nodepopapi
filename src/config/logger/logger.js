'use strict'

// ---------------------------------- Local source code
import winston from 'winston'
import 'winston-daily-rotate-file'

// ---------------------------------- Local source code
import config from 'config/settings'

// ---------------------------------- Class: Private members

/**
 * Winston logger
 */
const _logger = new WeakMap()

class Logger {
  constructor () {
    const logger = winston.createLogger({
      level: config.loggerLevel || 'info',
      format: this._customFormat(),
      transports: [
        //
        // - Write to all logs with level 'info' and below to Console
        // - Write to all logs with level `info` and below to `all.log`
        // - Write all logs error (and below) to `error.log`.
        //
        new winston.transports.Console(),
        new winston.transports.DailyRotateFile({
          filename: 'logs/%DATE%_' + config.environment + '_DEFAULT.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d'
        }),
        new winston.transports.DailyRotateFile({
          filename: 'logs/%DATE%_' + config.environment + '_ERROR.log',
          datePattern: 'YYYY-MM-DD',
          level: 'error',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '5d'
        })
      ]
    })

    _logger.set(this, logger)
  }

  get log () {
    return _logger.get(this)
  }

  get info () {
    return _logger.get(this).info
  }

  get warn () {
    return _logger.get(this).warn
  }

  get error () {
    return _logger.get(this).error
  }

  get debug () {
    return _logger.get(this).debug
  }

  _customFormat () {
    return winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      winston.format.printf(info => `[${info.timestamp}][${info.level}] ${info.message}`)
    )
  }
}

// Create an instance
const logger = new Logger()

export default logger
