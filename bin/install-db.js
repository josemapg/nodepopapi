'use strict'

// ---------------------------------- Database
const { MongoClient } = require('mongodb')

// ---------------------------------- Miscellaneous
const chalk = require('chalk')

// ---------------------------------- Local source code
const config = require('config/settings/config.js')

// ---------------------------------- Loading data
const sampleData = require('sample-data.json')

// Generate tags
const infoMsg = chalk.bold.green
const importantMsg = chalk.bold.red
const notUsefulMsg = chalk.bold.yellow
const groupsMsg = chalk.keyword('white').inverse

// Extract database name & mongodb url
const { database, url: mongodbUrl } = config.mongo

const installDB = async ({
  database,
  mongodbUrl,
  sampleData
}) => {
  let client
  try {
    client = await MongoClient.connect(mongodbUrl, {
      useNewUrlParser: true
    })

    // Open database 'nodepop'
    console.log(`➥ ${infoMsg('Connection open sucessfully')} ⚽ to mongoDB at ${mongodbUrl}`)

    // Use selected database
    const db = client.db(database)
    await db.dropDatabase()
    // Dropped database ok
    console.log(`${importantMsg(`✘ Dropped ${database} db sucessfully`)}`)

    // Create ads collections
    console.group(`➽ Starting with ${groupsMsg('ads')}`)
    const adsColl = await db.createCollection('ads')
    console.log(`${infoMsg('✔')} Created ads collection`)
    // Insert many ads data
    await adsColl.insertMany(sampleData.adds)
    const numberOfAds = await adsColl.countDocuments()
    console.log(`${infoMsg('✔')} # ads: ${numberOfAds} rows`)
    console.groupEnd()

    // Create users collections
    console.group(`➽ Starting with ${groupsMsg('users')}`)
    const usersColl = await db.createCollection('users')
    console.log(`${infoMsg('✔')} Created users collection`)
    // Insert many users data
    await usersColl.insertMany(sampleData.users)
    const numberOfUsers = await usersColl.countDocuments()
    console.log(`${infoMsg('✔')} # users: ${numberOfUsers} rows`)
    console.groupEnd()

    // Stop connection
    client.close()
    console.log(`➥ ${notUsefulMsg('Connection closed sucessfully')} ⛱  to MongoDB at ${mongodbUrl}`)
  } catch (err) {
    console.log(err)
    if (client) { client.close() }
    process.exit(1)
  }
}

// Run db install: drop current collection, and insert some ads and users
installDB({
  database,
  mongodbUrl,
  sampleData
})
