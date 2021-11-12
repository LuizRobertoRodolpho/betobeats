'use strict'

const axios = require('axios');
const cheerio = require('cheerio');
const strings = require('./features/strings')
const db = require('./features/db')

const parse = async (urls, callback) => {
    const mappedResult = urls.map(async (url) => {
        const data = await fetchData(url);
        const result = parseInfos(data)
        return result
    })
    Promise.all(mappedResult)
           .then((res) => {
                callback(res)
           })
}

const fetchData = async (url) => {
    console.log("Crawling data...")

    let response = await axios(url).catch((err) => console.log(err));
    
    if (response.status !== 200) {
        console.log("Error occurred while fetching data");
        return;
    }
    return response;
}

const parseInfos = (res) => {
    const musics = []
    
    try {
        const html = res.data;
        const $ = cheerio.load(html);
        let title;
        let artist;
        let remixed;

        const tracks = $('.bucket-item');
        tracks.each(function () {
            // TODO: if more than one artist, save separatedly and apply retry rotation
            //       when a track was not found (ex.: art1: 'Luca Morris', art2: 'Mozzy')
            artist = $(this).find('.buk-track-artists')
                .text()
                .replace(/\s\s+/g, ' ')
                .replace(/(\r\n|\n|\r)/gm, "")
                .trim();
            title = $(this).find('.buk-track-primary-title')
                .text()
                .replace(/\s\s+/g, ' ')
                .replace(/(\r\n|\n|\r)/gm, "")
                .trim();
            remixed = $(this).find('.buk-track-remixed')
                .text()
                .replace(/\s\s+/g, ' ')
                .replace(/(\r\n|\n|\r)/gm, "")
                .trim();

            if (artist && title) {
                let trackName = strings.normalize(`${artist} ${title}`)
                if (!db.exists(trackName))
                    musics.push(trackName)
                //console.log(`${music.artist} - ${music.title}`)
            }
        });
    }
    catch (err) {
        console.log(`err ${err}`);
    }
    return musics;
}

// scrapping with pagination not implemented yet
// const nextPage = () => {}

module.exports = {
    parse
}
