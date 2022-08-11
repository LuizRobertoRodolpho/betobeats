'use strict'

const fs = require('fs')
const axios = require('axios')
const axiosThrottle = require('axios-request-throttle')
axiosThrottle.use(axios, { requestsPerSecond: 3 })

const cheerio = require('cheerio')
const NodeID3 = require('node-id3')
const strings = require('./features/strings')
const beatportUrl = 'https://www.beatport.com/search?q='
//const folder = '/Users/betorodolpho/Documents/musics.nosync/'
const folder = '/Users/betorodolpho/Downloads/'
const cleanNames = true
const dirtyOnNames = [' [www.slider.kz]']
const tagMissingOnly = false
const musics = new Array()
const options = {
    include: [],    // only read the specified tags (default: all)
    exclude: []     // don't read the specified tags (default: [])
}

class Music {
    filename;
    genre;
    artist;
    title;

    constructor(filename) {
        this.filename = filename
    }

    get normalizedName() {
        return strings.normalize(this.filename)
    }

    get url() {
        return this.getUrl()
    }

    get localpath() {
        return this.getLocalPath()
    }

    getUrl() {
        let uri = replaceAll(this.normalizedName, ' ', '+').toLowerCase()
        return beatportUrl + encodeURI(uri)
    }

    getLocalPath() {
        return folder + this.filename
    }

    applyTag() {
        updateTags(this)
    }
}

try {
    if (cleanNames) {
        cleanFilenames()
    }

    parseDirectory()

    if (musics.length == 0)
        return

        Promise.all(getBeatportTags(musics))
        .then((results) => {
            results.forEach((music) => {
                music.applyTag()
            })
        })
        .catch(error => { 
            console.log(error)
            throw error
        })
} catch (err) {
    console.log(err)
}

async function cleanFilenames() {
    // clean dirty from filename
    var fs = require('fs');
    fs.readdirSync(folder)
        .forEach(filename => {
            if (filename != '.DS_Store' && filename.indexOf(dirtyOnNames[0], 0)) {
                fs.rename(`${folder}/${filename}`, `${folder}/${filename.replace(dirtyOnNames[0], '')}`, function (err) {
                    if (err) console.log('ERROR: ' + err);
                });
            }
        })
}

async function parseDirectory() {
    try {
        // update tags
        fs.readdirSync(folder)
            .forEach(filename => {
                if (filename != '.DS_Store') {
                    let m = new Music(filename)
                    if (!tagMissingOnly || isTagMissing(m.localpath)) {
                        musics.push(m)
                    }
                }
            })

        console.log(`_______________________________\n`)
        console.log(`Pending Tags: ${musics.length}`)
        console.log(`_______________________________`)
    } catch (err) {
        console.log(err)
    }
}

function updateTags(music) {
    // const success = NodeID3.write(tags, filepath)
    let tags = {
        genre: music.genre,
        artist: music.artist,
        title: music.title
    }
    const success = NodeID3.update(tags, music.localpath, options)
    console.log(`success: ${success}`)

    const filetags = NodeID3.read(music.localpath)
    console.log(filetags)
}

function isTagMissing(filepath) {
    const filetags = NodeID3.read(filepath)
    console.log(filetags)
    return !filetags.genre || !filetags.title || !filetags.artist
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

function getBeatportTags(musics) {
    console.log("Crawling data...")

    return musics.map((music) => {
        return fetchData(music.url)
            .then((res) => {
                const html = res.data;
                const $ = cheerio.load(html);
                let genre;
                let artist;
                let title;
                const tracks = $('.bucket-item');
                tracks.each(function () {
                    genre = $(this).find('.buk-track-genre')
                        .text()
                        .replace(/\s\s+/g, ' ')
                        .replace(/(\r\n|\n|\r)/gm, "")
                        .trim();
                    artist = $(this).find('.buk-track-artists')
                        .text()
                        .replace(/\s\s+/g, ' ')
                        .replace(/(\r\n|\n|\r)/gm, "")
                        .trim();
                    title = $(this).find('.buk-track-primary-title')
                        .text()
                        .replace(/\s\s+/g, ' ')
                        .replace(/(\r\n|\n|\r)/gm, "")
                        .trim()

                    if (genre)
                        music.genre = genre

                    if (artist)
                        music.artist = artist

                    if (title)
                        music.title = title

                    if (genre && artist && title) {
                        console.log(`[${music.genre}] ${music.artist} - ${music.title}`)
                        return false
                    }
                })
                if (!music.genre || !music.artist || !music.title) {
                    console.log('prop missing')
                }
                return music
            })
            .catch((err) => {
                console.log(`err ${err}`)
            })
    })
}

async function fetchData(url) {
    // make http call to url
    let response = await axios(url).catch((err) => console.log(err));

    if (response.status !== 200) {
        console.log("Error occurred while fetching data");
        return;
    }
    return response;
}