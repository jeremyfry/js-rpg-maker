'use strict';

module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			options: {
				separator: ';',
			},
			dist: {
			  src: ['src/js/*.js'],
			  dest: 'client/scripts.js',
			},
		},
		nodemon: {
			dev: {}
		},
		sass: {
			dev: {
				options: {
					loadPaths: ['src/css/']
				},
				files: [{
					'client/styles.css': 'src/css/editor.scss'
				}]
			}
		},
		watch: {
			css: {
				files: ['src/css/*.scss'],
				tasks: ['update-css']
			},
			js: {
				files: ['src/js/*.js'],
				tasks: ['update-js']
			}
		},
		concurrent: {
			target: {
			tasks: ['sass', 'concat', 'watch', 'nodemon'],
			options: {
				logConcurrentOutput: true
			}
		}
    },

	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-concurrent');

	// Default task(s).
	grunt.registerTask('update-css', ['sass']);
	grunt.registerTask('update-js', ['concat']);
	grunt.registerTask('default', ['sass', 'concat']);
	grunt.registerTask('start', ['concurrent']);
};
