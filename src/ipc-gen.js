var fs = require("fs")
//var UglifyJS = require("uglify-js");

var jquery = fs.readFileSync("./node_modules/jquery/dist/jquery.js", "utf8")
var please = fs.readFileSync("./lib/please/please.js", "utf8")

var js = fs.readFileSync("tmp/ipc-tmpl.js", "utf8")

js = js
    .replace("\"%%JQUERY%%\"", () => {
        return jquery
    })
    .replace("\"%%PLEASE%%\"", () => {
        return please
    })

//js = UglifyJS.minify(js, {fromString: true, compress: {}}).code

fs.writeFileSync("dist/msg-js-ipc.js", js, "utf8")

