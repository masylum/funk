/*!
 * Funk - Function library for nodeJS
 * Copyright(c) 2010 Pau Ramon <masylum@gmail.com>
 * MIT Licensed
 */

module.exports = function(){

  var results = {},
      callback = null,
      total = 0,
      version = '0.0.2',
      current = 0;

  return {

    set: function (name, val) {
      results[name] = val;
    },

    get: function (name) {
      return results[name];
    },

    add: function (funk) {
      var self = this;
      total += 1;

      return function (error, data) {
        current += 1;
        funk.call(results, error, data);
        self.test();
      }
    },

    nothing: function () {
      var self = this;

      return self.add(function (error, data) {
        // where unicorns meet rainbows
      });
    },

    result: function (name) {
      var self = this;

      return self.add(function (error, data) {
        results[name] = data;
      });
    },

    test: function () {
      if (current >= total && callback) {
        callback.call(results, callback.arguments);
      }
    },

    parallel: function (cb) {
      callback = cb;
      this.test();
    }
  };
};
