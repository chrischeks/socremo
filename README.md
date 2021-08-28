# Project Title

## NodeJS & MongoDB bank accounts management REST API

## Requirements

For development, you will need Node.js and a node global package installed in your environement.

### Node

- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
  Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v14.17.4

    $ npm --version
    6.14.14

###

---

## Install

    $ git clone https://github.com/chrischeks/account-management.git
    $ cd account-management
    $ npm install

## Configure app

Open `src/@universal/configs/`, there you will see the configurations for different environments. The config for production was intentionally committed to the repository but for a real project it won't.

## Running the project for development

    $ npm run dev

## Running tests

    $ npm run test

## Simple build for production

    $ npm run build

## Running the project on production

    $ npm start
