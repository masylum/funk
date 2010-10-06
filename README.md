# Funk(tions)

Asynchronous parallel functions made funky!

    npm install funk

  * Get a funk object.
  * Add the functions you want to run in parallel to that object.
  * Use this object to gather all the information from callbacks (db records, file contents, etc...).
  * Call _parallel(callback)_ to assign a final callback and execute all the funky functions in parallel.
  * Dance!

Example:

    var funk = require('funk')(),
        fs = require('fs');

    funk.results = [];

    fs.readFile("dance_moves/james_brown.txt", funk.add(function (er, data) {
      this.results.push(data);
    }));

    fs.readFile("dance_moves/jackson_5.txt", funk.add(function (er, data) {
      this.results.push(data);
    }));

    fs.readFile("dance_moves/jamiroquai.txt", funk.add(function (er, data) {
      this.results.push(data);
    }));

    funk.parallel(function(){
      dance(this.results); // free your mind and your ass will follow!
    });

Grooooovy!
