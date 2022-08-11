'use strict'

const fs = require('fs')
const filepath = './downloads.txt'

const insert = (trackName) => {
    fs.appendFile(filepath, `${trackName}\r\n`, function (err) {
    if (err) {
      // append failed
      console.error(err)
    } else {
      console.info(`SAVED: ${trackName}`)
    }
  })
}

const exists = (trackName) => {
    console.log(`FileOK: ${fs.existsSync(filepath)}`)
    var array = fs.readFileSync(filepath).toString().split("\n");

    for (var i in array) {
        if (array[i].startsWith(trackName) ||
            array[i].startsWith(`[missing]${trackName}`))
        {
            return true
        }
    }
    return false
}

module.exports = {
    insert,
    exists
}
