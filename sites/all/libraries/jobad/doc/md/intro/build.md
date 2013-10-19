# Building JOBAD

Although JOBAD is a javascript library, it is possible to build it. This concatenates all the required files into one and makes it a lot shorter to include JOBAD into the website. 

Also a minimized version is created. Similarly, the JOBAD Templates and Documentation are generated automatically from source files. 

Building is currently only supported on linux, **building is not neccessary for the end user**. Building depends on the following software: 

* [Python](http://www.python.org/), tested with version 2.7.4. Also needs the following libraries / scripts: 
    * [PIP](https://pypi.python.org/pypi/pip), If you want to install the packages automatically. 
* [Node](http://nodejs.org/), tested with version v0.10.13
    * [NPM](https://npmjs.org/), tested with version 1.3.2
* [GNU Bash](https://www.gnu.org/software/bash/)
* [GNU Make](https://www.gnu.org/software/make/)

The following depencies will be installed automatically or are available: 

* [markdown2](https://github.com/trentm/python-markdown2)
* [pygments](http://pygments.org/) - a python syntax highlighter
* [BeautifulSoup 4](http://www.crummy.com/software/BeautifulSoup/)
* [PythonMarkdownCompiler](https://github.com/tkw1536/PythonMarkdownCompiler), included in the git repository
* [Gear](https://npmjs.org/package/gear)
* [Gear-Lib](https://npmjs.org/package/gear-lib)


To build, you can use the makefile provided (run `make target` to build something. )

The following targets are available: 

* `all`: Builds all of JOBAD
* `clean`: Removes all previous built stuff. If possible, also cleans dependencies. 
* `deps`: Gets all dependencies. 
    * `npmdeps` - Gets the node dependencies (if not already available)
    * `pipdeps` - Gets the python dependencies (if not already available)
* `release` - Builds JS + CSS. 
    * `js` - Builds JS. 
        * `js-dev`- Builds the JS Development version
        * `js-min`- Builds the JS Production version
        * `js-libs` - Compress JavaScript Libraries into one file
    * `css` - Builds CSS. 
        * `css-dev`- Builds the CSS Development version
        * `css-min`- Builds the CSS Production version
        * `css-libs` - Compress CSS Libraries into one file
* `doc` - Documentation
* `templates` - Builds the templates.  