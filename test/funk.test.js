/**
 * Module dependencies.
 */

module.exports = {
  'version': function (assert) {
    var funk = require('./../lib/funk')();
    assert.ok(/^\d+\.\d+\.\d+$/.test(funk.version), "Invalid version format");
  },

  'test parallel': function (assert) {

    var funk = require('./../lib/funk')();

    assert.equal(funk.current, 0);

    funk.results = [];
    funk.separator = '';

    funk.add(
      function () {
        this.results.push('foo');
      }
    )();

    funk.add(
      function () {
        this.results.push('bar');
      }
    )();

    funk.add(
      function () {
        this.separator = ',';
      }
    )();

    funk.parallel(function () {
      assert.equal(this.results.join(this.separator), 'foo,bar');
    });
  },

  'test async': function (assert) {

    var funk = require('./../lib/funk')(),
        fs = require('fs');

    assert.equal(funk.current, 0);

    funk.results = [];

    fs.readFile("test/data.txt", funk.add(function (er, data) {
      funk.results.push(data.length);
    }));

    fs.readFile("test/data.txt", funk.add(function (er, data) {
      funk.results.push(data.length);
    }));

    fs.readFile("test/data.txt", funk.add(function (er, data) {
      funk.results.push(data.length);
    }));

    assert.equal(funk.total, 3);

    funk.parallel(function () {
      assert.equal(this.results.length, 3);
    });
  }
};
