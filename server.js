'use strict'

const restify = require('restify')
const server = restify.createServer()
const cors = require('cors')
const port = 3006
const beatport = require('./beatport')
// const downloader = require('./downloader')
// const tagparser = require('./tag-parser')

const initialize = async () => {
    server.use(restify.plugins.acceptParser(server.acceptable))
    server.use(restify.plugins.queryParser())
    server.use(restify.plugins.bodyParser())
    server.use(cors())
    server.opts('/*', acceptOpts)

    try {
        server.listen(port, () => console.info(`Server started @ ${port}`))
        return server
    } catch (error) {
        console.error(new Error(`Failed to create routes: ${error}`))
    }
}

const close = async () => {
    return server.close()
}

module.exports = {
    initialize,
    close
}
