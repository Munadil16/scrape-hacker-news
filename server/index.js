import "dotenv/config";
import axios from "axios";
import express from "express";
import * as cheerio from "cheerio";
import { WebSocketServer } from "ws";

const app = express();
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});

const wss = new WebSocketServer({ server });

const onInitialConnection = async () => {
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
        console.log("Error while getting data during initial connection: ", err.message)
    }
}

// Scraping last 2 minute of stories only, because interval is set to reset every 2 minute
const scrapeData = async () => {
    try {
        const res = await axios.get("https://news.ycombinator.com/newest");
        const $ = cheerio.load(res.data);

        const ids = [];
        $("td.subtext").each((_, element) => {
            const duration = Number($(element).find("span.age").text().split(" ")[0]);

            if (duration > 2) {
                return false;
            }

            const id = $(element).find("span.score").attr("id").split("_")[1];
            ids.push(id);
        });

        const data = [];
        ids.map((id, _) => {
            const content = $(`#${id}`).find("span.titleline").text();
            const link = $(`#${id}`).find("span.titleline a").attr("href");

            data.push({ content, link });
        });

        return data;
    } catch (err) {
        console.log("Error while scraping data: ", err.message);
    }
}

wss.on("connection", async (ws) => {
    ws.on("error", (err) => console.error(err));

    try {
        const count = await onInitialConnection();
        ws.send(`Number of stories in last 5 minutes: ${count.toString()}`);
    } catch (err) {
        console.log("Error while sending message: ", err);
    }
});

setInterval(async () => {
    try {
        const data = await scrapeData();
        const message = JSON.stringify(data);

        wss.clients.forEach((client) => {
            if (client.readyState === client.OPEN) {
                client.send(message)
            }
        });
    } catch (err) {
        console.log("Error while sending scraped data: ", err.message);
    }
}, 1000 * 60 * 2);

