const readPackage = require('read-closest-package')
const createPkg = require('base-package-json')
const prompt = require('inquirer').prompt
const assign = require('xtend/mutable')
const mapLimit = require('map-limit')
const eos = require('end-of-stream')
const json = require('JSONStream')
const mkdirp = require('mkdirp')
const assert = require('assert')
const touch = require('touch')
const path = require('path')
const pump = require('pump')
const fs = require('fs')

module.exports = initializeSubpackage

// Create a fresh subpackage
// (obj, fn) -> null
function initializeSubpackage (argv, cb) {
  assert.equal(typeof argv, 'object')
  assert.equal(typeof cb, 'function')
  const fns = [
    runPrompt,
    mkdir,
    updatePkg,
    touchFiles,
    createPackage
  ]
  mapLimit(fns, 1, function (fn, next) { fn(argv, next) }, cb)
}

// prompt for stuff
// (obj, fn) -> null
function runPrompt (argv, cb) {
  const questions = []
  if (!argv.name) {
    questions.push({ name: 'name', default: '', message: 'Project name' })
  }

  if (!questions.length) return cb()
  prompt(questions, function (res) {
    assign(argv, res)
    cb()
  })
}

// change to directory
// (obj, fn) -> null
function mkdir (argv, cb) {
  const dir = path.join(argv.directory, argv.name)
  mkdirp(dir, function (err) {
    if (err) return cb(err)
    process.chdir(dir)
    cb()
  })
}

// find the nearest package.json
// and save the file as a local dep
// (obj, fn) -> null
function updatePkg (argv, next) {
  readPackage(function (err, pkg, loc) {
    if (err) return next(err)

    pkg.dependencies = pkg.dependencies || {}
    pkg.dependencies[argv.name] = 'file:' + argv.name

    const ws = fs.createWriteStream(loc)
    ws.end(JSON.stringify(pkg, null, 2))
    eos(ws, next)
  })
}

// touch empty files
// (obj, fn) -> null
function touchFiles (argv, cb) {
  const files = []
  if (!argv['no-index']) files.push('index.js')
  if (!argv['no-test']) files.push('test.js')
  if (argv.html) files.push('index.html')
  if (argv.css) files.push('index.css')

  mapLimit(files, 1, iterator, cb)

  function iterator (file, next) {
    touch(path.join(process.cwd(), file), next)
  }
}

// create a fresh package.json
// (obj, fn) -> null
function createPackage (argv, cb) {
  if (argv['no-package']) return cb()
  const opts = { name: argv.name, private: true }
  const rs = createPkg(opts)
  const ts = json.stringify()
  const ws = fs.createWriteStream(path.join(process.cwd(), 'package.json'))
  pump(rs, ts, ws, cb)
}
