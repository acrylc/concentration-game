module.exports = function(grunt){

   grunt.initConfig({
      

        'gh-pages': {
            options: {
                // clone: 'bower_components/'
            },
            src: [
                'app/bower_components/**/*',
                'app/scripts/*', 'app/styles/*', 'app/index.html', 'app/images/*'
            ]
        },
        // pkg: grunt.file.readJSON('package.json'),
        compass: {
            dist: {
                options: {
                    sassDir: 'app/styles/sass',
                    cssDir: 'app/styles/'
                }
            }
        },
        // sass: {
        //     dist: {
        //         files: {
        //             'app/styles/main.css' : 'app/styles/sass/main.scss'
        //         }
        //     }
        // },
        watch: {
            css: {
                files: '**/**/**/*.scss',
                tasks: ['compass']
            }
        }

    });

	// load modules
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-gh-pages');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('render',['compass']);
    grunt.registerTask('deploy', ['gh-pages']);
    grunt.registerTask('default',['watch']);

};