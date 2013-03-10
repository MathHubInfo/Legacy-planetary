# Our development style

We will be making some very small milestones, picking no more than 10
issues at a time and moving them into the [Hotfix issue queue](https://github.com/cdavid/drupal_planetary/issues?labels=&milestone=4&page=1&state=open).  This
would roughly simulate the "velocity" (tickets per iteration) measure
used by e.g.  the [Pivotal tracker](http://www.pivotaltracker.com/help/faq#whatisvelocity).  I
don't quite know what velocity we'll be able to maintain - but we'd
find out!

Questions or ideas?  Get in touch via the [Google group](http://groups.google.com/group/planetary-dev).

## Summary/TOC

1. [Grab the code](https://github.com/cdavid/drupal_planetary/#grab-the-code-from-this-repository)
1. [Install drush](https://github.com/cdavid/drupal_planetary/#install-drush)
1. [Create database](https://github.com/cdavid/drupal_planetary/#create-database)
1. [Configure Apache](https://github.com/cdavid/drupal_planetary/#configure-apache)
1. [Install required modules](https://github.com/cdavid/drupal_planetary/#install-required-modules)
1. [Install LaTeXML](https://github.com/cdavid/drupal_planetary/#install-latexml)
1. [Set up Virtuoso](https://github.com/cdavid/drupal_planetary/#set-up-virtuoso)
1. [Set up PyRDFa](https://github.com/cdavid/drupal_planetary/#set-up-pyrdfa)
1. [Get the ACE Editor](https://github.com/cdavid/drupal_planetary/#get-the-ace-editor-and-put-it-in-your-libraries-directory)
1. [Get the ShareJS repository](https://github.com/cdavid/drupal_planetary/#get-the-sharejs-repository)
1. [Install Apache Solr](https://github.com/cdavid/drupal_planetary/#install-apache-solr)
1. [LaTeX integration](https://github.com/cdavid/drupal_planetary/#latex-integration-to-generate-pdfs)
1. [Install NNexus](https://github.com/cdavid/drupal_planetary/#install-nnexus)

# Brief installation instructions

Full instructions are [here](http://trac.mathweb.org/planetary/wiki/DrupalPorting).  
To get a minimal working "Math enhanced Drupal", you only need to do the first few steps below.

## GRAB THE CODE FROM THIS REPOSITORY

It's Drupal with our custom extensions.

```
git clone git://github.com/cdavid/drupal_planetary.git
ln -s /home/planetary/drupal_planetary /var/www/drupal
cd drupal_planetary
chmod a+w sites/default/files
cp sites/default/default.settings.php sites/default/settings.php
chmod a+w sites/default/settings.php
```

## INSTALL DRUSH

```
git clone --branch 7.x-5.x http://git.drupal.org/project/drush.git
ln -s /home/planetary/drush/drush /usr/local/bin/drush
```

## CREATE DATABASE

```
mysql -u root -p

CREATE DATABASE planetary;
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, INDEX, ALTER ON planetary.*
TO 'planetary'@'localhost' IDENTIFIED BY 'make-something-up';
```

## CONFIGURE APACHE

```
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
```

## INSTALL REQUIRED MODULES 

```
drush -y dl migrate views features reroute_email references \
 pathauto profile2 subform token relation \
 relation_select  legal recaptcha userpoints userpoints_nc \
 privatemsg content_access ctools delete_all devel backup_migrate commentrss \
 nodeaccess wysiwyg views_php sparql filefield_paths date dhtml_menu \
 riddler apachesolr apachesolr_views

drush -y dl og-7.x-2.x-dev entityreference-7.x-1.x-dev entity-7.x-1.x-dev \
 views_bulk_operations-7.x-3.x-dev captcha-7.x-1.x-dev efq_views-7.x-1.x-dev \
 watcher-7.x-1.x-dev rdfx-7.x-2.x-dev
```

(You'll probably want to look through the [main installation instructions](http://trac.mathweb.org/planetary/wiki/DrupalPorting) to make sure you have all the necessary configuration steps sorted out.)

## INSTALL LATEXML

```
svn co https://svn.mathweb.org/repos/LaTeXML/branches/arXMLiv

apt-get install perlmagick libxml2 libxml2-dev libxslt1.1 libxslt1-dev \
libxml-libxml-perl libclone-perl libdata-compare-perl libio-prompt-perl \
libparse-recdescent-perl libxml-libxslt-perl libdb5.1 libdb5.1-dev \
libgdbm-dev libarchive-zip-perl unzip

sudo perl -MCPAN -e shell
install Parse::RecDescent XML::LibXSLT DB_File Data::Compare File::Which
quit
```

You should grab and install a current version of Mojolicious:

```
wget -O mojo.tar.gz https://github.com/kraih/mojo/tarball/master
tar -zvxf mojo.tar.gz
```
Change to the directory that was unpacked and do:
```
perl Makefile.PL
make
sudo make install
```

Once you've gotten all that sorted out, you can go to the arXMLiv directory and, again,
```
perl Makefile.PL
make
sudo make install
```

### CONFIGURE LATEXML TO RUN UNDER APACHE

```
sudo apt-get install libapache2-mod-perl2 libplack-perl

sudo chgrp -R www-data /path/to/LaTeXML/webapp
sudo chmod -R g+w /path/to/LaTeXML/webapp
```

Create a "latexml" file in ```/etc/apache2/sites-available``` like this:

```
<VirtualHost *:80>
    ServerName latexml.example.com 
    DocumentRoot /path/to/LaTeXML/webapp
    Header set Access-Control-Allow-Origin * 
    <Perl>
      $ENV{PLACK_ENV} = 'production';
      $ENV{MOJO_HOME} = '/path/to/LaTeXML/webapp';
    </Perl>

    <Location />
      SetHandler perl-script
      PerlHandler Plack::Handler::Apache2
      PerlSetVar psgi_app /path/to/LaTeXML/webapp/ltxmojo
    </Location>

    ErrorLog /var/log/apache2/latexml.error.log
    LogLevel warn
    CustomLog /var/log/apache2/latexml.access.log combined
</VirtualHost>
```

and turn it on.

## SET UP VIRTUOSO

```
drush dl libraries rdfx sparql_views
drush -y en libraries
drush -y en rdfx sparql_views views_ui rdfui
```

```
sudo aptitude install dpkg-dev build-essential autoconf automake \
 libtool flex bison gperf gawk m4 make odbcinst libxml2-dev libssl-dev \
 libreadline-dev

wget http://downloads.sourceforge.net/project/virtuoso/virtuoso/6.1.5/virtuoso-opensource-6.1.5.tar.gz
tar -zxvf virtuoso-opensource-6.1.5.tar.gz
cd virtuoso-opensource-6.1.5

./configure --prefix=/usr/local/ --with-readline --program-transform-name="s/isql/isql-v/"
nice make
sudo make install
```

### Invoke via screen
```
/usr/local/bin/virtuoso-t +configfile /usr/local/var/lib/virtuoso/db/virtuoso.ini -fd
```

### Seed your triple store with the Math Subject Classification taxonomy

```
wget http://msc2010.org/mscwork/msc2010.skos
curl -T msc2010.skos http://planetmath.org:8890/DAV/home/pm/rdf_sink/xml.rdf -H "Content-Type: application/rdf+xml" -u dav:PASSWORD
```

## SET UP PYRDFA

First of all, if you're going to use our ```pyrdfa``` module, don't forget that you'll have to patch the Drupal core (see full instructions for details)!

```
git clone git://github.com/RDFLib/PyRDFa.git
cd PyRDFa
sudo python setup.py install
```

The relevant executable is in ```./scripts/localRDFa.py```.  You can test it by pulling down some RDFa enhanced webpage and running

```
python /path/to/PyRDFa/scripts/localRDFa.py -x in.html > out.xml
```

If you run into trouble it may be because you don't have the right versions of required libraries installed.  I solved these problems with the following commands (obtaining rdflib version 3.4.0-dev and html5lib version 0.95) and then rebuilt/reinstalled PyRDFa as above.

```
sudo pip install markdown
git clone git://github.com/RDFLib/rdflib.git
cd rdflib && sudo python setup.py install
```

(Further note: ideally this would be set up to run as a web service, similar
to LaTeXML and so on, but that will take a moment to set up.)

## GET THE ACE EDITOR, AND PUT IT IN YOUR LIBRARIES DIRECTORY

Note that latest versions of this require a library that comes with GCC 4.7, see [these notes](http://askubuntu.com/questions/113291/how-do-i-install-gcc-4-7) on Ubuntu 12.04, including [this](http://superuser.com/a/394811/121972).

```
git clone git://github.com/ajaxorg/ace.git
cd ace
npm install
node Makefile.dryice.js full
```

## GET THE SHAREJS REPOSITORY

```
git clone git://github.com/jucovschi/ShareJS.git
cd ShareJS
git checkout ace_services
```

```
sudo apt-get install redis-server coffeescript
```
Or grab the latest coffeescript if you're on an older system: http://coffeescript.org/

```
npm install redis
sudo npm link
cake.coffeescript build
cake.coffeescript webclient
```

(Alternatively, just ```cake``` depending on how you installed coffeescript.)

### RUN THE SHAREJS SERVER (E.G. WITHIN GNU SCREEN) VIA

```
bin/exampleserver
```

### INSTALL THE SHAREJSSERVICES MODULE 

This module ships with Planetary.  If you haven't already turned it on, do so now:

```
drush -y en sharejsservices
```

And enable the ACE 2.0 editor at ```admin/config/content/wysiwyg```.

## INSTALL APACHE SOLR

Pick a mirror from
[Apache](http://www.apache.org/dyn/closer.cgi/lucene/solr/3.6.1) and
download Solr with a command similar to this one:

```
wget http://mirror.ox.ac.uk/sites/rsync.apache.org/lucene/solr/3.6.1/apache-solr-3.6.1-src.tgz
```

```
tar -zxvf apache-solr-3.6.1-src.tgz
cd apache-solr-3.6.1
sudo apt-get install ant

ant ivy-bootstrap
```
If you don't have the JDK installed you can do something like this (or just ```sudo apt-get install openjdk-6-jdk```):
```
sudo add-apt-repository ppa:ferramroberto/java
sudo apt-get update
sudo apt-get install sun-java6-jdk
```

```
ant compile

mv solr/example/solr/conf/schema.xml solr/example/solr/conf/schema.bak
mv solr/example/solr/conf/solrconfig.xml solr/example/solr/conf/solrconfig.bak
mv solr/example/solr/conf/protwords.txt solr/example/solr/conf/protwords.bak

cd ../drupal_planetary
drush dl apachesolr

cp sites/all/modules/apachesolr/solr-conf/solr-3.x/schema.xml \
 ../apache-solr-3.6.1/solr/example/solr/conf/schema.xml
cp sites/all/modules/apachesolr/solr-conf/solr-3.x/solrconfig.xml \
 ../apache-solr-3.6.1/solr/example/solr/conf/solrconfig.xml
cp sites/all/modules/apachesolr/solr-conf/solr-3.x/protwords.txt \
 ../apache-solr-3.6.1/solr/example/solr/conf/protwords.txt
```

The following step is important to get the relevant webapp to build.
```
cd ../apache-solr-3.6.1/solr/
ant example
```
Then, you can run the webapp:
```
cd example
java -jar start.jar
```
Check it out via ```lynx http://localhost:8983/solr/admin/``` or similar.

Finally, install the Drupal modules so you can use this:
```
drush -y en apachesolr apachesolr_search
```

Now you can visit ```admin/config/search/apachesolr``` to check out the configuration and control re-indexing.  You can check out the details of your index at ```admin/reports/apachesolr/solr```. In order to set Apache Solr as the default search engine (resp. hide the other search engines) you need to change the relevant radio button (resp. tick box) at ```admin/config/search/settings```.

To set up faceted search, install facetapi:
```
drush -y dl facetapi-7.x-1.x-dev
drush -y en facetapi
```
and configure at ```admin/config/search/apachesolr/settings/solr/facets```.

Some further information (YMMV) at http://drupalcode.org/project/apachesolr.git/blob_plain/refs/heads/7.x-1.x:/README.txt  

If you want to search user pages, you should install 

```
drush -y dl apachesolr_user
drush -y en apachesolr_user
```

and visit ```admin/config/search/apachesolr``` to tick the box selecting User as an indexable type.

**Finally, you definitely want to do**
```
drush -y dl apachesolr_views
drush -y en apachesolr_views
```

(PlanetMath will depend on this stuff, so I'll get as much of it as possible into the profile...)

There are some additional plugins but details on those will follow later.  See this ticket [#141](https://github.com/cdavid/drupal_planetary/issues/141) for some further notes.

## LATEX INTEGRATION TO GENERATE PDFs

This is handled by the ```planetmath_view_pdf``` module: make sure the PDFLaTeX command is correct for your system (e.g. ```/usr/bin/pdflatex``` perhaps?  Or ```/usr/local/texlive/2011/bin/x86_64-linux/pdflatex```?) and create the output directory at ```sites/default/files/texpdf/```.

## INSTALL NNEXUS

```
git clone git@github.com:dginev/nnexus.git
wget http://li101-104.members.linode.com/nnexus.sql.gz
gunzip nnexus.sql.gz

mysql> grant all on nnexusdb.* to 'nnexususer'@localhost identified by 'PASSWORD';
mysql> create database nnexusdb;

mysql -u nnexususer --password=PASSWORD nnexusdb < nnexus.sql

sudo perl -MCPAN -e shell
cpan> install XML::Simple Data::Dumper LWP::Simple XML::Writer XML::SAX Unicode::String Graph
cpan> exit

```
Now edit ```baseconf.xml``` so that ```dbname```, ```dbuser```, and ```dbpass``` match the values you specified above.

You can then run the NNexus server (e.g. from within GNU Screen) via

```
./nnexusserver.pl
```

Alternatively, you can run it using Mojolicious and several other standard perl modules which can be installed via apt-get or cpan (cf. LaTeXML section above):

```
apt-get install libmojolicious-perl libxml-simple-perl \
  libunicode-string-perl libgraph-perl libjson-perl
```

Then, in order to run the server:

```
morbo --listen=http://*:3001 nnexusmojo.pl
```

### CONFIGURE NNEXUS TO RUN UNDER APACHE

Create a "nnexus" file in ```/etc/apache2/sites-available``` like this:

```
<VirtualHost *:80>
    ServerName nnexus.example.com 
    DocumentRoot /path/to/nnexus
    Header set Access-Control-Allow-Origin * 
    <Perl>
      $ENV{PLACK_ENV} = 'production';
      $ENV{MOJO_HOME} = '/path/to/nnexus';
    </Perl>

    <Location />
      SetHandler perl-script
      PerlHandler Plack::Handler::Apache2
      PerlSetVar psgi_app /path/to/nnexus/nnexusmojo.pl
    </Location>

    ErrorLog /var/log/apache2/nnexus.error.log
    LogLevel warn
    CustomLog /var/log/apache2/nnexus.access.log combined
</VirtualHost>
```

and turn it on.