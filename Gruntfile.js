// Generated on <%= (new Date).toISOString().split('T')[0] %> using <%= pkg.name %> <%= pkg.version %>
'use strict';
module.exports = function(grunt) {
    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    //require('time-grunt')(grunt);

// configure the tasks
    grunt.initConfig({



        concat: {
            build: {
                src: [
                    'app/scripts/app.js','app/scripts/directives.js','app/scripts/controllers.js',
                    'app/scripts/filters.js','app/scripts/services.js'
                ],
                dest: 'app/scripts.js'

            },
            manager: {
                src: [
                    'app/manager/scripts/app.js','app/manager/scripts/directives.js','app/manager/scripts/controllers.js',
                    'app/manager/scripts/filters.js','app/manager/scripts/services.js'
                ],
                dest: 'app/scripts.manager.js'

            },

            bower: {
                src: ['app/bower_components/jquery/jquery.js',
                    'app/bower_components/angular/angular.min.js',
                    'app/bower_components/angular-ui-bootstrap/ui-bootstrap-tpls-0.10.0.min.js',
                    'app/bower_components/angular-route/angular-route.min.js',
                    'app/bower_components/angular-ui-router/release/angular-ui-router.min.js',
                    'app/bower_components/angular-resource/angular-resource.min.js',
                    'app/bower_components/angular-cookies/angular-cookies.min.js'

                ],
                dest: 'app/dev_scripts.min.js'
            },
            end: {
                src: [
                    'app/dev_scripts.min.js','app/scripts.min.js'
                    //'js/mylibs/**/*.js'  // Все JS-файлы в папке
                ],
                dest: 'app/all_scripts.min.js'
            },
            endManager: {
                src: [
                    'app/dev_scripts.min.js','app/scripts.manager.min.js'
                    //'js/mylibs/**/*.js'  // Все JS-файлы в папке
                ],
                dest: 'app/all_scripts.manager.min.js'
            }

        },
        // Сжимаем
        uglify: {

            options: {
                mangle: false
            },
            build: {
                files: {
                    // Результат задачи concat
                    'app/scripts.min.js': '<%= concat.build.dest %>',
                    'app/scripts.manager.min.js': '<%= concat.manager.dest %>'
                }
            }
        },



        cssmin: {
            build: {

                files: {
                 'app/main.min.css': ['app/bower_components/bootstrap/dist/css/bootstrap.css','app/styles/style.css']
                 }
            },
            buildManager: {

                files: {
                    'app/main.manager.min.css': ['app/bower_components/bootstrap/dist/css/bootstrap.css','app/manager/styles/admin.css']
                }
            }/*,
            dev: {
                src: 'app/styles/style.css',
                dest: 'app/main2.min.css'

            }*/

        }








    });

// define the tasks
    grunt.registerTask(
        'stylesheets',
        'Compiles the stylesheets.',
        [  'cssmin:build','cssmin:buildManager']//, 'clean:stylesheets'
    );

    grunt.registerTask(
        'scripts',
        'Compiles the JavaScript files.',
        ['concat:build','concat:manager','concat:bower','uglify:build','concat:end','concat:endManager']//
    );

    grunt.registerTask(
        'build',
        'Compiles all of the assets and copies the files to the build directory.',
        [ 'scripts','stylesheets']
           // ,'stylesheets', 'scripts', 'jade' ]
    );




    grunt.registerTask('serve', function (target) {

        grunt.task.run([
            'build'
        ]);
    });



};