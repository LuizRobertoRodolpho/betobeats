const server = require('./server')
//const db = require('./config/db')

;(async () => {
  //await db()
  console.log("aaaaaaaaaaa")
  await server.initialize()
})()