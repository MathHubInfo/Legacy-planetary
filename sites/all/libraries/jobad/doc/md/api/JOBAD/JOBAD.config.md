# JOBAD.config
This object contains the configuration settings for JOBAD. 

* **Boolean** `JOBAD.config.debug` - `true` if debugging is enabled, otherwise `false`. Determines if errors are automatically logged to the console. Default: `false` for relase versions, `true` for development versions
* **Boolean** `JOBAD.config.cleanModuleNamespace` - Force modules to have a clean namespace. May cause errors when set to `true` with some modules. Default: `false`
* **Array[String]** `JOBAD.config.disabledEvents` - List of disabled events. Default: `[]`
* **String** `JOBAD.config.storageBackend` - Storage Backend to use. Default: `cookie`