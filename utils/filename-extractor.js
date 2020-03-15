const fs = require('fs');
const path = require('path');
const target = 'C:/Users/username';

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

    const outputFilePath = "C:/Users/";

    // Clear file by overwriting
    fs.writeFile(outputFilePath, "", function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("File cleared!")
    });

    // ["c://some-existent-path/file.txt","c:/some-existent-path/subfolder"]
    // Requirements for movies: [name, year, fileLocation]
    // Requirements for series: [name, { season 1 { episode 1: fileLocation, episode 2: fileLocation } }]
    data.forEach((item) => {
        let title = item.split("\\").pop();
        let length = title.split(".").length;
        let name = title. split(".")[0]
        let filetype = title.split(".")[1]

        // If media file write to text 
        if (length == 2 && filetype != "srt") {
            fs.appendFile(outputFilePath, name + '\n', function(err) {
                if(err) {
                    return console.log(err);
                }
                console.log(`${name} was saved!`);
            });
        }  
    })
});