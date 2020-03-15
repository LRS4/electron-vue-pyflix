const fs = require('fs');
const path = require('path');
const { performance } = require('perf_hooks');
const target = 'C:/Users/L.Spencer/Desktop/Movies';

/**
 * Explores recursively a directory and returns all the filepaths and folderpaths in the callback.
 * 
 * @see http://stackoverflow.com/a/5827895/4241030
 * @param {String} dir 
 * @param {Function} done 
 */
function filewalker(dir, done) {
    var t0 = performance.now(); // initialise performance timer
    let results = [];

    fs.readdir(dir, function(err, list) {
        if (err) return done(err);

        var pending = list.length;

        if (!pending) return done(null, results);

        list.forEach(function(file){
            file = path.resolve(dir, file);

            fs.stat(file, function(err, stat){
                // If directory, execute a recursive call
                if (stat && stat.isDirectory()) {
                    // Add directory to array [comment if you need to remove the directories from the array]
                    results.push(file);

                    filewalker(file, function(err, res){
                        results = results.concat(res);
                        if (!--pending) done(null, results);
                    });
                } else {
                    results.push(file);

                    if (!--pending) done(null, results);
                }
            });
        });
    });
    var t1 = performance.now();
    console.log("Filewalker took " + (t1 - t0) + " milliseconds to complete the index.");
}

filewalker(target, function(err, data){
    if(err){
        throw err;
    }

    const outputFilePath = path.join(__dirname, '/hdd_data.json');

    // Clear file by overwriting
    fs.writeFile(outputFilePath, "", function(err) {
        if(err) {
            return console.log(err);
        }
    });

    // Empty object to populate
    let outputJSON = [];

    // Empty object to add series information
    let series = {};
    var currentSeries;

    // ["c://some-existent-path/file.txt","c:/some-existent-path/subfolder"]
    // Requirements for movies: [name, year, fileLocation]
    // Requirements for series: [name, { season 1 { episode 1: fileLocation, episode 2: fileLocation } }]
    data.forEach((item) => {
        let title = path.basename(item);
        let length = title.split(".").length;
        let name = title. split(".")[0].split("(")[0].trim();
        let year = title.split(".")[0].split("(")[1];
        year = (year != undefined) ? year.replace(")", "") : undefined;
        let filetype = title.split(".")[1]
        console.log(item);

        // If media file and not series, add movie to object 
        if (length == 2 && filetype != "srt" && !item.includes('Series')) {
            let newEntry = {
                "Title" : name,
                "Year" : year,
                "FileType" : filetype,
                "FileLocation" : path.normalize(item),
                "Type" : "movie"
            }
            outputJSON.push(newEntry);
        } else {
            let directoryName = path.basename(path.dirname(item));
            let baseName = path.basename(item); 

            // if a series name add to new series object
            if (directoryName.includes('Series')) {
                // this also means we've reached a new series so add to output
                // and clear the object for this iteration
                if (series != undefined) { outputJSON.push(series) }
                for (var prop in series) delete series[prop]; // clear object
                currentSeries = String(baseName);
                series['Title'] = currentSeries.split(".")[0].split("(")[0].trim();
                let year = currentSeries.split(".")[0].split("(")[1];
                series['Year'] = year.replace(")", "");
            } else if (directoryName.includes(currentSeries)) {
                // if a season with current series as dirname create seasons array
                // this will hold the episodes file paths :)
                series[baseName] = [];
            } else if (directoryName.includes('Season') && item.includes(currentSeries)) {
                // else if in a season folder it's an episode
                // the file paths need pushing to season array :)
                series[directoryName].push(item);
            } 
        }
    })

    console.log(series.Title)

    // Write the built up object to a file as JSON
    fs.appendFile(outputFilePath, JSON.stringify(outputJSON), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log(`File hdd_data.json was saved successfully!`);
    });
});