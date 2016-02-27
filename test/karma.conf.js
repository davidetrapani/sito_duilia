// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2016-01-03 using
// generator-karma 0.9.0

module.exports = function(config) {
  'use strict';

  config.set({
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // base path, that will be used to resolve files and exclude
    basePath: '../',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      // bower:js
      'bower_components/jquery/dist/jquery.js',
      'bower_components/angular/angular.js',
      'bower_components/bootstrap-sass-official/assets/javascripts/bootstrap.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/angular-cookies/angular-cookies.js',
      'bower_components/angular-resource/angular-resource.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-sanitize/angular-sanitize.js',
      'bower_components/angular-touch/angular-touch.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js',
      'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'bower_components/angular-bootstrap-lightbox/dist/angular-bootstrap-lightbox.js',
      'bower_components/jquery-bridget/jquery-bridget.js',
      'bower_components/get-style-property/get-style-property.js',
      'bower_components/get-size/get-size.js',
      'bower_components/matches-selector/matches-selector.js',
      'bower_components/eventie/eventie.js',
      'bower_components/doc-ready/doc-ready.js',
      'bower_components/eventEmitter/EventEmitter.js',
      'bower_components/fizzy-ui-utils/utils.js',
      'bower_components/outlayer/outlayer.js',
      'bower_components/masonry/masonry.js',
      'bower_components/isotope/js/item.js',
      'bower_components/isotope/js/layout-mode.js',
      'bower_components/isotope/jquery.isotope.js',
      'bower_components/isotope/js/layout-modes/vertical.js',
      'bower_components/isotope/js/layout-modes/fit-rows.js',
      'bower_components/isotope/js/layout-modes/masonry.js',
      'bower_components/angular-isotope/dist/angular-isotope.js',
      'bower_components/angular-simple-logger/dist/angular-simple-logger.js',
      'bower_components/lodash/lodash.js',
      'bower_components/angular-google-maps/dist/angular-google-maps.js',
      'bower_components/angular-ui-validate/dist/validate.js',
      'bower_components/sweetalert/dist/sweetalert.min.js',
      'bower_components/angular-sweetalert/SweetAlert.js',
      'bower_components/angular-media-queries/match-media.js',
      'bower_components/angular-mocks/angular-mocks.js',
      // endbower
      'app/scripts/**/*.js',
      'test/mock/**/*.js',
      'test/spec/**/*.js'
    ],

    // list of files / patterns to exclude
    exclude: [
    ],

    // web server port
    port: 8080,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [
      'PhantomJS'
    ],

    // Which plugins to enable
    plugins: [
      'karma-phantomjs-launcher',
      'karma-jasmine'
    ],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // Uncomment the following lines if you are using grunt's server to run the tests
    // proxies: {
    //   '/': 'http://localhost:9000/'
    // },
    // URL root prevent conflicts with the site root
    // urlRoot: '_karma_'
  });
};
