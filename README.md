Node-RED IBM Cloud Starter Application
====================================

### Node-RED on IBM Cloud

This repository is an example Node-RED application that can be deployed into
IBM Cloud with only a couple clicks. The repo has some improvements by the Entel Ocean team and it's always synced (mirrored) with the IBM's repository.

Try it out for yourself right now by clicking:

[![Deploy to IBM Cloud](https://bluemix.net/deploy/button.png)](https://bluemix.net/deploy?repository=https://github.com/entel-garage/node-red-bluemix-starter-1.git)

### Entel Ocean tweaks: Continuous delivery for your Node-RED instance

This Node-RED instance includes a DevOps toolchain that is preconfigured for continuous delivery.

It includes several useful nodes for you to use Watson services, Microsoft Azure's Cognitive services, create and connect chatbots and more.
This repo is enabled to automatically create a delivery pipeline to keep your Node-RED instance always up to date without compromising uptime while the new CloudFoundry container -with the updated code- is being created by using a load balancer, it also creates an autoscaling service.

### How does this work?

When you click the button, you are taken to IBM Cloud where you get a pick a name
for your application at which point the platform takes over, grabs the code from
this repository and gets it deployed.

It will automatically create an instance of the Cloudant service, call it
`XXXX-cloudantNoSQLDB`, where XXXX is your app name and bind it to you app. This is where your
Node-RED instance will store its data.


When you first access the application, you'll be asked to set some security options
to ensure your flow editor remains secure from unauthorised access.

It includes a set of default flows that are automatically deployed the first time
Node-RED runs.

### Customising Node-RED

This repository is here to be cloned, modified and re-used to allow anyone create
their own Node-RED based application that can be quickly deployed to IBM Cloud.

The default flows are stored in the `defaults` directory in the file called `flow.json`.
When the application is first started, this flow is copied to the attached Cloudant
instance. When a change is deployed from the editor, the version in cloudant will
be updated - not this file.

The web content you get when you go to the application's URL is stored under the
`public` directory.

Additional nodes can be added to the `package.json` file and all other Node-RED
configuration settings can be set in `bluemix-settings.js`.

If you do clone this repository, make sure you update this `README.md` file to point
the `Deploy to IBM Cloud` button at your repository.

If you want to change the name of the Cloudant instance that gets created, the memory
allocated to the application or other deploy-time options, have a look in `manifest.yml`.

---
### Learn more

* [Documentation](https://console.bluemix.net/docs/services/ContinuousDelivery/index.html?pos=2)
* [Toolchains on the Bluemix Garage Method site](https://www.ibm.com/devops/method/category/tools)
* Blog: [Bluemix Continuous Delivery is now live](https://www.ibm.com/blogs/bluemix/2016/11/bluemix-continuous-delivery-is-now-live/)
* Video: [Introducing IBM Bluemix Continuous Delivery](https://www.youtube.com/watch?v=QPSAZ64APpc&feature=youtu.be) (2m12s)
