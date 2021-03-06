#!/usr/bin/env node
const cliclopts = require('cliclopts')
const minimist = require('minimist')
const util = require('util')
const fs = require('fs')

const pkg = require('../package.json')
const main = require('../')

const opts = cliclopts([
  {
    name: 'help',
    abbr: 'h',
    boolean: true
  },
  {
    name: 'version',
    abbr: 'v',
    boolean: true
  },
  {
    name: 'name',
    abbr: 'n',
    default: ''
  },
  {
    name: 'directory',
    abbr: 'd',
    default: process.cwd()
  },
  {
    name: 'no-index',
    abbr: 'I',
    boolean: true
  },
  {
    name: 'no-package',
    abbr: 'P',
    boolean: true
  },
  {
    name: 'no-test',
    abbr: 'T',
    boolean: true
  },
  {
    name: 'css',
    abbr: 'c',
    boolean: true
  },
  {
    name: 'html',
    abbr: 'h',
    boolean: true
  }
])

const argv = minimist(process.argv.slice(2), opts.options())

// parse options
if (argv.version) {
  const version = require('../package.json').version
  process.stdout.write('v' + version)
  process.exit(0)
} else if (argv.help) {
  process.stdout.write(pkg.name + ' - ' + pkg.description + '\n')
  usage(0)
} else {
  main(argv, function (err) {
    if (err) process.stderr.write(util.format(err) + '\n')
    process.exit(err ? 1 : 0)
  })
}

// print usage & exit
// num? -> null
function usage (exitCode) {
  fs.createReadStream(__dirname + '/usage.txt')
    .pipe(process.stdout)
    .on('close', process.exit.bind(null, exitCode))
}
