import puppeteer from 'puppeteer'

/**
 * @param {string} channelId 
 * @param {boolean} show 
 * 
 * @returns {Promise<string[]>}
 */
export default function (channelId, show) {
    return new Promise(async (resolve, reject) => {

        let browser
        
        try {
            browser = await puppeteer.launch({
                headless: ! show,
                args: ['--no-sandbox']
            })
        } catch (e) {
            reject(e)
            return
        }
        
        try {
            const page = await browser.newPage()
            await page.goto('https://www.youtube.com/channel/' + channelId + '/about')

            const linksContainerSelector = '#links-container'
            await page.waitForSelector(linksContainerSelector)
            const scrapedLinks = await page.evaluate(linksContainerSelector => {
                const links = []
                document.querySelectorAll(linksContainerSelector + ' a').forEach(linkElement => {
                    links.push(linkElement.href)
                })

                return links
            }, linksContainerSelector)

            const links = []

            scrapedLinks.forEach(scrapedLink => {

                const splitLink = scrapedLink.split('&q=')

                if (! scrapedLink.includes('https://www.youtube.com/redirect?') || splitLink.length === 1) {
                    links.push(scrapedLink)
                    return
                }

                links.push(decodeURIComponent(splitLink[1]))
            })

            await browser.close()
            resolve(links)
        } catch (e) {
            await browser.close()
            reject(e)
        }
    })
}
