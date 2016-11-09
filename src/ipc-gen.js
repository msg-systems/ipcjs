/*
 **  IPC - Inter Process Communication
 **  Design and Development by msg Applied Technology Research
 **  Copyright (c) 2013 - 2016 msg systems ag (http://www.msg-systems.com/)
 */

var fs = require("fs")

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

fs.writeFileSync("dist/ipcjs.js", js, "utf8")

