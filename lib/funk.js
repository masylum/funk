/*!
 * Funk - Function library for nodeJS
 * Copyright(c) 2010 Pau Ramon <masylum@gmail.com>
 * MIT Licensed
 */

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
