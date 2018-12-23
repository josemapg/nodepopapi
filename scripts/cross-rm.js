'use strict'

const shell = require('shelljs')

// Remove 'node' from command line
process.argv.shift()
// Remove script name from command line
process.argv.shift()

// Extract options from command line
let options = ''
if ('-'.indexOf(process.argv[0])) {
  options = process.argv.shift()
}

// Remove one by one each folder
process.argv.forEach((value, index, array) => {
  // Remove release folder
  console.log(`Running the following cross-command: rm ${options} ${value}`)
  shell.rm(options, value)
})
