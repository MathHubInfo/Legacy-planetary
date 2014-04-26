# JOBAD.repo

* **Function** `JOBAD.repo()` - Marks the current page as a repository page and shows a simple about page. Should be used on repositories only. 
* **Function** `JOBAD.repo.config(data)` - Used inside a repository to configure it. 
    * **Object** `data` Repository config object
        * **Array** `data.provides` Array of modules provided. urls default to [name].js. 
        * **Object** `data.at` Overrides default module locations. A name - path map. 
        * **Array** `data.versions` Array of compatible JOBAD Versions. 
        * **String** `data.name` Name of the repository. 
        * **String** `data.description` Description of the repository. 
* **Function** `JOBAD.repo.init(repo, callback)` - Initialises a new repository. 
    * **String|Array** `repo` - Url(s) of repositories to init. 
    * **Function** `callback(success, message)` - Callback once the repository is inited. 
        * **Boolean** `success` Was the init a success
        * **String** `message` If `success == false` then a message why it failed. 
* **Function** `JOBAD.repo.hasInit(repo)` - Checks if a repository has been inited. 
    * **String** `repo` - Url of repository to  check. 
* **Function** `JOBAD.repo.loadFrom(repo, modules, callback)` - Loads modules from a repository. 
    * **String** `repo` - Url of repository to load from. 
    * **String|Array** `modules` Modules to load
    * **Function** `callback(success, message)` - Callback. 
        * **Boolean** `success` Was loading successfull?
        * **String** `message` If `success == false` then a message why it failed. 
* **Function** `JOBAD.repo.loadAllFrom(repo, callback)` - Loads all modules from a repository. 
    * **String** `repo` - Url of repository to load from. 
    * **Function** `callback(success, message)` - Callback. 
        * **Boolean** `success` Was loading successfull?
        * **String** `message` If `success == false` then a message why it failed. 
* **Function** `JOBAD.repo.provides(repos, modules)` - Checks if all modules are provided by some repository in repos. 
    * **String** `repos` - Optional. Repositories to check. Defaults to all. 
    * **String|Array** `modules` Module(s) to check. 
* **Function** `JOBAD.repo.provide(modules, repos, callback, provideDepdencies)` - Loads modules from some repository. 
    * **String|Array** `modules` Modules to load. 
     * **String|Array** `repos` Repositories to provide modules from. Optional. 
    * **Function** `callback(success, message)` - Callback. 
        * **Boolean** `success` Was loading successfull?
        * **String** `message` If `success == false` then a message why it failed. 
     * **Boolean** `provideDepdencies` Also provide dependencies? Default: true. 
* **Function** `JOBAD.repo.buildPage(element, repo, callback)` - Builds a JOBAD repo page. 
    * **jQuery** `element` Element to build page in. 
    * **String** `repo` Repository to build page about. 
    * **Function** `callback(element)` Optional. Callback once the page has finsihed loading. 
        * `element` The built page element. 