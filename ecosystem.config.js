module.exports = {
  apps: [{
    name: 'NodepopAPI',
    script: 'src/index.js',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    args: '',
    instances: 0,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      LOGGER_LEVEL: 'info',
      PORT: 8080,
      JWT_SECRET: 'test',
      JWT_EXPIRE_IN: 60,
      MONGO_DB: 'nodepop',
      MONGO_DB_URI: 'mongodb://localhost/nodepop'
    }
  }]
}
