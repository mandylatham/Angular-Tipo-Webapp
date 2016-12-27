'use strict';

module.exports = function (grunt) {
  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  var path = require('path');

  // Configuration paths for this application
  var config = {
    npm: require('./package.json'),
    bower: require('./bower.json'),
    gruntMaven: require('./grunt-maven.json'),
    mavenProperties: require('./maven-properties.json'),
    directories: {
      source: 'app',
      staging: 'staging',
      dist: 'dist'
    }
  };

  // Define the configuration for all the tasks
  grunt.initConfig({
    // Application configuration
    config: config,

    mavenPrepare: {
      options: {
        resources: ['**']
      },
      dev: {}
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= config.directories.source %>/{,*/}*.js',
          '!<%= config.directories.source %>/libs/*.js'
        ]
      }
    },

    karma: {
      unit: {
        options: {
          configFile: 'test/karma.conf.js',
          singleRun: true
        }
      }
    },

    watch: {
      source:{
        files: ['<%= config.gruntMaven.filesToWatch %>'],
        tasks: ['mavenPrepare']
      },
      livereload:{
        options: {
          livereload: true,
        },
        files: ['<%= config.directories.source %>/{,*/}*.{html,js,css}']
      },
      bower: {
        files: ['bower.json', '<%= config.directories.source %>/index.html'],
        tasks: ['wiredep']
      }
    },


    less: {
      development: {
        options:{
          sourceMap: true,
          sourceMapFilename: '<%= config.directories.source %>/_styles/main.css.sourcemap',
          sourceMapBasepath: '<%= config.directories.source %>',
          sourceMapURL: 'main.css.sourcemap'
        },
        files: {
          '<%= config.directories.source %>/_styles/main.css': '<%= config.directories.source %>/_styles/manifest.less'
        }
      }
    },


    express: {
      options: {
        hostname: 'localhost',
        port: 9000
      },
      dev: {
        options: {
          bases: [],
          livereload: true,
          server: path.resolve(__dirname, 'express-server.dev.js'),
          open: true
        }
      },
      dist: {
        options: {
          bases: [],
          server: path.resolve(__dirname, 'express-server.dist.js'),
          open: true
        }
      },
      mock: {
        options: {
          bases: [],
          server: path.resolve(__dirname, 'mock/express-server.mock.js'),
          port: 9001,
          open: false
        }
      }
    },


    wiredep: {
      app: {
        src: ['<%= config.directories.source %>/index.html'],
        ignorePath:  /\.\.\//,
        options: {
          exclude: ['/requirejs/']
        }
      }
    },

    filerev: {
      dist: {
        src: [
          '<%= config.directories.dist %>/_scripts/{,*/}*.js',
          '<%= config.directories.dist %>/_styles/{,*/}*.css'
        ]
      }
    },

    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.directories.staging %>/concat/_scripts',
          src: ['*.js', '!oldieshim.js'],
          dest: '<%= config.directories.staging %>/concat/_scripts'
        }]
      }
    },

    useminPrepare: {
      html: '<%= config.directories.source %>/index.html',
      options: {
        root: '<%= config.directories.source %>',
        staging: '<%= config.directories.staging %>',
        dest: '<%= config.directories.staging %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    usemin: {
      html: ['<%= config.directories.dist %>/{,*/}*.html'],
      options: {
        assetsDirs: ['<%= config.directories.dist %>']
      }
    },

    html2js:{
      options:{
        base: '<%= config.directories.source %>',
        module: 'tipo.partials',
        singleModule: true,
        useStrict: true
      },
      dist:{
        src: ['**/*.tpl.html'],
        dest: '<%= config.directories.staging %>/_scripts/partials.module.js'
      }
    },

    copy: {
      dist: {
        files:[
          {
            expand: true,
            cwd: '<%= config.directories.source %>',
            src: ['**/*.html', '**/*.json', '!**/*.tpl.html'],
            dest: '<%= config.directories.dist %>'
          },
          {
            expand: true,
            cwd: '<%= config.directories.source %>',
            src: ['_assets/**'],
            dest: '<%= config.directories.dist %>'
          },
          {
            expand: true,
            cwd: '<%= config.directories.staging %>/_scripts',
            src: ['**'],
            dest: '<%= config.directories.dist %>/_scripts'
          },
          {
            expand: true,
            cwd: '<%= config.directories.staging %>/_scripts/non-bower-managed/separate',
            src: ['**'],
            dest: '<%= config.directories.dist %>/_scripts/non-bower-managed/separate'
          },
          {
            expand: true,
            cwd: '<%= config.directories.staging %>/_styles',
            src: ['**'],
            dest: '<%= config.directories.dist %>/_styles'
          },
          {
            expand: true,
            cwd: '<%= config.directories.source %>/_styles',
            src: ['**/pace.css'],
            dest: '<%= config.directories.dist %>/_styles'
          }
        ]
      }
    },

    'string-replace': {
      google: {
        files: {
          '<%= config.directories.source %>/index.html': '<%= config.directories.source %>/index.html',
          '<%= config.directories.source %>/user/_views/login.tpl.html': '<%= config.directories.source %>/user/_views/login.tpl.html'
        },
        options: {
          replacements: [{
            pattern: '${googleClientId}',
            replacement: config.mavenProperties.googleClientId
          }, {
            pattern: '${googleRecaptchaSitekey}',
            replacement: config.mavenProperties.googleRecaptchaSitekey
          }]
        }
      }
    },

    clean: {
      staging: ['staging']
    }
  });

  grunt.registerTask('default', [
    'mavenPrepare',
    'string-replace',
    'wiredep',
    'jshint',
    //'karma',
    'less',
    'useminPrepare',
    'concat',
    'ngAnnotate',
    'cssmin',
    'uglify',
    'html2js',
    'copy:dist',
    'filerev',
    'usemin',
    'clean'
  ]);

  grunt.registerTask('dev', [
    'mavenPrepare',
    'string-replace',
    'wiredep',
    'jshint',
    //'karma',
    'less',
    'useminPrepare',
    'copy:dist',
    'usemin',
    'clean'
  ]);

  grunt.registerTask('serve-dev', [
    'express:dev',
    'watch'
  ]);

  grunt.registerTask('serve-dist', [
    'express:dist',
    'watch'
  ]);

  grunt.registerTask('serve-mock', [
    'express:mock',
    'express-keepalive'
  ]);

  grunt.registerTask('test', [
    'karma'
  ]);

};