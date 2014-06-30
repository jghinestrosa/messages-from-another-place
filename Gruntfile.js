module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: ['dist'],
    useminPrepare: {
      html: 'views/index.html',
      options: {
        root: 'public',
        dest: 'dist'
      }
    },
    usemin: {
      html: 'dist/index.html',
      options: {
        dirs: 'dist'
      }
    },
    copy: {
      main: {
        files: [
          {expand: true, cwd: 'views', src: ['index.html'], dest: 'dist', filter: 'isFile'},
          {expand: true, cwd: 'public/js', src: ['recorderWorker.js'], dest: 'dist/js', filter: 'isFile'},
          {expand: true, cwd: 'public', src: ['img/*'], dest: 'dist/'},
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.registerTask('build', ['clean','copy','useminPrepare','concat','uglify','cssmin','usemin']);

};
