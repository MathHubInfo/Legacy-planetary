This module provides functionality for copying the images from
../pm-fileboxes (old location) to sites/default/files/pictures in the
Drupal folder and creates, for each image, a node of type image having
a picture and a canonical object name.

HOW TO USE:

1. Make sure you have a sites/default/files/pictures directory and
that it is writeable!

2. Make sure that the table imageMigrate is empty.  Probably the only
reason it wouldn't be empty would be if you've been experimenting with
this module! (truncate table imageMigrate).

3. If it doesn't already exist, create a node-type called image with
the following fields: title (default), image (field_gallery_image),
object canonical name (field_obj_cname).  (Note: the PlanetMath
installation profile creates this for you.)

4. Make sure that all the directories and images in pm-fileboxes have
read permissions (at least 644), otherwise copying will not be
possible.

5. Log into the Drupal site with an account which has the 'administer
features' option (any admin).

6. Go to /migrate/img -- this will copy the files into
sites/default/files/pictures.

7. After all the files are copied, go to /migrate/nodes. This will
create a node for every picture, and will empty the table
imageMigrate.

Notes:

- The image nodes can be found at /image/[image_name]
  (e.g. alpha.planetmath.org/image/triangle.png).

- For the current version, if 2 images have the same name they are
  considered to be the same so only the first occurrence counts.
  Watch out!

FURTHER NOTES: TO CREATE A GALLERY OF IMAGES:

1. Download and install shadowbox module

2. Download shadowbox js library and put it in
sites/all/libraries/shadowbox

3. Use shadowbox format for the field_gallery_image field.

4. Download and install views and views ui modules.

5. Create a view which displays in a grid the field
field_gallery_image of the nodes of type image.

6. In the fields of the view, set the image field as gallery item.


If you have questions write me at vlad@flanche.net or
v.merticariu@jacobs-university.de.
