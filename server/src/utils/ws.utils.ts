import axios from "axios";
import * as cheerio from "cheerio";

type Ids = Array<string | undefined>;

type Data = Array<{
    content: string;
    link: string | undefined;
}>;

export const onInitialConnection = async () => {
    try {
        const res = await axios.get("https://news.ycombinator.com/newest");
        const $ = cheerio.load(res.data);
        let count = 0;

        $('.age').each((_, element) => {
            const duration = Number($(element).text().split(" ")[0]);
            if (duration > 5) {
                return false;
            }

            count++;
        });

        return count;
    } catch (err) {
        console.log("Error while getting data during initial connection: ", err)
    }
}

// Scraping last 2 minute of stories only, because interval is set to reset every 2 minute
export const scrapeData = async () => {
    try {
        const res = await axios.get("https://news.ycombinator.com/newest");
        const $ = cheerio.load(res.data);

        const ids: Ids = [];
        $("td.subtext").each((_, element) => {
            const duration = Number($(element).find("span.age").text().split(" ")[0]);

            if (duration > 2) {
                return false;
            }

            const id = $(element).find("span.score").attr("id")?.split("_")[1];
            ids.push(id);
        });

        const data: Data = [];
        ids.map((id, _) => {
            const content = $(`#${id}`).find("span.titleline").text();
            const link = $(`#${id}`).find("span.titleline a").attr("href");

            data.push({ content, link });
        });

        return data;
    } catch (err) {
        console.log("Error while scraping data: ", err);
    }
}

