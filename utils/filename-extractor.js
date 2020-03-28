const fs = require('fs');
const path = require('path');
const { performance } = require('perf_hooks');

/**
 * Explores recursively a directory and returns all the filepaths and folderpaths in the callback.
 * 
 * @see http://stackoverflow.com/a/5827895/4241030
 * @param {String} dir 
 * @param {Function} done 
 */
function filewalker(dir, done) {
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
}

/**
 * Uses filewalker to index a folder and write the hdd_data.json file.
 * 
 * @see https://stackoverflow.com/questions/55901040/how-do-i-throw-error-in-one-function-to-be-caught-by-another-function
 * @param {String} folder_path 
 */
export default function getMovieDataFromHDD(folder_path, output_path) {
    let target_path = path.normalize(folder_path);
    if (path.isAbsolute(target_path) && fs.existsSync(target_path)) {
        filewalker(target_path, function (err, data) {
            if (err) {
                throw err;
            }
            // initialise performance timer
            var t0 = performance.now();

            console.log("Starting HDD indexing operation...");
            const outputFilePath = path.join(output_path, '/hdd_data.json');
            // Clear file by overwriting
            fs.writeFile(outputFilePath, "", function (err) {
                if (err) {
                    return console.log(err);
                }
            });
            // Empty object to populate
            let outputJSON = [];
            // Empty object to add series information
            let series = {};
            var currentSeries;
            var count = 0;
            // ["c://some-existent-path/file.txt","c:/some-existent-path/subfolder"]
            // Example movie path: Movies\Action\Name (1999).mp4
            // Example series path: Movies\Series\Name (2014)\Season 2\Episode 6.avi
            data.forEach((item) => {
                let title = path.basename(item);
                let length = title.split(".").length;
                let name = title.split(".")[0].split("(")[0].trim();
                let year = title.split(".")[0].split("(")[1];
                year = (year != undefined) ? year.replace(")", "") : undefined;
                let filetype = title.split(".")[1];
                //console.log(item);
                // If media file and not series, add movie to object 
                if (length == 2 && filetype != "srt" && !item.includes('Series')) {
                    let newEntry = {
                        "Title": name,
                        "Year": year,
                        "FileType": filetype,
                        "FileLocation": path.normalize(item),
                        "Type": "movie"
                    };
                    outputJSON.push(newEntry);
                    count += 1;
                }
                else {
                    let directoryName = path.basename(path.dirname(item));
                    let baseName = path.basename(item);
                    // if a series name add to new series object
                    if (item.includes('Series') && baseName.includes('Season')) {
                        // this also means we've reached a new series so need new object
                        if (directoryName != currentSeries) {
                            series[directoryName] = {};
                        }
                        currentSeries = String(directoryName);
                        series[directoryName].Title = currentSeries.split(".")[0].split("(")[0].trim();
                        let year = currentSeries.split(".")[0].split("(")[1];
                        series[directoryName].Year = year.replace(")", "");
                        series[directoryName].Type = 'series';
                        series[directoryName][baseName] = [];
                    }
                    else if (directoryName.includes(currentSeries) && baseName.includes('Season')) {
                        // if a season with current series as dirname create seasons array
                        // this will hold the episodes file paths :)
                        series[currentSeries][baseName] = [];
                    }
                    else if (directoryName.includes('Season') && item.includes(currentSeries) && !baseName.includes('.srt')) {
                        // else if in a season folder it's an episode
                        // the file paths need pushing to season array :)
                        series[currentSeries][directoryName].push(item);
                    }
                }
            });
            // Push each of the series objects to output array
            for (let key in series) {
                outputJSON.push(series[key]);
            }
            // Write the built up object to a file as JSON
            fs.appendFile(outputFilePath, JSON.stringify(outputJSON), function (err) {
                if (err) {
                    return console.log(err);
                }
                console.log(`File hdd_data.json was saved successfully to ${outputFilePath}!`);
            });
            var t1 = performance.now();
            console.log("Filewalker took " + parseInt(t1 - t0) + " milliseconds to index " + count + " movies and " + Object.keys(series).length + " series.");
        });
    } else {
        throw new Error(console.error("The given folder does not exist, or is not an absolute path."));
    }
}
