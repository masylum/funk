/*!
 * Funk - Function library for nodeJS
 * Copyright(c) 2010 Pau Ram0n <masylum@gmail.com>
 * MIT Licensed
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

module.exports = function(){
  return {
    version: '0.0.1',

    callback: null,
    total: 0,
    current: 0,

    add: function(funk){
      var self = this;
      this.total += 1;

      return function(error, data){
        self.current += 1;
        funk.call(self, error, data);
        self.test();
      }
    },

    test: function(){
      if(this.current >= this.total && this.callback){
        this.callback.call(this, this.callback.arguments);
      }
    },

    parallel: function(callback){
      this.callback = callback;
      this.test();
    }
  }
};
