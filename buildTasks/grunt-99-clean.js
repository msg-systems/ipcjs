module.exports = function (grunt) {

    /* cleanup */
    grunt.extendConfig({
        clean: {
            clean: ["tmp/*", "tmp", "dist/*"],
            distclean: ["node_modules"]
        }
    })
}