module.exports=function(grunt){
    grunt.initConfig({
        browserify:{
            dist:{
                options:{
                    transform:[['babelify',{'loose':"all"}]]
                },
                files: {
                    './priv/static/js/app.js':['./web/static/js/app.js']
                }
            }
        },
        watch:{
            scripts:{
                files:['./web/static/js/*.js'],
                tasks:['browserify']
            },
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');

    grunt.registerTask('default',['watch']);
    grunt.registerTask('build',['browserify']);
};

