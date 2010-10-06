# Funk

Asynchronous parallel funktions made funky!

Working with asynchronous funktions can be a pain in the ass.

Imagine this scenario:

    // pseudocode
    DB.find(A, callback);
    DB.find(B, callback);

    // A and B are executing in parallel
    // We need to render a page when the three of them are over

    //*magic*
    if(A && B are finished) {
      render_page();
    }
    //*magic*

Funk provides an object to add all your parallel funktions and the data they receive from their callbacks.
Once you have added all the funktions, you call _parallel(callback)_ to assign a final callback.

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
