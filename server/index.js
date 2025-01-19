import "dotenv/config";
import express from "express";
import { WebSocketServer } from "ws";
import { PrismaClient } from "@prisma/client";
import { onInitialConnection, scrapeData } from "./utils/ws.utils.js";

const app = express();
const db = new PrismaClient();
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});

const wss = new WebSocketServer({ server });

wss.on("connection", async (ws) => {
    ws.on("error", (err) => console.error(err));

    try {
        const count = await onInitialConnection();
        ws.send(`Number of stories in last 5 minutes: ${count.toString()}`);
    } catch (err) {
        console.log("Error while sending number of stories: ", err);
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

        data.forEach(async (val) => {
            await db.story.create({
                data: {
                    content: val.content,
                    link: val.link
                }
            })
        });
    } catch (err) {
        console.log("Error while sending scraped data: ", err.message);
    }
}, 1000 * 60 * 2);

