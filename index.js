const http = require('node:http');
const axios = require('axios');
const cheerio = require('cheerio');

const server = http.createServer((req, res) => { // Server create karna
    axios.get("https://satta-king-fast.com")
    .then(response => {
        const data = response.data;
        const $ = cheerio.load(data);
        const table = $('#mix-chart > table tr');
        const names = table.eq(1).find('th'); // list of name elements, length 4
        const old_el_children = table.eq(table.length - 4).children(); // second last element
        const new_el_children = table.eq(table.length - 3).children(); // last element of the list
        const old_date = old_el_children.first().attr('title');
        const new_date = new_el_children.first().attr('title');
        const old_results = old_el_children.not(':first-child');
        const new_results = new_el_children.not(':first-child');
        const obj = { date: { old: old_date, new: new_date } };
        
        for (let i=0; i<4; i++) obj[names.eq(i).html().trim()] = { old: old_results.eq(i).html().trim(), new: new_results.eq(i).html().trim() };
        
        let text = '<!doctypehtml><html lang=en><meta charset=UTF-8><meta content="width=device-width,initial-scale=1"name=viewport><title>SK results</title><style>tr{border-bottom:1px solid #ddd}table{width:70vw}th{text-align:left}</style><body>';
        let header = "<tr>";
        let neww = header;
        let old = header;
        const keys = Object.keys(obj);

        keys.forEach(key => {
            header += `<th>${key}</th>`;
            old += `<td>${obj[key]['old']}</td>`;
            neww += `<td>${obj[key]['new']}</td>`;
        });

        header += "</tr>";
        neww += "</tr>";
        old += "</tr>";
        text += `<table>${header+old+neww}</table></body></html>`;

        res.writeHead(200, {'Content-Type': 'text/html'}); // Response header
        res.end(text); // Response
    }).catch((err) => {
        // Error handling
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('Error while fetching data from API\n' + String(err));
        console.error(err);
    });
});

// Port aur host define karna
const PORT = process.env.PORT || 3000;
const HOST = 'localhost';

server.listen(PORT, HOST, () => { // Server ko listen karne ke liye kahna
    console.log(`Server is running at http://${HOST}:${PORT}`);
});
