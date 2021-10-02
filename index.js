const beatport = require('./beatport')
const downloader = require('./downloader')
// const tagparser = require('./tag-parser')
const db = require('./features/db')

const beatportLists = [
    "https://www.beatport.com/top-100",
    // "https://www.beatport.com/genre/tech-house/11/top-100",
    // "https://www.beatport.com/genre/afro-house/89/tracks?per-page=150"
];

let pendingDownloads = []
const downloadResult = []
let index = 0
// scrap tracks based on beatport url list
beatport.parse(beatportLists, (pendingTracks) => {
    console.log(pendingTracks)
    console.log(`PENDING TOTAL: ${pendingTracks[0].length}`)
    pendingDownloads = pendingTracks[0]
    dl(index)
})

function dl() {
    if (pendingDownloads[index]) {
        // matrix considering several urls parsed
        let squery = pendingDownloads[index]
        index++
        downloader.download(squery, (result) => {
            downloadResult.push(result)
            console.log(result)
            if (result.startsWith('[true]')) {
                db.insert(squery)
            } else if (result.startsWith('[missing]')) {
                db.insert(`[missing]${squery}`)
            }
            dl(index)
        })
    } else {
        console.log(downloadResult)
    }
}

const tempdb = () => {
    
}