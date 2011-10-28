This module provides functionality for copying the images from ../pm-fileboxes (old location) to sites/default/files/pictures 
in the Drupal folder and creates, for each image, a node of type image having a picture and a canonical object name.

How to use:
1. Make sure that the table imageMigrate is empty. If not empty it (truncate table imageMigrate).
2. Create a node-type called image with the following fields: title (default), image (field_gallery_image), object cannonical name(field_obj_cname).
3. Make sure that all the directories and images in pm-fileboxes have read permissions (at least 644), otherwise copying will not be possible.
4. Log into the Drupal site with an account which has the 'administer features' option (any admin).
5. Go to /migrate/img (alpha.planetmath.org/migrate/img). This will copy the files in sites/default/files/pictures.
6. After all the files are copied (the page above should display "filesc copied"), go to /migrate/nodes. This will create a node for every picture
and will empty the table imageMigrate.

Notes:
1. The canonical name field of the nodes is the name of the folder in which it resides and it is also present in the table planetmath_object. They must exist
in that table as well!
2. The image nodes can be found at /image/[image_name] (e.g. alpha.planetmath.org/image/triangle.png).
3. For the current version, if 2 images have the same name they are considered to be the same so only the first occurrence counts.

To create the gallery:
1. Download and install shadowbox module
2. Download shadowbox js library and put it in sites/all/libraries/shadowbox
3. Use shadowbox format for the field_gallery_image field. 
4. Download and install views and views ui modules.
5. Create a view which displays in a grid the field field_gallery_image of the nodes of type image.
6. In the fields of the view, set the image field as gallery item.

If you have questions write me at vlad@flanche.net or v.merticariu@jacobs-university.de.
