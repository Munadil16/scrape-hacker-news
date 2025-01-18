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

wss.on("connection", async (ws) => {
    ws.on("error", (err) => console.error(err));

    try {
        const msg = await onInitialConnection();
        ws.send(`Number of stories in last 5 minutes: ${msg.toString()}`);
    } catch (err) {
        console.log("Error while sending message: ", err);
    }
});

