'use strict'

// ---------------------------------- General modules
const path = require('path')

const config = {
  rootFolder:
    path.dirname(require.main.filename),
  environment:
    process.env.NODE_ENV || 'dev', // 'dev' y 'prod'
  loggerLevel:
    process.env.LOGGER_LEVEL || 'debug', // 'error'/0 , 'warn'/1 , 'info'/2, 'verbose'/3, 'debug'/4, 'silly'/5
  authTokens: {
    jwtSecret: process.env.JWT_SECRET || 'test',
    jwtExpireIn: process.env.JWT_EXPIRE_IN || 60 // In seconds, 8640000 - 100 days only for test purpose
  },
  api: {
    prefixV1: '/api/v1',
    prefixAds: '/ads',
    prefixUsers: '/users',
    prefixAuth: '/auth'
  },
  bcryptSaltRounds:
    12,
  server: {
    port:
      process.env.PORT || 8080
  },
  imageRepo: {
    path:
      process.env.IMAGE_REPO || '../www/public'
  },
  locale: {
    defaultLocale:
      'en', // 'en' o 'es'
    i18nFolder:
      'assets/i18n'
  },
  mongo: {
    database:
      process.env.MONGO_DB || 'nodepop',
    url:
      process.env.MONGO_DB_URI || 'mongodb://localhost/nodepop'
  }
}

// export default config
// DON'T CHANGE TO IMPORT - It is used at install-db.js and there is not using babel to use 'import/export' functionality
module.exports = config
