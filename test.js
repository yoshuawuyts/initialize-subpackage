const createPkg = require('base-package-json')
const spawn = require('child_process').spawn
const parse = require('safe-json-parse')
const concat = require('concat-stream')
const mapLimit = require('map-limit')
const readdirp = require('readdirp')
const eos = require('end-of-stream')
const json = require('JSONStream')
const mkdirp = require('mkdirp')
const rimraf = require('rimraf')
const pump = require('pump')
const path = require('path')
const test = require('tape')
const fs = require('fs')

test('should create files', function (t) {
  t.plan(11)

  const route = path.join(process.cwd(), 'tmp')
  const cmd = path.join(__dirname, 'bin/cli.js')
  const name = 'test'

  const fns = [ initRepo, runInit, testDir, verifyFiles, verifyPkg ]
  mapLimit(fns, 1, function (fn, cb) { fn(cb) }, function (err) {
    t.error(err)
    rimraf(route, function (err) {
      t.error(err, 'no err')
    })
  })

  function initRepo (next) {
    mkdirp(route, function (err) {
      if (err) return next(err)
      const rs = createPkg()
      const ts = json.stringify()
      const ws = fs.createWriteStream(path.join(route, 'package.json'))
      pump(rs, ts, ws, next)
    })
  }

  function runInit (next) {
    const ps = spawn(cmd, [ '-d', route, '-n', name ])
    pump(ps.stdout, process.stdout)
    pump(ps.stderr, process.stderr)
    eos(ps.stdout, next)
  }

  function testDir (next) {
    fs.stat(path.join(__dirname, 'tmp'), function (err, stats) {
      if (err) return next(err)
      t.ok(stats.isDirectory, 'is dir')
      fs.stat(path.join(__dirname, 'tmp', name), function (err, stats) {
        if (err) return next(err)
        t.ok(stats.isDirectory, 'is dir')
        next()
      })
    })
  }

  function verifyFiles (next) {
    const opts = { root: path.join(route, name) }
    readdirp(opts).pipe(concat({ object: true }, sink))

    function sink (arr) {
      t.ok(Array.isArray(arr), 'is array')

      const files = [
        'index.js',
        'package.json',
        'test.js'
      ]

      arr = arr.map(function (obj) { return obj.path })
      files.forEach(function verifyExists (name) {
        t.notEqual(arr.indexOf(name), -1, name + ' exists')
      })

      next()
    }
  }

  function verifyPkg (next) {
    const loc = path.join(route, name, 'package.json')
    const rs = fs.createReadStream(loc)
    const ws = concat(sink)

    pump(rs, ws, next)

    function sink (buf) {
      const str = String(buf)
      parse(str, function (err, arr) {
        t.error(err, 'no err')
        const obj = arr[0]
        t.ok(obj.name, 'test', 'name')
        t.ok(obj.version, '1.0.0', 'version')
      })
    }
  }
})
