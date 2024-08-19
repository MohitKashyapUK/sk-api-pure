const http = require('node:http');
const axios = require('axios');
const cheerio = require('cheerio');

const server = http.createServer((req, res) => { // Server create karna
    const url = req.url;

    if (url == '/') {
        axios.get("https://satta-king-fast.com")
        .then(response => {
            // Response header set karna
            res.writeHead(200, {'Content-Type': 'application/json'});

            const data = response.data;
            const $ = cheerio.load(data);
            const table = $('#mix-chart > table tr');
            const names = table.eq(1).find('th'); // list of name elements, length 4
            const old_results = table.eq(table.length - 4).find('.number');
            const new_results = table.eq(table.length - 3).find('.number');
            const obj = {};
            for (let i=0; i<4; i++) obj[names.eq(i).html().trim()] = { old: old_results.eq(i).html().trim(), new: new_results.eq(i).html().trim() };

            // Response body mein message bhejana
            res.end(JSON.stringify(obj));
        }).catch((err) => {
            // Error handling
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end('Error fetching data from API\n');
            console.error(err);
        });
    } else {
        // 404 Not Found route
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('404 Not Found\n');
    }
});

// Port aur host define karna
const PORT = process.env.PORT || 3000;
const HOST = 'localhost';

server.listen(PORT, HOST, () => { // Server ko listen karne ke liye kahna
    console.log(`Server is running at http://${HOST}:${PORT}/`);
});
