require('dotenv').config({ silent: true });

const gruntTask = (grunt) => {
  grunt.loadNpmTasks('grunt-screeps');

  grunt.initConfig({
    screeps: {
      options: {
        email: process.env.EMAIL,
        password: process.env.PASSWORD,
        branch: process.env.BRANCH,
        ptr: false,
      },
      dist: {
        src: ['dist/*.js'],
      },
    },
  });
};

module.exports = gruntTask;
