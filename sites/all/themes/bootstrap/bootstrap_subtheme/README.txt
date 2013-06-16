# Bootstrap Sub-theme Starter Kit
* [Requirements](#requirements)
* [Setup](#setup)
* [Enable](#enable)
* [File Structure](#file-structure)
* [Icons](#icons)

## Requirements
* [Bootstrap Base Theme](http://drupal.org/project/bootstrap) - 7.x-2.0-beta3 or higher (must be enabled).
* [jQuery Update](http://drupal.org/project/jquery_update) - 7.x-2.3 or higher. Bootstrap requires a minimum jQuery version of 1.7 or higher. You must manually set this in the configuration upon install.

#### Conditional Requirements for Method 1: Bootstrap Source Files
* [Bootstrap Source](https://github.com/twitter/bootstrap/tags)
* The Bootstrap Library source files are in LESS. You must use either a local LESS preprocessor or install and enable the [LESS](http://dgo.to/less) module - 7.x-3.0-beta1 or higher (see [setup](#setup)).

## Setup
You will need to copy this starter kit sub-theme into `sites/all/themes` or a
respectable `sites/*/themes` folder. You should never modify a theme or bundled
sub-theme directly as all changes would be lost if the base theme were to be
updated. Once copied, rename the folder to something of your choosing:
`my_bootstrap_theme`. Then make sure you rename the  `bootstrap_subtheme.info.starterkit`
file to match the folder name, like: `my_bootstrap_theme.info`. Be sure to
change the name and description properties inside the file as well.

**IMPORTANT NOTE**
Ensure that the `.starterkit` suffix is not added to your sub-theme's .info
filename. This suffix is simply a stop-gap measure to ensure that the bundled
starter kit sub-theme cannot be enabled or used directly. This helps people
unfamiliar with Drupal avoid modifying the starter kit sub-theme directly and
forces the new sub-theme to be properly configured.

#### Bootstrap Library Methods
There a currently two types of supported methods for adding the Bootstrap
Library into your sub-theme. By default, the Bootstrap base theme enables a CDN
to provide the necessary files. If this method suites you then you can skip
this step. 

The first method is probably the most dynamic and will grant you the ability
to change the variables and utilize the mixins provided by the Bootstrap
Library.

The second method is rather simple and utilizes the CDN Bootstrap Library via
the base theme. It is very static and will require you to override existing
styling in your sub-theme.


Regardless of which method you choose, you will need to un-comment the
appropriate lines for your desired method in your sub-theme's .info file.

##### Method 1: Bootstrap Source Files
Downloaded and extract the latest 2.x version of the [Bootstrap Library](https://github.com/twitter/bootstrap/tags) into your new sub-theme.
After it has been extracted, the folder should read `bootstrap`. If for
whatever reason you have an additional bootstrap folder wrapping the the
bootstrap folder (like: bootstrap/bootstrap), remove the wrapping bootstrap
folder. You will not need to touch these files again. This allows the framework
to be updated in the future.

**IF USING THE LESS MODULE**
Change the stylesheets include of your sub-theme's .info file from
`css/style.css` to `less/style.less`. These will be generated once the theme is
enabled and viewed.

**IF USING A LOCAL PREPROCESSOR**
Compile the `./less/style.less` file. A new file should be generated as
`./css/style.css`.

Lastly, you will need to uncomment the lines in your sub-theme's .info file
(pertaining to this method) before anything will work.

##### Method 2: Bootstrap CDN
This method is rather simple, you don't have to do anything unless you wish to
override the default Bootstrap base theme settings. If so, just uncomment the
lines pertaining to Method 2.

Edit the provided `./css/style.css` file to your liking.

## Enable
Navigate to `admin/appearance` and click "Enable and set default" for your
sub-theme.

## File Structure
The following paths are relative to your sub-theme's base folder. These folders
have an additional README.txt file. Please read them for a more detailed
explanation of their contents.

`./css` - Compiled sub-theme source files.
`./less` - Sub-theme source files.
`./templates` - Template files.

## Icons
These instructions are intended for use with Method 1. By default, this
sub-theme uses the packaged [Glyphicons](http://twitter.github.com/bootstrap/base-css.html#icons).
However, given the limited capability of static sprite images, it is
recommended that these not be used and an alternative solution, like
[Fontello](http://drupal.org/project/fontello), be used. If a different icon
implementation is used, comment out or remove the line
`@import "./bootstrap/less/sprites.less";` from `./less/bootstrap.less`.
Recompile or flush cached LESS files if using the LESS module.
