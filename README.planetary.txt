CONTRIBUTORS

Joe Corneli
Catalin David
Deyan Ginev
Constantin Jucovschi
Andrea Kohlhase
Michael Kohlhase
Christoph Lange
Bogdan Matican
Stefan Mirea
Durim Morina
Vyacheslav Zholudev

INSTALLATION INSTRUCTIONS

git clone git://github.com/cdavid/drupal_planetary.git
ln -s /home/planetary/drupal_planetary /var/www/drupal
cd drupal_planetary
mkdir sites/default/files
chmod a+w sites/default/files
cp sites/default/default.settings.php sites/default/settings.php
chmod a+w sites/default/settings.php

git clone --branch 7.x-4.x http://git.drupal.org/project/drush.git
ln -s /home/planetary/drush/drush /usr/local/bin/drush
You'll need to create a database for Drupal to use:

$ mysql -u root -p

CREATE DATABASE drupaldb;
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, INDEX, ALTER
ON drupaldb.* TO 'drupaluser'@'localhost' IDENTIFIED BY 'make-up-a-password';
Stick something like this in /etc/apache2/sites-available:

<VirtualHost *:80>
  ServerAdmin xxxxxxxxx@gmail.com
  ServerName xxx.yyy.zzz
  DocumentRoot /var/www/drupal/
  <Directory /var/www/drupal/>
      AllowOverride All
      Order allow,deny
      allow from all
  </Directory>
  ErrorLog /var/log/apache2/a.log
  CustomLog /var/log/apache2/a.log combined
</VirtualHost>

Now when you visit xxx.yyy.zzz, you can go through a very easy installation process. After this is done, you should run:

chmod o-w sites/default/settings.php 
Some standard modules we recommend can be installed via

drush dl migrate views features 
drush -y en migrate migrate_ui views views_ui features forum
Last but not least, to enable the math modules that ship with Planetary, run

drush -y en drutexml mathjax wysiwyg_codemirror
You will also have to browse to admin/config/content/formats/tex_editor (make sure all is in order) and also admin/config/content/wysiwyg/ (select CodeMirror as the TeX Editor modality) and admin/config/content/wysiwyg/profile/tex_editor/edit (check the stex button).
