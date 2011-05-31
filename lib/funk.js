/*
 * funk - Asynchronous functions made funky!
 * Copyright(c) 2011 Pau Ramon <masylum@gmail.com>
 * MIT Licensed
 */

module.exports = function (style) {

  var _results = {}
    , _style = style || 'parallel'
    , _callback = null
    , _error_callback = null
    , _had_errors = false
    , _functions = []

    , _version = '1.5.0'
    , FUNK = {}

    , _test = function () {
        var pending_tests = _functions.some(function (el) {
          return typeof el === 'function';
        });

        if (!pending_tests && _callback) {
          _callback.call(_results, _callback['arguments']);
        }
      };

  /**
   * Set a value that is avalable in all `add`, `run` callbacks.
   *
   * The value will be available through the `this` object's attribute and `funk.get`
   * @see FUNK#get
   *
   * @param {String} name
   *   Name of the attribute to set.
   * @param val
   *   Value to store.
   */
  FUNK.set = function (name, val) {
    _results[name] = val;
  };

  /**
   * Get the value set by either FUNK.set() or set by changing the attribute of
   * the `this` object available in the `add` or `run` callbacks.
   * @see FUNK#set
   *
   * @param {String} [name=undefined]
   *   Name of the attribute to retrieve
   *
   * @returns
   *   The value if set, or undefined. In case `name` was not defined,
   *   the whole object.
   */
  FUNK.get = function (name) {
    if (name !== undefined) {
      return _results[name];
    } else {
      return _results;
    }
  };

  /**
   * Add the callback function to the list.
   *
   * The function will be called when the async function is finished (parallel)
   * or when all the previously added async functions have finished (serial).
   *
   * @param {Function} fn
   *   Callback function to call.
   *
   * @returns {Function} Callback function for the async function.
   */
  FUNK.add = function (fn) {
    var position = _functions.length;
    _functions.push(fn);

    return function (error, _) {
      if (error) {
        if (_error_callback) {
          _had_errors ? _error_callback(error) : (_had_errors = true);
          return;
        } else {
          var errors = FUNK.get('errors') || [];
          errors.push(error);
          FUNK.set('errors', errors);
          _had_errors = true;
        }
      }

      if (_style === 'parallel') {
        fn.apply(_results, arguments);
        delete _functions[position];
      } else if (_style === 'serial') {
        _functions[position] = {
          fn: fn,
          'arguments': arguments
        };
      }

      _test();
    };
  };

  /**
   * Placeholder callback to use instead of `add`, when no further steps needed.
   *
   * @see FUNK#add
   *
   * @returns {Function} Callback function for the async function.
   */
  FUNK.nothing = function () {
    return FUNK.add(function () {
      // where unicorns meet rainbows
    });
  };

  /**
   * Serves instead of `add` to just store one of the arguments returned.
   *
   * When the async function calls the callback, one of the arguments will be
   * stored in the hashtable for further use in the subsequent uses of
   * `add` or `run`.
   *
   * @see FUNK#set
   * @see FUNK#add
   *
   * @param {String} name
   *   The name of the attribute to set.
   * @param {Number} [argNum=1]
   *   The argument to store from the arguments object. Default is 1,
   *   as usually the arguments are (error, data).
   *
   * @returns {Function} Callback function for the async function.
   */
  FUNK.result = function (name, argNum) {
    return FUNK.add(function () {
      FUNK.set(name, arguments[typeof argNum === 'undefined' ? 1 : +argNum]);
    });
  };

  /**
   * Listens for all the added functions to finish.
   *
   * The callback function (`cb`) will be called, when all of the functions
   * added by `add`, `nothing` or `result` are already executed.
   *
   * The order of these executions depend wether they where called in `parallel` or `serial`.
   *
   * @param {Function} cb
   *   Callback function to call after all the added functions are done.
   */
  FUNK.run = function (cb, error_cb) {
    if (_style === 'serial') {
      _callback = function iterate() {
        if (_functions.length > 0) {
          var element = _functions.shift();
          element.fn.apply(_results, element['arguments']);
          iterate();
        } else {
          cb.call(_results, _callback['arguments']);
        }
      };
    } else {
      _callback = cb;
    }
    _error_callback = error_cb;
    _test();
  };

  /** TODO: deprecate
   * Listens for all the added functions to finish.
   *
   * The callback function (`cb`) will be called, when all of the functions
   * added by `add`, `nothing`, `result` are already executed.
   * The order of these executions doesn't matter as they run in parallel.
   *
   * @param {Function} cb
   *   Callback function to call after all the added functions are done.
   */
  FUNK.parallel = function (cb) {
    _style = 'parallel';
    _callback = cb;
    _test();
  };

  /** TODO: deprecate
   * Starts to run all the added functions in order.
   *
   * The callback function (`cb`) will be called, when all of the functions
   * added by `add`, `nothing`, `result` are already executed.
   * The order of the execution of these functions are sequential, in the same
   * order they were added.
   *
   * @param {Function} cb
   *   Callback function to call after all the added functions are done.
   */
  FUNK.serial = function (cb) {
    _style = 'serial';
    _callback = cb;
    _test();
    _callback = function iterate() {
      if (_functions.length > 0) {
        var element = _functions.shift();
        element.fn.apply(_results, element['arguments']);
        iterate();
      } else {
        cb.call(_results, _callback['arguments']);
      }
    };
  };

  return FUNK;
};
