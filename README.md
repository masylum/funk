# Funk

Asynchronous parallel funktions made funky! (because working with asynchronous funktions can be a pain in the ass)

Funk provides an object to add all the funktions you want to run in parallel.
This object can be used as well to gather all the information from the callbacks (db records, file contents, etc...).
Once you have added all the funktions, you call _parallel(callback)_ to assign a final callback and execute them on parallel.

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
