/*jslint node: true */
/*jshint esversion: 6 */
"use strict";

let express = require("express");
let request = require("request");
let fs = require("fs");
let http = require("http");

let core = require("mms-core");

let app = express();
let server = app.listen(2500, "0.0.0.0"); //entry port
server.setTimeout = 100000000;

let webcamAddr = ["192.168.2.118"];
let webcamPort = 8080;
let contentId = ["1"];
let destTranscoder = [
  `http://${core.dConfig["NODE_TRANSCODER1"].server.host}:${core.dConfig["NODE_TRANSCODER1"].server.port}/api/video`,
  `http://${core.dConfig["NODE_TRANSCODER2"].server.host}:${core.dConfig["NODE_TRANSCODER2"].server.port}/api/video`,
  `http://${core.dConfig["NODE_TRANSCODER3"].server.host}:${core.dConfig["NODE_TRANSCODER2"].server.port}/api/video`
];
let destTranscoderAlarm = {};


//Metadata to Manager

//Options
//let destHost = core.dConfig["NODE_METADATA_MANAGER"].server.host; //jshint ignore:line
let destHost = core.dConfig["NODE_METADATA_MANAGER"].server.host;  // need to modify in the core app system the dest
let destPort = core.dConfig["NODE_METADATA_MANAGER"].server.port; //jshint ignore:line
let data = {"data": {"id_uploader": 1, "title":"TestVideo", "tags":["test", "enseirb"]}};
let options = {
  url: `http://${destHost}:${destPort}/api/metadata`,
  method: 'POST',
  json: true,
  headers: {
      'Content-Type': 'application/json'
  },
  body: data
};


//Do request

request(options, function(err, res) {
    if (!err && res.statusCode === 200) {
        console.log("OK sent");
    }
    else {
        console.log("Error:" + err);
    }
});



for (let i = 0; i < contentId.length; i++) {
  destTranscoderAlarm[
    i
  ] = `http://${core.dConfig["NODE_TRANSCODER"].server.host}:8088/api/video/` +
    contentId[i];
}

for (let i = 0; i < contentId.length; i++) {
  console.log(contentId[0]);
}

function function1() {
  for (let i = 0; i < contentId.length; i++) {
    request.post(destTranscoderAlarm[i]);
  }
}

function function2() {
    for (let i = 0; i < contentId.length; i++) {
        request.get(`http://${webcamAddr[i]}:${webcamPort}/video`).pipe(request.post(destTranscoder[i]));
    };
}


// call the first chunk of code right away
function1();

// call the rest of the code and have it execute after 1 seconds
setTimeout(function2, 1000);
//setInterval(function2, 100000);


