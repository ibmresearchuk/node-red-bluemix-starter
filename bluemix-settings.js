/**
 * Copyright 2014, 2019 IBM Corp.
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

var path = require("path");
var util = require("util");
var fs = require("fs");

var cfenv = require("cfenv");
var appEnv = cfenv.getAppEnv();

const REGEX_LEADING_ALPHA = /^[^a-zA-Z]*/;
const REGEX_ALPHA_NUM = /[^a-zA-Z0-9]/g;

function _sanitizeAppName(name) {
    name = name || 'node-red';
    return name.toLowerCase().replace(REGEX_LEADING_ALPHA, '').replace(REGEX_ALPHA_NUM, '');
}

var userDir = path.join(__dirname,".node-red");
// Ensure userDir exists - something that is normally taken care of by
// localfilesystem storage when running locally
if(!fs.existsSync(userDir)) fs.mkdirSync(userDir);
if(!fs.existsSync(path.join(userDir,"node_modules"))) fs.mkdirSync(path.join(userDir,"node_modules"));

var settings = module.exports = {
    uiPort: process.env.PORT || 1880,
    mqttReconnectTime: 15000,
    debugMaxLength: 1000,

    //Flag for enabling Appmetrics dashboard (https://github.com/RuntimeTools/appmetrics-dash)
    useAppmetrics: false,

    userDir: userDir,

    flowFile: "flows.json",

    // Add the bluemix-specific nodes in
    nodesDir: path.join(__dirname,"nodes"),

    // Blacklist the non-bluemix friendly nodes
    nodesExcludes:['90-exec.js','28-tail.js','10-file.js','23-watch.js'],

    // Enable module reinstalls on start-up; this ensures modules installed
    // post-deploy are restored after a restage
    autoInstallModules: true,

    // Move the admin UI
    httpAdminRoot: '/red',

    // Serve up the welcome page
    httpStatic: path.join(__dirname,"public"),

    functionGlobalContext: { },

    // Configure the logging output
    logging: {
        // Only console logging is currently supported
        console: {
            // Level of logging to be recorded. Options are:
            // fatal - only those errors which make the application unusable should be recorded
            // error - record errors which are deemed fatal for a particular request + fatal errors
            // warn - record problems which are non fatal + errors + fatal errors
            // info - record information about the general running of the application + warn + error + fatal errors
            // debug - record information which is more verbose than info + info + warn + error + fatal errors
            // trace - record very detailed logging + debug + info + warn + error + fatal errors
            // off - turn off all logging (doesn't affect metrics or audit)
            level: "info",
            // Whether or not to include metric events in the log output
            metrics: false,
            // Whether or not to include audit events in the log output
            audit: true
        }
    }
};



// Identify the Cloudant storage instance the application should be using.
var storageServiceName;
var storageServiceDetails;


if (process.env.NODE_RED_STORAGE_NAME) {
    // A service has been identifed by the NODE_RED_STORAGE_NAME env var.
    //  - check to see if the named service exists
    storageServiceDetails = appEnv.getService(process.env.NODE_RED_STORAGE_NAME);
    if (!storageServiceDetails) {
        util.log("Failed to find Cloudant service: "+process.env.NODE_RED_STORAGE_NAME+ " (NODE_RED_STORAGE_NAME)");
    } else {
        storageServiceName = process.env.NODE_RED_STORAGE_NAME
    }
} else {
    // No couch service specified by env var - look at the attached services
    var candidateServices = Object.values(appEnv.getServices()).filter(app => app.label === "cloudantNoSQLDB");
    if (candidateServices.length === 0) {
        util.log("No Cloudant service found");
    } else {
        // Use the first in the list - but warn if there are multiple incase we
        // are using the 'wrong' one.
        storageServiceName = candidateServices[0].name;
        storageServiceDetails = candidateServices[0];
        if (candidateServices.length > 1) {
            util.log("Multiple Cloudant services found - using "+storageServiceName+". Use NODE_RED_STORAGE_NAME env var to specify the required instance.");
        }
    }
}

if (!storageServiceName) {
    // No suitable service has been found. Fall back to localfilesystem storage
    util.log("Falling back to localfilesystem storage. Changes will *not* be saved across application restarts.");
} else {
    // Set the Cloudant storage module settings
    settings.cloudantService = {
        // The name of the service instance to use.
        name: storageServiceName,
        // The URL to use
        url: storageServiceDetails.credentials.url,
        // The name of the database to use
        db: process.env.NODE_RED_STORAGE_DB_NAME || _sanitizeAppName(appEnv.name),
        // The prefix for all document names stored by this instance.
        prefix: process.env.NODE_RED_STORAGE_APP_NAME || _sanitizeAppName(appEnv.name)
    }

    util.log("Using Cloudant service: "+storageServiceName+" db:"+settings.cloudantService.db+" prefix:"+settings.cloudantService.prefix);
    settings.storageModule = require("./cloudantStorage");
}
