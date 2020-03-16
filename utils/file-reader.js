const fs = require('fs');
const path = require('path');

let hdd_data = JSON.parse(fs.readFileSync(path.join(__dirname, 'hdd_data.json')));

hdd_data.forEach(item => {
    (item.Type == 'movie') ? console.log(`Movie: ${item.Title}`) : console.log(`Series: ${item.Title}`)
});