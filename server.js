
import express from 'express'
import axios from 'axios';
import * as cheerio from 'cheerio'

const app = express();
const PORT = process.env.PORT || 3000;

const websites = [
    // { name: 'ESPN', url: 'https://www.espn.com', selector: '.headlineStack__list a' },
    // { name: 'ESPN', url: 'https://www.espn.com/espn/latestnews', selector: 'a' },
    { name: 'Sky Sports', url: 'https://www.skysports.com/', selector: '.sdc-site-tile__headline-link span.sdc-site-tile__headline-text'},
    // Add more websites here
];

async function scrapeWebsites() {
    const allHeadlines = [];

    for (const site of websites) {
        try {
            const { data } = await axios.get(site.url);
            const $ = cheerio.load(data);

            const headlines = [];

            $(site.selector).each((index, element) => {
                const title = $(element).text().trim();
                const link = $(element).attr('href');
                headlines.push({ title, link: `${site.url}${link}` });
            });

            allHeadlines.push({ site: site.name, headlines });
        } catch (error) {
            console.error(`Error fetching data from ${site.url}:`, error.message);
        }
    }

    return allHeadlines;
}

app.get('/scrape-sports-news', async (req, res) => {
    const headlines = await scrapeWebsites();
    res.json(headlines);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
