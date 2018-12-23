'use strict'

/**
 * Codificación de errores propios de la aplicación
 */
const errorCodes = {
  Unauthorized: {
    httpStatus: 401,
    internalCode: '0401' // Resource not found HTTP error
  },
  resourceNotFound: {
    httpStatus: 404,
    internalCode: '0404' // Resource not found HTTP error
  },
  notImplemented: {
    httpStatus: 405,
    internalCode: '0405' // Not implemented HTTP error
  },
  unknownError: {
    httpStatus: 500,
    internalCode: '1000', // Unknown error
    msgKey: 'msgErrorUnknownError'
  },
  notAvailableDbConnection: {
    httpStatus: 503,
    internalCode: '1001', // No DB connection at restarting
    msgKey: 'msgErrorNoDbConnection'
  },
  notAvailableDbConnectionAfterRetry: {
    httpStatus: 503,
    internalCode: '1002', // No DB connection working after a retry
    msgKey: 'msgErrorNoDbConnectionAfterRetry'
  },
  objMissingDataError: {
    httpStatus: 400,
    internalCode: '1050', // Field object missing at request level
    msgKey: 'msgErrorObjMissingDataError'
  },
  objTooShortDataError: {
    httpStatus: 400,
    internalCode: '1051', // Field object too short at request level
    msgKey: 'msgErrorObjTooShortDataError'
  },
  objNotValidDataError: {
    httpStatus: 400,
    internalCode: '1052', // Field object not valid error at request level
    msgKey: 'msgErrorObjNotValidDataError'
  },
  adsFindError: {
    httpStatus: 400,
    internalCode: '1100', // Unknown finding error
    msgKey: 'msgErrorAdsFindError'
  },
  userRegistrationError: {
    httpStatus: 500,
    internalCode: '1200', // Uknown registration error
    msgKey: 'msgErrorUserRegistrationError'
  },
  userRegistrationDuplicateEmailError: {
    httpStatus: 409,
    internalCode: '1201', // Duplicate email
    msgKey: 'msgErrorUserRegistrationDuplicateEmailError'
  }
}

export default errorCodes
