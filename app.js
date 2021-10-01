const axios = require('axios');
const cheerio = require('cheerio');
const urls = [
    "https://www.beatport.com/genre/tech-house/11/top-100",
    "https://www.beatport.com/genre/afro-house/89/tracks?per-page=150"
];

urls.forEach((url) => {
    const pagedUrl =
        fetchData(url).then((res) => {
            let count = 0
            try {
                const html = res.data;
                const $ = cheerio.load(html);
                let title;
                let artist;
                let remixed;
                // const statsTable = $('.bucket-item > p > a > span');
                const tracks = $('.bucket-item');
                tracks.each(function () {
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

                    console.log(`${artist} - ${title}`);
                });
            }
            catch (err) {
                console.log(`err ${err}`)
            }
        })
})

async function fetchData(url) {
    console.log("Crawling data...")
    // make http call to url
    let response = await axios(url).catch((err) => console.log(err));

    if (response.status !== 200) {
        console.log("Error occurred while fetching data");
        return;
    }
    return response;
}
// document.getElementById('recaptcha-anchor-label').click()
function scrapPaginationUrls(firstUrl) {
    const html = res.data;
    const $ = cheerio.load(html);

    fetchData(firstUrl).then((res) => {
        try {
            const html = res.data;
            const $ = cheerio.load(html);
        }
        catch (err) {

        }
    })
}
