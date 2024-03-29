
const restify = require('restify')
const server = restify.createServer()
const cors = require('cors')
const port = 3006
const beatport = require('./beatport')
// const downloader = require('./downloader')
// const tagparser = require('./tag-parser')

server.get('/', function create(req, res, next) {
  res.send(201, Math.random().toString(36).substr(3, 8));
  return next();
});

const initialize = async () => {
  server.use(restify.plugins.acceptParser(server.acceptable))
  server.use(restify.plugins.queryParser())
  server.use(restify.plugins.bodyParser())
  server.use(cors())
    // server.use(auth.initialize())
    // server.use(tokenParser)
    // server.use(routeWall)
    // server.opts('/*', acceptOpts)
    // server.on('BadRequest', validationError)
    // server.on('Unauthorized', validationError)
    // server.on('Forbidden', validationError)

  server.listen(port, () => console.info(`Server started @ ${port}`))
  return server
}

const close = async () => {
    return server.close()
}

module.exports = {
    initialize,
    close
}
