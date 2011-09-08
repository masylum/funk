var testosterone = require('testosterone')(),
    assert = testosterone.assert,
    fs = require('fs');

testosterone

  .add('`sync` parallel', function (done) {
    var funk = require('./../lib/funk')('parallel');

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

    funk.run(function () {
      assert.equal(this.results.join(this.separator), 'foo,bar');
      done();
    });
  })

  .add('`sync` serial', function (done) {
    var funk = require('./../lib/funk')('serial');

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

    funk.run(function () {
      assert.equal(this.values.join(this.separator), 'foo,bar');
      done();
    });
  })

  .add('`async` parallel', function (done) {
    var funk = require('./../')('parallel');

    funk.set('results', []);

    fs.readFile(__dirname + "/data/foo.txt", 'utf-8', funk.add(function (er, data) {
      this.results.push(data);
    }));

    fs.readFile(__dirname + "/data/bar.txt", 'utf-8', funk.add(function (er, data) {
      this.results.push(data);
    }));

    funk.run(function () {
      assert.equal(this.results.length, 2);
      assert.notEqual(this.results.indexOf('foo\n'), -1);
      assert.notEqual(this.results.indexOf('bar\n'), -1);
      done();
    });
  })

  .add('`async` serial', function (done) {
    var funk = require('./../')('serial'),
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

    funk.run(function () {
      assert.equal(this.order_first, 1);
      assert.equal(this.order_foo, 2);
      assert.equal(this.order_bar, 3);
      done();
    });
  })

  .add('`error callback`', function (done) {
    var funk = require('./../')('serial'),
        order = 0;

    funk.results = [];

    setTimeout(funk.add(function errorCallback1() {
      order += 1;
      funk.set('order_first', order);
    }), 200);

    fs.readFile(__dirname + "/data/boo.txt", 'utf-8', funk.add(function errorCallback2() {
      order += 1;
      funk.set('order_foo', order);
    }));

    fs.readFile(__dirname + "/data/far.txt", 'utf-8', funk.add(function errorCallback3() {
      order += 1;
      funk.set('order_bar', order);
    }));

    funk.run(function () {}, function onError(error) {
      assert.equal(error.code, 'ENOENT');
      done();
    });
  })

  .add('`error callback` callbackless', function (done) {
    var funk = require('./../')('serial'),
        order = 0;

    funk.name = 'fleiba';
    funk.results = [];

    setTimeout(funk.add(function () {
      order += 1;
      funk.set('order_first', order);
    }), 200);

    fs.readFile(__dirname + "/data/coo.txt", 'utf-8', funk.add(function () {
      order += 1;
      funk.set('order_foo', order);
    }));

    fs.readFile(__dirname + "/data/gar.txt", 'utf-8', funk.add(function () {
      order += 1;
      funk.set('order_bar', order);
    }));

    funk.run(function () {
      assert.equal(this.order_first, 1);
      assert.equal(this.order_foo, 2);
      assert.equal(this.order_bar, 3);
      assert.equal(this.errors.length, 2);
      done();
    });
  })

  .run();
