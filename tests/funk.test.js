var testosterone = require('testosterone')(),
    assert = testosterone.assert,
    fs = require('fs');

//'test synchronous parallel'
(function () {
  var funk = require('./../lib/funk')();

  funk.set('results', []);
  funk.separator = '';

  funk.add(function () {
    this.results.push('foo');
  })();

  funk.add(function () {
    this.results.push('bar');
  })();

  funk.add(function () {
    this.separator = ',';
  })();

  funk.parallel(function () {
    assert.equal(this.results.join(this.separator), 'foo,bar');
  });
}());

//'test synchronous serial'
(function () {
  var funk = require('./../lib/funk')();

  funk.set('values', []);

  funk.add(function () {
    this.values.push('foo');
  })();

  funk.add(function () {
    this.values.push('bar');
  })();

  funk.add(function () {
    this.separator = ',';
  })();

  funk.serial(function () {
    assert.equal(this.values.join(this.separator), 'foo,bar');
  });
}());

//'test async':
(function () {
  var funk = require('./../')();

  funk.set('results', []);

  fs.readFile(__dirname + "/data/foo.txt", 'utf-8', funk.add(function (er, data) {
    this.results.push(data);
  }));

  fs.readFile(__dirname + "/data/bar.txt", 'utf-8', funk.add(function (er, data) {
    this.results.push(data);
  }));

  funk.parallel(function () {
    assert.equal(this.results.length, 2);
    assert.notEqual(this.results.indexOf('foo\n'), -1);
    assert.notEqual(this.results.indexOf('bar\n'), -1);
  });
}());

//'test nothing'
(function () {
  var funk = require('./../')();

  funk.results = [];

  fs.readFile(__dirname + "/data/foo.txt", 'utf-8', funk.nothing());
  fs.readFile(__dirname + "/data/bar.txt", 'utf-8', funk.nothing());

  funk.parallel(function () {
    assert.deepEqual(this, {});
  });
}());

//'test result'
(function () {
  var funk = require('./../')();

  funk.results = [];

  fs.readFile(__dirname + "/data/foo.txt", 'utf-8', funk.result('file1'));
  fs.readFile(__dirname + "/data/bar.txt", 'utf-8', funk.result('file2'));

  funk.parallel(function () {
    assert.equal(this.file1, 'foo\n');
    assert.equal(this.file2, 'bar\n');
  });
}());

//'test serial'
(function () {
  var funk = require('./../')(),
      order = 0;

  funk.results = [];

  setTimeout(funk.add(function () {
    order += 1;
    funk.set('order_first', order);
  }), 200);

  fs.readFile(__dirname + "/data/foo.txt", 'utf-8', funk.add(function () {
    order += 1;
    funk.set('order_foo', order);
  }));

  fs.readFile(__dirname + "/data/bar.txt", 'utf-8', funk.add(function () {
    order += 1;
    funk.set('order_bar', order);
  }));

  funk.serial(function () {
    assert.equal(this.order_first, 1);
    assert.equal(this.order_foo, 2);
    assert.equal(this.order_bar, 3);
  });
}());
