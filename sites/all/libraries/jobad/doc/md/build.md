# Building JOBAD
**Building is not neccessary for the end user.**

Although JOBAD is a javascript library, it is possible to build it. This concatenates all the required files into one and makes it a lot shorter to include JOBAD into the website. 
A minimized version is also created by running it through the [Google Closure Compiler](https://developers.google.com/closure/compiler/). 

The documentation of JOBAD can also be build. It needs to be compiled from markdown files into html files. 

The examples of JOBAD are also auto-generated from templates. 

Both the current release versions and the Documentation are always found in the repository.

Building is currently only supported on linux. 

**Building is not neccessary for the end user.**
## Building preparations

To build JOBAD, you need to have `python` installed. To compile the minimized version, an active internet connection is required. 

To build the JOBAD documentation, the python modules [markdown2](https://github.com/trentm/python-markdown2), [pygments](http://pygments.org/) and [BeautifulSoup 4](http://www.crummy.com/software/BeautifulSoup/) are required. 

Before you build make sure that all the git submodules of the repository have been pulled. If you cloned with `--recursive` you should be fine, otherwise 
you might want to run `git submodule update --init --recursive`. 

## Building
To build the the JOBAD developments versions, run 

```bash
cd build
./build-release.sh
```

If you wish to build the Documentation, use 

```bash
cd build
./build-doc.sh
```

If you wish to build the Examples, use 

```bash
cd build
./build-templates.sh
```

To build everything use 

```bash
cd build
./build-all.sh
```
