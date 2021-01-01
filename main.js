import scraper from './src/scraper.js'

/**
 * @typedef {string} youtubeLink
 * @typedef {youtubeLink[]} youtubeLinkCollection

 * @param {string} channelId 
 * 
 * @returns {Promise<youtubeLinkCollection>}
 */
export default function (channelId) {
    return new Promise(async (resolve, reject) => {
        try {
            const links = await scraper(channelId, false)
            resolve(links)
        } catch (e) {
            reject(e)
        }
    })
}
