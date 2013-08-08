
DESCRIPTION
-----------
Enable users to manage menus inside Organic Groups.

REQUIREMENTS
------------
- Organic Groups module (http://drupal.org/project/og).
- Menu module.

INSTALLATION
------------
- Enable the module.
- Give "administer og menu" permission to the desired roles.
- Visit the og menu configuration page to configure at will.
- Enable group content types for use with OG Menu.

USAGE
-----
- Administrators can create OG menus through the regular menu interface at
  admin/structure/menu/add. Choose a group to associate with the menu.
- Organic group members with the "administer og menu" permission can also manage
  menus at node/[nid]/og_menu.
- "administer og menu" permission can be granted on global or group level.
- Group content types can be enabled for use with OG Menu. Once enabled, users
  can add a menu link directly from the node creation form to any of the menu's
  they have access to.
- For group types, users can create an associated menu by checking
  "Enable menu for this group" on the node edit/creation form.
- You can enable the "OG Menu : single" and the "OG Menu : multiple" blocks at
  admin/build/block.
  - "OG Menu : single" will display the first available menu for the first
    available group in the context.
  - "OG Menu : multiple" will display all available menus for all available
    groups in the context.
- OG menus won't show on the regular menu interface. They show up on
  admin/structure/og_menu.
- Ability to hide OG Menu's from the block admin interface and on other places
  for some contrib modules.

NOTES
-----
Be aware that since menu administration forms are mostly duplicated, if a
contrib module adds functionality to menu administration forms without
additional permissions, these additions may be available for OG menu users with
'administer og menu' permission. This could allow these users to be able to do
things you don't want them to. Please report these modules if you catch one.

TODO/BUGS/FEATURE REQUESTS
--------------------------
- See http://drupal.org/project/issues/og_menu. Please search before filing
  issues in order to prevent duplicates.
- Please test the D7 release and report any bugs or suggestions you might find.

UPGRADING FROM 6.x TO 7.x
&
UPGRADING FROM 7.x-2.x TO 7.x-3.x
---------------------------------
- There currently is no upgrade path! If you need an upgrade path, please file
  an issue.

CREDITS
-------
Originally authored and maintained by Scott Ash (ashsc).

7.x-3.x port contributors (sorry if anyone was forgotten):
  - bulldozer2003
  - zipymonkey
  - jgraham
  - Jackinloadup
  - Wim Vanheste (rv0) (http://www.coworks.net)

7.x initial port contributors:
  - Stefan Vaduva (http://vamist.ro)
  - Nick Santamaria (http://www.itomic.com.au)
  - Frederik Grunta (Aeternum)
  - Wim Vanheste (rv0) (http://www.coworks.net)

7.x maintainers
  - Wim Vanheste (rv0) (http://www.coworks.net)

6.x-2.x maintainer
  - Julien De Luca (jide)