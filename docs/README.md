## intel-tizen-ivi-engine

Tizen IVI engine infrastructure and reference themes. 

## Installation

Currently you have to have package tarball or gzipped tarball. Installation can be done by invoking following command:

    npm --production install intel-tizen-ivi-engine.tgz
    
## Launching

IVI engine can be launched by invoking following command from installation directory:

    npm start intel-tizen-ivi-engine

After installing and starting IVI engine you can launch application from X-Windows environment by invoking command

	webskeleton -f http://localhost:8088 --width=720 --height=1280

You will probably have to install applications; see section *Package repository service* in Developer Documentation.

## Development process

All commands in this section must be launched from Node.js environment (e.g. Node.js command prompt in Windows).

### Compiling & launching

After retrieving source package you need to install all development dependencies by following invoking command in project root folder (folder where package.json file is located):

	npm install .

After this command you should be able to compile Typescript source codes by invoking following command (for Windows platform use grunt.cmd instead):

	grunt 

After compilation engine can be launched by invoking following command:

	node bin\app.js

Both commands can be chained together in one sequence e.g.:

	grunt && node bin\app.js

### Developer documentation

To build development documentation use following command:

	grunt docs

Developer documentation will be available in `docs` folder. 

### Packaging

Engine, application and theme packages can be created by invoking following Grunt targets:

* clean - Cleans up all temporary locations
* build-engine - Creates engine deployment package (intel-tizen-ivi-engine.tgz)
* build-applications - Creates WGT packages for all applications
* build-themes - Creates THM packages for all themes 
* build - Calls all above targets in one step

## License

See LICENSE file.