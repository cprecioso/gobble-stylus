# gobble-stylus

Compile [stylus](http://stylus-lang.com) files with gobble.  
This implementation uses a folder transformer instead of a file transformer, which means you can compile an entire folder to a single file and caching won't mess with you.

## Installation

First, you need to have gobble installed - see the [gobble readme](https://github.com/gobblejs/gobble) for details. Then,

```bash
npm i -D cprecioso/gobble-stylus
```

## Usage

```js
const gobble = require('gobble')

module.exports = gobble('src/styles')
  .transform('stylus', {
    sourcemap: true
    // Here you can pass any options you'd pass to the stylus compiler
  })
```

## License

MIT. Copyright 2016 Carlos Precioso