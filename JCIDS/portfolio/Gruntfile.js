module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        obfuscator: {
            options: {
                banner: '// obfuscated with grunt-contrib-obfuscator.\n'
            },
            task1: {
                options: {
                    // options for each sub task
                },
                files: {
                    'js/build/ob.js': [
                        'js/libs/jquery.min.js',
                        'js/functions.js',
                        'js/index.js'
                    ]
                }
            }
        },

        uglify: {
            build: {
                src: 'js/build/ob.js',
                dest: 'js/build/production.min.js'
            }
        },

        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'images/',
                    src: ['*.{png,jpg,gif}'],
                    dest: 'images/build/'
                }]
            }
        },
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-obfuscator');

    grunt.registerTask('default', ['obfuscator', 'uglify', 'imagemin']);

};