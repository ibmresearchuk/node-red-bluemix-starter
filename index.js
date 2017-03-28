/**
 * Copyright 2017 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

var when = require("when");
var bcrypt = require("bcrypt");
var util = require("util");
var path = require("path");


util.log("Starting Node-RED on Bluemix bootstrap");
util.log("Loading bluemix-settings.js");
var settings = require("./bluemix-settings.js");

if (!settings.adminAuth) {
    // No user-defined security
    var storage;
    if (settings.storageModule) {
        storage = settings.storageModule;
    } else {
        storage = require('./node_modules/node-red/red/runtime/storage/localfilesystem');
    }
    util.log("Loading application settings");
    storage.init(settings).then(storage.getSettings).then(function(runtimeSettings) {
        if (process.env.NODE_RED_USERNAME && process.env.NODE_RED_PASSWORD) {
            util.log("Enabling adminAuth using NODE_RED_USERNAME/NODE_RED_PASSWORD");
            var config = {
                adminAuth: {
                    username: process.env.NODE_RED_USERNAME,
                    password: bcrypt.hashSync(process.env.NODE_RED_PASSWORD, 8),
                    allowAnonymous: (process.env.NODE_RED_GUEST_ACCESS === 'true')
                }
            };

            if (runtimeSettings.bluemixConfig && runtimeSettings.bluemixConfig.hasOwnProperty('adminAuth')) {
                delete runtimeSettings.bluemixConfig.adminAuth;
                storage.saveSettings(runtimeSettings).then(function() {
                    startNodeRED(config);
                });
            } else {
                startNodeRED(config);
            }
        } else if (runtimeSettings.bluemixConfig) {
            util.log("Using runtime settings for adminAuth");
            startNodeRED(runtimeSettings.bluemixConfig);
        } else {
            util.log("Starting first-use setup");
            var server;
            var express = require('express');
            var bodyParser = require('body-parser');
            var app = express();
            app.use(bodyParser.json());
            app.get("/", function(req,res) {
                res.sendFile(path.join(__dirname,"public","first-run.html"));
            });
            app.post("/setup", function(req,res) {
                if (req.body.adminAuth && req.body.adminAuth.password) {
                    req.body.adminAuth.password = bcrypt.hashSync(req.body.adminAuth.password, 8);
                }
                runtimeSettings.bluemixConfig = req.body;
                util.log("Received first-use setup configuration");
                storage.saveSettings(runtimeSettings).then(function() {
                    res.status(200).end();
                    setTimeout(function() {
                        util.log("Stopping first-use setup application");
                        server.shutdown(function() {
                            startNodeRED(req.body);
                        });
                    },1000);
                }).otherwise(function(err) {
                    util.log("Failed to save configuration");
                    util.log(err);
                    res.status(200).end();
                });
            });
            app.use("/",express.static(path.join(__dirname,"public")));
            var http = require('http');
            server = http.createServer(function(req,res) {app(req,res);});
            server = require('http-shutdown')(server);
            server.listen(settings.uiPort,settings.uiHost,function() {});
            util.log("Waiting for first-use setup to complete");
        }
    }).otherwise(function(err) {
        console.log("Failed to initialise storage module");
        console.log(err);
    });
} else {
    startNodeRED({});
}

function startNodeRED(config) {
    if (config.adminAuth && !settings.adminAuth) {
        util.log("Enabling adminAuth security - set NODE_RED_USERNAME and NODE_RED_PASSWORD to change credentials");
        settings.adminAuth = {
            type: "credentials",
            users: function(username) {
                if (config.adminAuth.username == username) {
                    return when.resolve({username:username,permissions:"*"});
                } else {
                    return when.resolve(null);
                }
            },
            authenticate: function(username, password) {
                if (config.adminAuth.username === username && bcrypt.compareSync(password,config.adminAuth.password)) {
                    return when.resolve({username:username,permissions:"*"});
                } else {
                    return when.resolve(null);
                }
            }
        };
        if ((process.env.NODE_RED_GUEST_ACCESS === 'true') || (process.env.NODE_RED_GUEST_ACCESS === undefined && config.adminAuth.allowAnonymous)) {
            util.log("Enabling anonymous read-only access - set NODE_RED_GUEST_ACCESS to 'false' to disable");
            settings.adminAuth.default = function() {
                return when.resolve({anonymous: true, permissions:"read"});
            };
        } else {
            util.log("Disabled anonymous read-only access - set NODE_RED_GUEST_ACCESS to 'true' to enable");
        }
    }
    require('./node_modules/node-red/red.js');
}
