'use strict'

// ---------------------------------- General modules
import path from 'path'

// ---------------------------------- i18n
import i18n from 'i18n'

// ---------------------------------- Local source code
import config from '../settings'

i18n.configure({
  defaultLocale: config.locale.defaultLocale,
  directory: path.join(config.rootFolder, config.locale.i18nFolder),
  updateFiles: false,
  api: {
    '__': 'translate',
    '__n': 'translateN'
  }
})

export default i18n
