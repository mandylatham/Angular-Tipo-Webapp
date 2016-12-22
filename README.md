# Installation
This document attempts to outline some setup instructions to get the code building and running on your local environment. This is mainly intended for developers who want to run the UI locally and make changes to the code base.

## Pre-requisite software
1. Install Maven v3.3.3
2. Install a Git client
3. Install Python 2.7.x
4. Install NodeJS v5.5.0
5. Install Bower and Grunt as global node packages
    - `npm install -g bower@1.7.7 grunt-cli@0.1.13`

## Building the source code
1. Clone the Git repository (https://*your_user_id*@bitbucket.org/deltagene/tipo-ui.git)
2. Navigate to the checked out folder, say 'tipo-ui' and run `mvn clean install -Dall` to build the entire source
    - When you run with the 'all' flag, NPM, Bower and Grunt are all executed.
    - If you omit the 'all' flag (default), only the Grunt build runs and this is the usual since NPM and Bower need not be executed every time. They are required only when the package dependencies are altered (bower.json & package.json)

## Running locally
1. Navigate to the 'target-grunt' folder
2. Execute `grunt serve-mock`. This will launch a fully functional mock backend which is included as part of the code base.
    - This serves the mock backend APIs on port 9001 (http://localhost:9001/api/v1)
3. Execute `grunt serve-dev`. This will launch the UI application in development mode (non-minified and non-optimized files)
4. Alternatively, execute `grunt serve-dist`. This will launch the UI application in production mode, (minified, concatenated and optimized files)
    - You should do this to verify that the application will work as expected after the optimizations are applied.

## Customizing data / endpoints
1. To change the mock tipo definitions, edit the file `src/mock/tipo-definitions.json`
2. To change the mock tipo seed data, edit the file `src/mock/tipo-seed-data.json`
3. To change the REST API endpoint -
    - Open the file `src/express-server.dev.js`
    - Change `url: 'http://localhost:9001'` to point to the base URL for the actual API

## Modifying source code
1. All source code lives within the 'src' folder of the project.
2. All the Angular code lives within the 'src/app' folder.
3. Though the application is launched from 'target-grunt', you MUST always make changes only in the 'src' folder.
4. Whenever you do a build, all the files from 'src' are staged into the 'target-grunt' folder and then NPM, Bower and Grunt executes within it. This is done to keep the source and binaries (also staged files) decoupled from each other.
5. When your application is being served using `grunt serve-dev`, a 'watch' is set up on your 'src' folder. So any files you change automatically get picked up and moved to 'target-grunt' and the UI automatically reloads in your browser
6. Some changes do not get reflected in the browser automatically.
    - Less files. You would need to run `grunt dev` from the 'target-grunt' folder and launch the UI again using `grunt serve-dev`
    - bower.json & package.json. You would need to run `mvn clean install -Dall` from the root and launch the UI again using `grunt serve-dev`
7. Any JavaScript dependencies should normally be managed by Bower. For exceptions, add the scripts to the `_scripts/non-bower-managed` directory.