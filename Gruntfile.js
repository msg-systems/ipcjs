/* global module: true */
module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json")
    });

    /*  load all grunt tasks defined in package.json */
    require("load-grunt-tasks")(grunt, {pattern: "grunt-*"})

    grunt.loadTasks("buildTasks")

    grunt.registerTask("default", ["clean:clean", "jshint", "babel:msg-js-ipc", "execute:msg-js-ipc"])
}