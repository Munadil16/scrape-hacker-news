<h2 align="center">Hacker news scraper</h2>

<h2>About the project</h2>

![Screenshot from 2025-01-19 12-09-29](https://github.com/user-attachments/assets/943e7cf3-7542-4fac-ba62-6575fbfa609c)

![Screenshot from 2025-01-19 12-10-22](https://github.com/user-attachments/assets/a2e52719-dc77-4d1d-92fa-45a9c62ade37)


<h2>Built with</h2>
1. Node.js <br /> 
2. WebSockets <br />
3. Cheerio

<h2>Prerequisites</h2>
1. Node.js <br />
2. pnpm <br />
3. Postman <br />

<h2>Installation</h2>

1. Clone the repository

```bash
git clone https://github.com/Munadil16/scrape-hacker-news.git
```

2. Change directory to server

```bash
cd srcape-hacker-news/server
```

3. Install dependencies

```bash
pnpm install
```

4.  Use .env.example to create .env file <br />
> [!NOTE]
> Get DATABASE_URL from [Aiven](https://aiven.io/mysql)

5.  Run the server

```bash
pnpm run dev
```

<h2>Setup Explanation</h2>

After starting the server, go to postman (or something similar) and connect to ws://localhost:8080 (or port which you defined in .env).

Initially, server sends how many stories are posted in last 5 minutes. After that, for every 2 minutes, it scrapes and sends the data (content and link here) as an array, which is actually parsed to string.

Run `pnpm prisma studio` in another terminal to view the database table.
