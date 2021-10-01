// https://stackoverflow.com/questions/55678095/bypassing-captchas-with-headless-chrome-using-puppeteer
// https://www.npmjs.com/package/puppeteer-extra-plugin-stealth

const site = 'https://free-mp3-download.net/'
const path = require("path");
const downloadPath = path.resolve("./download");

// puppeteer-extra is a drop-in replacement for puppeteer,
const puppeteer = require("puppeteer-extra");

const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

// const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
// puppeteer.use(AdblockerPlugin());

const repatchElement = `/html/body[@class='blue darken-1']/main/div[@class='container center']/div[@class='row']/div[@class='col s12 m6 offset-m3 l4 offset-l4']/div[@class='white-text text-white blue darken-2 card']/div[@class='card-action']/div[@id='captcha']/div[@class='g-recaptcha']/div/div/iframe`;
const downloadFinal = `/html/body[@class='blue darken-1']/main/div[@class='container center']/div[@class='row']/div[@class='col s12 m6 offset-m3 l4 offset-l4']/div[@class='white-text text-white blue darken-2 card']/div[@class='card-action']/button[@class='dl btn waves-effect waves-light blue darken-4']`;

(async () => {
    try {
        const browser = await puppeteer.launch({
            headless: false,
            slowMo: 150,
            devtools: true,
            args: ['--disable-web-security', '--disable-features=IsolateOrigins,site-per-process']
        });
        const page = await browser.newPage();
        await page.goto(site);
        page.on('console', (msg) => console.log('PAGE LOG:', msg.text()))

        await page.waitForSelector('input[id=q]');
        await page.$eval('input[id=q]', el => el.value = 'monolink');
        await page.click('button[type="submit"]');
        await page.waitForSelector('tbody[id=results_t]');

        const result = await page.evaluate(() => {
            const rows = document.querySelectorAll('#results_t tr');
            return Array.from(rows, row => {
                const columns = row.querySelectorAll('td')
                columns[2].firstElementChild.click()
            })
        })

        await page.waitForTimeout(5000)
        let frame = await page.frames().find(f => f.name().startsWith("a-"));
        if (frame) {
            // const dttt = await frame.waitForSelector('div.recaptcha-checkbox-border');
            const rcbtn = await frame.waitForSelector('span.recaptcha-checkbox');
            if (rcbtn)
                await rcbtn.click();
        } else {
            frame = await document.waitForSelector("[title='reCAPTCHA']")
            const rcbtn = await page.waitForSelector('span.recaptcha-checkbox');
            if (rcbtn)
                await rcbtn.click();
        }

        // click ok ------------
        await page.waitForTimeout(3000)
        await page.waitForXPath(downloadFinal)
        await page.evaluate(_ => {
            document.getElementsByClassName("dl")[0].click()
        });
        // ---------------
    } catch (err) {
        console.log(err)
        // await page.screenshot({ path: 'example.png' });
        // await browser.close();
    }
})();