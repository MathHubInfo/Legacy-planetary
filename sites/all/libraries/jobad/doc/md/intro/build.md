# Building JOBAD

Although JOBAD is a javascript library, it is possible to build it. This concatenates all the required files into one and makes it a lot shorter to include JOBAD into the website. 
Also a minimized version is created by running it through the [Google Closure Compiler](https://developers.google.com/closure/compiler/). 
Similarly, the JOBAD Templates and Documentation are gernated automatically from source files. 

Building is currently only supported on linux, **building is not neccessary for the end user**. Building depends on the following software: 

* [Python](http://www.python.org/), tested with version 2.7.4. Also needs the following libraries / scripts: 
    * [markdown2](https://github.com/trentm/python-markdown2) - a python implmentation of markdown
    * [pygments](http://pygments.org/) - a python syntax highlighter
    * [BeautifulSoup 4](http://www.crummy.com/software/BeautifulSoup/) - a python html library
    * [PythonMarkdownCompiler](https://github.com/tkw1536/PythonMarkdownCompiler), included in the git repository as a git submodule
    * [ClosureCompilerPy](https://github.com/tkw1536/ClosureCompilerPy), included in the git repository as a git submodule
* [GNU Bash](https://www.gnu.org/software/bash/)

All build scripts are located in the `build` subdirectory. 

* To build the demos, use `build-templates.sh`
* To build the documentation, use `build-doc.sh`
* To build the release version, use `build-release.sh`
* To build all of the above, use `build-all.sh`