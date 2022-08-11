const server = require('./server')
//const db = require('./config/db')

;(async () => {
  //await db()
  await server.initialize()
})()