var fs = require("fs")
//var UglifyJS = require("uglify-js");

var jquery = fs.readFileSync("./node_modules/jquery/dist/jquery.js", "utf8")
var please = fs.readFileSync("./lib/please/please.js", "utf8")

var js = fs.readFileSync("tmp/interface-tmpl.js", "utf8")

js = js
    .replace("\"%%JQUERY%%\"", () => {
        return jquery
    })
    .replace("\"%%PLEASE%%\"", () => {
        return please
    })

//js = UglifyJS.minify(js, {fromString: true, compress: {}}).code

fs.writeFileSync("dist/cominterface.js", js, "utf8")

