const http = require('http');
const fs = require('fs');

/**
 * Sets the hostname and port
 */
const hostname = '127.0.0.1';
const port = '8080';

/**
 * Create a new server
 */
const server = http.createServer(function (request, response) {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/html');

    const routes = {
        '/': 'index.js',
        '/html_report': 'html_report.js',
    };
    
    render(response, routes[ request.url ]);
});

/**
 * Renders the content into a file
 * 
 * @param {*} response 
 * @param {*} file 
 */
function render(response, file) {
    const filePath = `./controllers/${file}`;

    fs.stat(filePath, (error, stats) => {
        if (stats) {
            const initialize = require(filePath);

            initialize(response);
        } else {
            response.statusCode = 404;
            response.end('Page not found');
        }
    });
}

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});


