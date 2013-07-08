The JOBAD module provides an API for making use of the JOBAD javascript library in Drupal.

The JOBAD library and drupal API are being actively developed so be aware that changes may occur. The current drupal module is marked as `experimental`.
Feel free to follow development of the JOBAD project at https://trac.omdoc.org/JOBAD or JOBAD codebase at https://github.com/KWARC/jobad


To use in a module `mod` first add `jobad` as a module dependency.
Then, whenever necessary use jobad_add_module($js_file_path, $module_id) to tell JOBAD to
load the module with id $module_id that is implemented in the file $js_file_path.
Finally, after all relevant modules (if any) are loaded, call jobad_initialize() to get load jobad on that page.
jobad_initialize returns an unique instance name that can be used later to mark where that instance will be active.
Currently, A jobad instance is active on all page elements that have its name as id.
e.g. a jobad instance with id "JOBAD1" will be active on <div id="JOBAD1" > ... </div> but not on <div id="foo"> ... </div>.

As an example, you can check out the `mmt` module from https://github.com/m-iancu/planetary/tree/master/sites/all/modules/mmt
