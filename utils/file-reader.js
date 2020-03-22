const fs = require('fs');
const path = require('path');

let movieItemsHDD = JSON.parse(fs.readFileSync(path.join(__dirname, 'hdd_data.json')));
var seasons = [];

movieItemsHDD.forEach(item => {
    // (item.Type == 'movie') ? console.log(`Movie: ${item.Title} Year: ${item.Year}`) : console.log(`Series: ${item.Title}`)
    if (item.Type == 'series') { 
        for (let key in item) {
            if (key.includes('Season')) {
                console.log(item[key]);
                seasons.push(item[key]);
            }
        }
    }
});

console.log(seasons);