const http = require('http');
const express = require('express');
const { createGreeting } = require('./greeting');
const url = require('url');

const app = express();
app.use(express.json());

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const query = parsedUrl.query;
    const path = parsedUrl.pathname;
    const greeting = createGreeting(query.first, query.last);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ greeting, path }));
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 