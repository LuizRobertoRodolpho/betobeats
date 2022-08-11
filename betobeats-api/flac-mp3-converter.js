const fs = require('fs')
const f2m = require("flac-to-mp3")
const dir = './musics/'

const convertAllToMp3 = (folder) => {
    fs.readdirSync(folder)
        .forEach(filename => {
            if (filename != '.DS_Store') {
                convert(`${folder}/${filename}`)
            }
        })
}

const convert = (filePath) => {
    f2m.convert(
        filePath,
        function (data) {
            console.log(data.err.toString())
        }
    )
}

convertAllToMp3(dir)

module.exports = {
    convertAllToMp3
}