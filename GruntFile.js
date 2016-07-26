module.exports=function(grunt){
    grunt.initConfig({
        browserify:{
            dist:{
                options:{
                    transform:[['babelify',{'loose':"all"}]]
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
                    './dist/main.css': './src/**/*.scss',
                }
            }
        },
        watch:{
            scripts:{
                files:['./src/**/*.js'],
                tasks:['browserify']
            },
            styles:{
                files:['./src/**/*.scss'],
                tasks:['sass']
            }
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');

    grunt.registerTask('default',['watch']);
    grunt.registerTask('build',['browserify', 'sass']);
};

