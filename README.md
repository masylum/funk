# Funk(tions)

Asynchronous parallel functions made funky!

Funk returns an object.
Add all the functions you want to run in parallel to that object.
Use this object to gather all the information from the callbacks (db records, file contents, etc...).
Call _parallel(callback)_ to assign a final callback and execute all the funky functions on parallel.
Dance!

    var funk = require('./../lib/funk')(),
        fs = require('fs');

    funk.results = [];

    fs.readFile("test/foo.txt", funk.add(function (er, data) {
      this.results.push(data);
    }));

    fs.readFile("test/bar.txt", funk.add(function (er, data) {
      this.results.push(data);
    }));

    funk.parallel(function(){
      sys.puts(sys.inspect(this.results)); // => [foo.txt contents, bar.txt contents]
    });

Grooooovy!
