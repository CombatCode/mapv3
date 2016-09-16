module.exports = function(grunt) {
    grunt.initConfig({
        browserify: {
            dist: {
                options: {
                    transform: [['babelify', {
                        "presets": ["es2015-loose", "stage-2"]
                    }]]
                },
                files: {
                    './dist/app.js':['./src/app.js']
                }
            }
        },
        sass: {
            dist: {
                options: {
                    style: 'compressed'
                },
                files: {
                    './dist/app.css': './src/app.scss'
                }
            }
        },
        watch: {
            scripts: {
                files: ['./src/**/*.js'],
                tasks: ['browserify']
            },
            styles: {
                files: ['./src/**/*.scss'],
                tasks: ['sass']
            }
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-sass');

    grunt.registerTask('default', ['watch']);
    grunt.registerTask('build', ['browserify', 'sass']);
};

