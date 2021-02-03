# Getting Started with the LBDserver front end 
This version of the LBDserver aims to be Solid compatible, to support federated construction projects. It is still highly experimental, just as the [Community Solid Server prototype](https://github.com/solid/community-server) on which it relies. 

## Prerequisites
* Make sure you have [nodejs and npm](https://nodejs.org/en/download/) installed.
* (Optional) Create a dedicated folder for all your LBDserver downloads.

## Installation
* (option 1a: using [git](https://git-scm.com/download)) - run `git clone https://github.com/LBDserver/front-react.git` in your favourite terminal, in your favourite folder.
* (option 1b: using ZIP folders) - Go to the CODE button at the top of the repository and click `Download ZIP`. Extract the folder.
* Once the repository is extracted, run `npm install` to install the necessary modules. This may take a while. 

## Startup
* Run the command `npm start` in a terminal (in the folder where you installed this repository)
* The application will be hosted on port 3000. You may find it at http://localhost:3000.

## Initial project setup
* Currently, OIDC authentication is limited to an account on [pod.inrupt.com](https://broker.pod.inrupt.com). You can login via the "Login" button on the Navbar, which will redirect you to the OIDC authentication page. After giving the application (temporary) access rights, you will be redirected to the homepage of the LBDserver frontend.

![screenshot](img/OIDC_approval.png "Screenshot OIDC login using the Inrupt broker")


* You are now authenticated for the current session (don't refresh; at this moment we use an application state, so there are no cookies for a more persistent login (TBD?))
* Go to '/setup' (using the navbar => again: no persistent login yet that would enable use of your browser url bar) and create a new project, which will be loaded immediately.
* You can use the lbdserver "resources" repository to download a sample project (the duplex). If you are authenticated, you can upload documents and graphs to the project. 
* You can now query the project and visualise your sparql query by (1) selecting the gltf file ("DOCUMENTS"), and then select the named graph ("GRAPHS"). A SPARQL editor will pop up, enabling you to visualise certain elements. The default query gives an indication how a guid is linked to an element. The "?guid" parameter is hardcoded in order to visualise the results.
* By default, unauthenticated agents have read access (you can change this at setup or later). => Creating private projects TBD soon (related to Solid authentication with querying).

## End result
If all goes well, you should be able to end up with an interactive 3D environment like the one below:

![screenshot](img/lbd_solid.png "Screenshot of working interface for the Duplex example")

## Create your own plugin
Information on how to create your own plugin is available on the [wiki](https://github.com/LBDserver/front-react/wiki/Creating-a-Plugin-in-the-GUI)