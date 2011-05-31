     ,dPYb,                           ,dPYb,
     IP'`Yb                           IP'`Yb
     I8  8I                           I8  8I
     I8  8'                           I8  8bgg,
     I8 dP  gg      gg   ,ggg,,ggg,   I8 dP" "8
     I8dP   I8      8I  ,8" "8P" "8,  I8d8bggP"
     I8P    I8,    ,8I  I8   8I   8I  I8P' "Yb,
    ,d8b,_ ,d8b,  ,d8b,,dP   8I   Yb,,d8    `Yb,
    PI8"8888P'"Y88P"`Y88P'   8I   `Y888P      Y8
     I8 `8,
     I8  `8,
     I8   8I
     I8   8I
     I8, ,8'
      "Y8P'


Asynchronous functions made funky!

## What the funk?

Funk is a little module that helps you with the `serial` and `parallel` asynchronous pattern.

## Instalation

``` bash
npm install funk
```

## API

**funk** usage is really simple. You don't need to learn any DSL or weird hacks,
just wrap your callbacks and let the groove do the rest.

### Constructor (pattern) -> Funk

Accepts a string that can be either `parallel` or `serial`, depending on the pattern you want to implement.

``` javascript
var funk = require('funk')('serial');
```

### set (name, value) -> undefined

Save results that will then be recovered on the `run` callback.

``` javascript
var funk = require('funk')('serial');

setTimeout(funk.add(function () {
  funk.set('foo', 'bar');
}, 100);

funk.run(function () {
  assert.equals(this.foo, 'bar');
});
```

### get (name) -> *

Retrieve results previously saved.

``` javascript
var funk = require('funk')('serial');

setTimeout(funk.add(function () {
  funk.set('foo', 'bar');
}, 100);

funk.run(function () {
  assert.equals(funk.get('foo'), 'bar');
});
```

### add (function) -> Function

Adds a callback to be executed either in `parallel` or `serial`.

``` javascript
var funk = require('funk')('parallel');

setTimeout(funk.add(function () {
  funk.set('foo', 'bar');
}, 200);

setTimeout(funk.add(function () {
  funk.set('bar', 'foo');
}, 100);

funk.run(function () {
  assert.equals(funk.get('foo'), 'bar');
  assert.equals(funk.get('bar'), 'foo');
});
```

### nothing () -> Function

Adds the callback to funk and does nothing with the result

``` javascript
var funk = require('funk')('parallel');

setTimeout(funk.nothing());
setTimeout(funk.nothing());

funk.run(function () {
  // both setTimeout are called
});
```

### result (name, value) -> Function

Adds the callback to funk and sets the value.

``` javascript
var funk = require('funk')('parallel');

fs.readFile("./foo.txt", 'utf-8', funk.result('file1'));
fs.readFile("./bar.txt", 'utf-8', funk.result('file2'));

funk.run(function () {
  assert.equal(this.file1, 'foo\n');
  assert.equal(this.file2, 'bar\n');
});
```

### result (callback, onError) -> undefined

Will run all the added functions in `serial` or `parallel` and call _callback_ when all are done.
`this` holds all the results setted with `set` and the `errors`.

If a `onError` callback is implemented it will be called only on getting the first error, ignorign the following requests.

``` javascript
// serial example without declaring `onError` callback
var funk = require('./../')('serial'),
    order = 0;

funk.name = 'fleiba';
funk.results = [];

setTimeout(funk.add(function () {
  order += 1;
  funk.set('order_first', order);
}), 200);

fs.readFile(__dirname + "/data/doo.txt", 'utf-8', funk.add(function () {
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
  assert.equal(this.errors.length, 2); // none of the 2 files exists
  done();
});
```

## Tests

_funk_ is fully tested using [testosterone](https://github.com/masylum/testosterone).

In order to run the tests type:

``` bash
make
```
