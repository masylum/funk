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

_funk_ will not:

- Make you code asynchronous as if it where synchrnous.
- Add overhead to your application.
- _funk_ and revolution will not be televised.

_funk_ will:

- Make your asynchronous code easier to code.
- Make your code more readable.
- _funk_ will make your sexual life more interesing. Try some James Brown when you get laid.

## Instalation

    npm install funk

## API

_funk_ usage is really simple. You don't need to learn DSLs or weird system,
just wrap your callbacks and let the groove do the rest.

- `set(name, value)`: Save results that will then be recovered o the `serial` or `parallel` callback.
- `get(name)`: Retrieve results previously saved.
- `add(function)`: Adds the function to funk.
- `nothing()`: Adds the function to funk without setting any result.
- `result(name, value)`: Adds the function to funk and sets the value.
- `parallel(callback)`: Will run all the added functions in parallel and call _callback_ when all are done. `this` holds all the results setted with `set`.
- `serial(callback)`: Will run all the added functions in serial and call _callback_ when all are done. `this` holds all the results setted with `set`.

## Parallel example

Funk is really useful when you need to do something after a bunch of asynchronous callbacks are called.

    var funk = require('funk')(),
        assert = require('assert'),
        fs = require('fs');

    funk.set('results', []);

    fs.readFile("dance_moves/james_brown.txt", funk.add(function (er, data) {
      this.moves.push(data);
    }));

    fs.readFile("dance_moves/jackson_5.txt", funk.add(function (er, data) {
      this.moves.push(data);
    }));

    setTimeout(funk.result('foo', 'bar'), 200);

    funk.parallel(function(){
      assert.equals(this.moves.length, 2);
      assert.equals(this.foo, 'bar');
      assert.equals(funk.get('foo'), 'bar');
      console.log('This is funktastic!');
    });

## Serial example

Dealing with nested callbacks can sometimes be a PITA. _funk_ will ease the pain.

    var funk = require('funk')(),
        assert = require('assert'),
        order = 0;

    setTimeout(funk.add(function () {
      order++;
      funk.set('order_first', order);
    }), 200);

    setTimeout(funk.nothing(), 100);

    setTimeout(funk.add(function () {
      order++;
      this.order_second = order;
    }), 5);

    funk.serial(function(){
      assert.equals(this.order_first, 1);
      assert.equals(this.order_second, 2);
      console.log('Funkinbelievable!');
    });

## Tests

_funk_ is fully tested using [testosterone](https://github.com/masylum/testosterone).

    npm install testosterone

In order to run the tests type:

    make
