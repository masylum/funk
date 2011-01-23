/*
 * funk - Asynchronous functions made funky!
 * Copyright(c) 2011 Pau Ramon <masylum@gmail.com>
 * MIT Licensed
 */

module.exports = function () {

  var _results = {},
      _style = 'parallel',
      _callback = null,
      _functions = [],

      _version = '1.0.0',
      FUNK = {},

     _test = function () {
        var pending_tests = _functions.some(function (el) {
          return typeof el === 'function';
        });

        if (!pending_tests && _callback) {
          _callback.call(_results, _callback['arguments']);
        }
      };

  FUNK.set = function (name, val) {
    _results[name] = val;
  };

  FUNK.get = function (name) {
    if (name) {
      return _results[name];
    } else {
      return _results;
    }
  };

  FUNK.add = function (fn) {
    var position = _functions.length;
    _functions.push(fn);

    return function (error, data) {
      if (_style === 'parallel') {
        fn.call(_results, error, data);
        delete _functions[position];
      } else if (_style === 'serial') {
        _functions[position] = {
          fn: fn,
          error: error,
          data: data
        };
      }

      _test();
    };
  };

  FUNK.nothing = function () {
    return FUNK.add(function (error, data) {
      // where unicorns meet rainbows
    });
  };

  FUNK.result = function (name) {
    return FUNK.add(function (error, data) {
      FUNK.set(name, data);
    });
  };

  FUNK.parallel = function (cb) {
    _style = 'parallel';
    _callback = cb;
    _test();
  };

  FUNK.serial = function (cb) {
    _style = 'serial';
    _callback = cb;
    _test();
    _callback = function iterate() {
      if (_functions.length > 0) {
        var element = _functions.shift();
        element.fn.call(_results, element.error, element.data);
        iterate();
      } else {
        cb.call(_results, _callback['arguments']);
      }
    };
  };

  return FUNK;
};
