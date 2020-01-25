const fs = require('fs');
const axios = require('axios');
const moment = require('moment');

const initialize = async (res) => {
    const timestamp = moment().format('MMDDYYHHmmss');

    try {
        await axios.get('https://samples.openweathermap.org/data/2.5/weather?', {
            params: {
                q: 'London,uk',
                appid: 'b6907d289e10d714a6e88b30761fae22',
            }
        }).then(response => {
            const path = `./reports/weather-${timestamp}.txt`;
            const responseData = response.data;
            const params = {
                weatherType: responseData.weather[0].main,
                locationName: responseData.name,
                locationCode: responseData.sys.country,
                locationIcon:  `http://openweathermap.org/images/flags/${responseData.sys.country.toLowerCase()}.png`,
                temperature: responseData.main.temp - 273.15,
                temperatureMinimum: responseData.main.temp_min - 273.15,
                temperatureMaximum: responseData.main.temp_max - 273.15,
                longitude: responseData.coord.lon,
                latitude: responseData.coord.lat,
                windSpeed: responseData.wind.speed,
                hpa: responseData.main.pressure,
                clouds: responseData.clouds.all,
            };

            res.setHeader('Content-Type', 'text/html');
            fs.readFile('./views/report.html', (error, data) => {
                const html = reconstructContent(data, params);
                res.end(html);
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

function reconstructContent(data, params) {
    let _data = data.toString();

    for (var key in params) {
        let queryString = `{{ ${key} }}`;
        if (_data.includes(queryString)) {
            _data = _data.replace(queryString, params[key]);
        }
    }

    return _data;
}

module.exports = initialize;
