/// <binding BeforeBuild='default' />
module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        typescript: {
            base: {
                src: ['ts/**/*.ts'],
                dest: 'js/CP.js',
                options: {
                    module: 'amd', //or commonjs
                    target: 'es5', //or es3
                    basePath: 'ts',
                    sourceMap: false,
                    declaration: true,
                    comments: false
                }
            }
        },
        watch: {
            gruntfile: {
                files: ['gruntfile.js'],
            },
            typescripts: {
                files: ['<%= typescript.base.src %>'],
                tasks: ['typescript:base'],
                options: {
                    spawn: false,
                },
            }
        }
    });

    // Load Tasks
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Definitions
    grunt.registerTask('build', ['typescript:base']);
    grunt.registerTask('default', ['build']);
    
};