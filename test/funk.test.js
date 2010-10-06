/**
 * Module dependencies.
 */

var inspect= require('eyes').inspector({
  styles: {                 // Styles applied to stdout
      all:     'yellow',    // Overall style applied to everything
      label:   'underline', // Inspection labels, like 'array' in `array: [1, 2, 3]`
      other:   'inverted',  // Objects which don't have a literal representation, such as functions
      key:     'bold',      // The keys in object literals, like 'a' in `{a: 1}`

      special: 'grey',      // null, undefined...
      string:  'green',
      number:  'red',
      bool:    'blue',      // true false
      regexp:  'green',     // /\d+/
  },
  maxLength: 9999999999
});

module.exports = {
    'version': function(assert){
        var funk = require('./../lib/funk')();
        assert.ok(/^\d+\.\d+\.\d+$/.test(funk.version), "Invalid version format");
    },

    'test parallel': function(assert){

      var funk = require('./../lib/funk')();

      assert.equal(funk.current, 0);

      funk.results = [];
      funk.separator = '';

      funk.add(
        function(){ this.results.push('foo'); }
      )();

      funk.add(
        function(){ this.results.push('bar'); }
      )();

      funk.add(
        function(){ this.separator = ','; }
      )();

      funk.parallel(function(){
        assert.equal(this.results.join(this.separator), 'foo,bar');
      });
    },

    'test async': function(assert){

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

      funk.parallel(function(){
        assert.equal(this.results.length, 3);
      });
    }
};
