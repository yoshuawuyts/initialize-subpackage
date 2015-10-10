# initialize-subpackage [![stability][0]][1]
[![npm version][2]][3] [![build status][4]][5] [![test coverage][6]][7]
[![downloads][8]][9] [![js-standard-style][10]][11]

Create a fresh subpackage and saves it to dependencies (`path:<file>`). Useful
in combintation with [linklocal][12].

## Installation
```sh
$ npm install initialize-subpackage
```

## Usage
```txt
Usage: initialize-subpackage [options]

Options:
  -h, --help         Output usage information
  -v, --version      Output version number
  -n, --name         Set project name
  -c, --css          Create an index.css
  -h, --html         Create an index.html
  -I, --no-index     Don't create an index.js
  -P, --no-package   Don't create a package.json
  -T, --no-test      Don't create a test.js

Examples:
  $ initialize-subpackage       # Create a fresh subpackage
  $ initialize-subpackage -ch   # Create a package with html and css

Docs: https://github.com/yoshuawuyts/initialize-subpackage
Bugs: https://github.com/yoshuawuyts/initialize-subpackage/issues
```

## See Also
- [initialize][13]
- [linklocal][12]
- [initialize-cli][14]
- [initialize-project][15]

## License
[MIT](https://tldrlegal.com/license/mit-license)

[0]: https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square
[1]: https://nodejs.org/api/documentation.html#documentation_stability_index
[2]: https://img.shields.io/npm/v/initialize-subpackage.svg?style=flat-square
[3]: https://npmjs.org/package/initialize-subpackage
[4]: https://img.shields.io/travis/yoshuawuyts/initialize-subpackage/master.svg?style=flat-square
[5]: https://travis-ci.org/yoshuawuyts/initialize-subpackage
[6]: https://img.shields.io/codecov/c/github/yoshuawuyts/initialize-subpackage/master.svg?style=flat-square
[7]: https://codecov.io/github/yoshuawuyts/initialize-subpackage
[8]: http://img.shields.io/npm/dm/initialize-subpackage.svg?style=flat-square
[9]: https://npmjs.org/package/initialize-subpackage
[10]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[11]: https://github.com/feross/standard
[12]: https://github.com/timoxley/linklocal
[13]: https://github.com/yoshuawuyts/initialize
[14]: https://github.com/yoshuawuyts/initialize-cli
[15]: https://github.com/yoshuawuyts/initialize-project
