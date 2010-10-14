/**
 * Module dependencies.
 */

module.exports = {
  'test parallel': function (assert) {

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
  },

  'test async': function (assert) {

    var funk = require('./../lib/funk')(),
        fs = require('fs');

    funk.set('results', []);

    fs.readFile("test/foo.txt", 'utf-8', funk.add(function (er, data) {
      this.results.push(data);
    }));

    fs.readFile("test/bar.txt", 'utf-8', funk.add(function (er, data) {
      this.results.push(data);
    }));

    funk.parallel(function () {
      assert.equal(this.results.length, 2);
      assert.includes(this.results, 'foo\n');
      assert.includes(this.results, 'bar\n');
    });
  },

  'test result': function (assert) {

    var funk = require('./../lib/funk')(),
        fs = require('fs');

    funk.results = [];

    fs.readFile("test/foo.txt", 'utf-8', funk.result('file1'));
    fs.readFile("test/bar.txt", 'utf-8', funk.result('file2'));

    funk.parallel(function () {
      assert.equal(this.file1, 'foo\n');
      assert.equal(this.file2, 'bar\n');
    });
  }
};
