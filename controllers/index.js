const fs = require('fs');
const axios = require('axios');
const moment = require('moment');

const initialize = async (res) => {
    const timestamp = moment().format('MMDDYYHHmmss');
    res.setHeader('Content-Type', 'text/plain');

    try {
        await axios.get('https://samples.openweathermap.org/data/2.5/weather?', {
            params: {
                q: 'London,uk',
                appid: 'b6907d289e10d714a6e88b30761fae22',
            }
        }).then(response => {
            const path = `./reports/weather-${timestamp}.txt`;
            const parsedData = JSON.stringify(response.data);

            fs.appendFile(path, parsedData, (error) => {
                if (! error) {
                    res.statusCode = 200;
                    res.end('Successfully written to file');
                }

                res.statusCode = 500;
                res.end(JSON.stringify(error));
            });
        }).catch (error => {
            res.statusCode = 500;
            res.end(JSON.stringify(error));
        });
    } catch (error) {
        res.statusCode = 500;
        res.end(JSON.stringify(error));
    }
};

module.exports = initialize;
