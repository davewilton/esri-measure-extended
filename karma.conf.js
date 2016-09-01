// Karma configuration
// Generated on Tue Aug 30 2016 07:26:28 GMT+0100 (GMT Daylight Time)

module.exports = function (config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai', 'dojo'],


    // list of files / patterns to load in the browser
    files: [
      'test/main.js',
       //exclude all the files as the main.js does this
      { pattern: 'widgets/**/*.js', included: false }
    ],

        // uncomment the following for code coverage
    preprocessors: {
      // source files, that you wanna generate coverage for
      // do not include tests or libraries
      // (these files will be instrumented by Istanbul)
      'widgets/Measurement/Measurement.js': ['coverage']
    },


    // list of files to exclude
    exclude: [
    ],




    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['dots', 'coverage'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)

    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    plugins: [
      'karma-dojo',
      'karma-mocha',
      'karma-chai',
      'karma-chrome-launcher',
      'karma-phantomjs-launcher',
      'karma-coverage'
    ],

    //stop it showing output from the browser console
    client: {
      captureConsole: false 
    },

    //see: https://github.com/karma-runner/karma-coverage#options
    coverageReporter: {
      type : 'text',
      dir: 'coverage/'
      //,file : 'coverage.txt'
    }
  });
};
