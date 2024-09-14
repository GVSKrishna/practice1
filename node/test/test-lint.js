/*jslint node: true */
/*jslint es6 */
/*jshint esversion: 6 */
/*jshint mocha: true */
/*eslint-env mocha */

'use strict';

const Lint = require('mocha-eslint');

// Array of paths to lint
// Note: a seperate Mocha test will be run for each path and each file which
// matches a glob pattern
const paths = [
    'bin/www',
    'api',
    'test',
    'routes',
    'middleware',
    'models',
    'utils',
    'app.js',
    'config.js'
];

const options = {
    // Specify style of output
    formatter: 'stylish',  // Defaults to `stylish`

    timeout: 5000,

    // Consider linting warnings as errors and return failure
    strict: false  // Defaults to `false`, only notify the warnings
};

// Run the tests
Lint(paths, options);
