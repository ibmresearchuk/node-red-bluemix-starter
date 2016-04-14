Node-RED Watson Bluemix Starter Application
======================================

### Node-RED Watson in Bluemix

This repository is an example Node-RED application that can be deployed into
Bluemix with only a couple clicks. Try it out for yourself right now by clicking:

[![Deploy to Bluemix](https://bluemix.net/deploy/button.png)](https://bluemix.net/deploy?repository=https://github.com/ylecleach/node-red-bluemix-starter.git)

This is a fork of the Node-RED in Bluemix boilerplate that integrates the following :

- All available Watson nodes for Node-RED on <a href="https://github.com/watson-developer-cloud/node-red-node-watson">GitHub</a>
- Flows from the <a href="https://github.com/watson-developer-cloud/node-red-labs/tree/master/basic_examples">Watson Node-RED Basics Labs</a>
- added Dropbox and Box nodes in the palette

Available Watson Nodes
This Boilerplate shows basics flows sample of the Watson nodes

- Alchemy Image Analysis
- Alchemy Data News
- Alchemy Feature Extraction
- Dialog
- Document Conversion
- Language Identification
- Language Translation
- Natural Language Classifier
- Personality insights
- Relationship Extraction
- Speech to Text
- Text to Speech
- Tradeoff Analytics
- Tone Analyser
- Visual Recognition
- Retrieve and Rank (coming soon)

###Notice
- this Watson Node-RED Boilerplate can be used as a starting point for demo or hackathon, but it is not intended for a production usage
- Watson nodes for Node-RED : these nodes are free of use, and are open-source under the Apache 2</p>
- Watson API / Bluemix services : those nodes needs to be linked with the appropriate Watson service in the Bluemix catalog, and support only one version of each the Watson API. The usage of those services are following a Cost Plan defined in the Bluemix catalog</p>

### How does this work?

When you click the button, you are taken to Bluemix where you get a pick a name
for your application at which point the platform takes over, grabs the code from
this repository and gets it deployed.

It will automatically create an instance of the Cloudant service, call it
`sample-node-red-cloudantNoSQLDB` and bind it to you app. This is where your
Node-RED instance will store its data. If you deploy multiple instances of
Node-RED from this repository, they will share the one Cloudant instance.

It includes a set of default flows that are automatically deployed the first time
Node-RED runs.

### Customising Node-RED

This repository is here to be cloned, modified and re-used to allow anyone create
their own Node-RED based application that can be quickly deployed to Bluemix.

The default flows are stored in the `defaults` directory in the file called `flow.json`.

The web content you get when you go to the application's URL is stored under the
`public` directory.

Additional nodes can be added to the `package.json` file and all other Node-RED
configuration settings can be set in `bluemix-settings.js`.

If you do clone this repository, make sure you update this `README.md` file to point
the `Deploy to Bluemix` button at your repository.

If you want to change the name of the Cloudant instance that gets created, the memory
allocated to the application or other deploy-time options, have a look in `manifest.yml`.
