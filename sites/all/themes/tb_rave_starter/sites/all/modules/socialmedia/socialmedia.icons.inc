<?php 

/**
 * @file
 * Functions pertaining to iconset management
 */

function socialmedia_icon_style_options($for_widgets = TRUE, $platform = NULL) {
  $icons = socialmedia_iconset_info();
  $options = array();
  if ($for_widgets) {
    $options[] = t('Default');
  }
  foreach ($icons AS $iconset_name => $iconset) {
    if (socialmedia_iconset_is_installed($iconset_name)) {
      foreach ($iconset['styles'] AS $sid => $style) {
        if ($for_widgets) {
          $options[$iconset['name']][base_path() . call_user_func($iconset['path callback'], $platform, $sid)] = $style;
        }
        else {
          $options[$iconset['name']][$iconset_name . ':' . $sid] = $style;
        }
      }       
    }
  }
  return $options;
}

function socialmedia_iconset_is_installed($iconset) {
  
  $iconsets = socialmedia_iconset_info();
  return file_exists(call_user_func($iconsets[$iconset]['path callback']));
}

function socialmedia_icon_platforms($featured = FALSE) {
  $platforms = array( 
    //'box' => t('Box'),
    //'blinklist' => t('Blinklist'),
    'delicious' => t('Del.icio.us'),
    'digg' => t('Digg'),    
    'email' => t('E-mail'),  
    'facebook' => t('Facebook'),
    'flickr' => t('Flikr'),
    //'furl' => t('Furl'),
    'google' => t('Google'),
    'googleplus' => t('Google+'),
    'lastfm' => t('Last.fm'),
    'linkedin' => t('LinkedIn'),
    //'misterwong' => t('Mister Wong'),
    //'mixx' => t('Mixx'),
    //'myspace' => t('MySpace'),
    'newsvine' => t('Newsvine'),
    'pinterest' => t('Pinterest'),
    'reddit' => t('Reddit'),
    'rss' => t('RSS'),
    //'slashdot' => t('Slashdot'),
    'slideshare' => t('Slideshare'),
    'stumbleupon' => t('StumbleUpon'),
    'technorati' => t('Technorati'),
    'twitter' => t('Twitter'),
    'vimeo' => t('Vimeo'),
    'yahoo' => t('Yahoo!'),
    'youtube' => t('YouTube'),
  );
  
  if ($featured) {
    unset($platforms['blinklist']);
    unset($platforms['lastfm']);
    //unset($platforms['slideshare']);
  }  
  
  return $platforms;
}

function socialmedia_iconset_info() {
  $iconsets = &drupal_static(__FUNCTION__);

  // Grab from cache or build the array.
  if (isset($iconsets)) {
    return $iconsets; 
  }
  $iconsets = array();
  $iconsets = module_invoke_all('socialmedia_iconset_info');

  drupal_alter('socialmedia_iconset_info', $iconsets);

  return $iconsets; 
}

function socialmedia_socialmedia_iconset_info() {
  $icons['levelten_glossy'] = array(
    'name' => 'LevelTen Glossy',                                 // name of your icon set
    'publisher' => 'LevelTen Interactive',                       // name of publisher  
    'publisher url' => 'http://www.leveltendesign.com',          // url to publisher's site 
    'styles' => array(                                           // different variants of icons available  
      '16x16' => '16x16',
      '32x32' => '32x32', 
      '48x48' => '48x48', 
    ),
    'path callback' => 'socialmedia_icon_path_levelten_glossy',  // callback for icon urls
  );
  $icons['icondock'] = array(
    'name' => 'Icon Dock Vector',
    'publisher' => 'Icon Dock',
    'publisher url' => 'http://icondock.com',
    'styles' => array(
      '16px' => '16x16',
      '24px' => '24x24',
      '32px' => '32x32',  
    ),
    'path callback' => 'socialmedia_icon_path_icondock', 
    'download' => 'http://icondock.com/free/vector-social-media-icons',
  );
  $icons['dryicons'] = array(
    'name' => 'DryIcons Social',
    'publisher' => 'DryIcons',
    'publisher url' => 'http://dryicons.com',
    'styles' => array(
      '16x16' => '16x16',
      '24x24' => '24x24',
      '32x32' => '32x32',
      '48x48' => '48x48',
      '64x64' => '64x64', 
      '128x128' => '128x128', 
    ),
    'path callback' => 'socialmedia_icon_path_dryicons', 
    'download' => 'http://dryicons.com/free-icons/category/social/',
    'additional instructions' => t('Download the PNG version of all four sets. Some directories are misnamed in set 2. For example, the correct file path to the 32x32 twitter icon should be "socialmedia/icons/dryicons/png/32x32/twitter.png". Merge icons from folders ending in "px", e.g. 64x64px, into their non px equivalents, e.g. 64x64. NOTE: there are some inconsistancies in file naming that may need to be corrected for specific icon sizes.',
      array('%directory' => drupal_get_path('module', 'socialmedia') . '/icons/dryicons/')
    )
  );
  $icons['instantshift'] = array(
    'name' => 'SocialShift',
    'publisher' => 'instantShift',
    'publisher url' => 'http://www.instantshift.com',
    'styles' => array(
      '16' => '16x16',
      '32' => '32x32',
      '64' => '64x64', 
    ),
    'path callback' => 'socialmedia_icon_path_instantshift', 
    'download' => 'http://www.instantshift.com/2010/12/07/socialshift-icon-set-246-free-social-networking-icons/',
  );
  $icons['jankoatwarpspeed'] = array(
    'name' => 'Handycons',
    'publisher' => 'Janko at Warp Speed',
    'publisher url' => 'http://www.jankoatwarpspeed.com',  
    'styles' => array(
      '16x16' => '16x16',
      '32x32' => '32x32',
      '64x64' => '64x64', 
      '128x128' => '128x128', 
    ),
    'path callback' => 'socialmedia_icon_path_jankoatwarpspeed', 
    'download' => 'http://www.jankoatwarpspeed.com/post/2008/10/20/handycons-a-free-hand-drawn-social-media-icon-set.aspx',
    'additional instructions' => t('Also download and install the !link. NOTE: Make sure to install the Handycons2 icon set.',
      array('!link' => l(t('Handycons 2 set'), 'http://www.jankoatwarpspeed.com/post/2009/02/23/Handycons-2-another-free-hand-drawn-icon-set.aspx'))
    ),
  );
  $icons['ristaumedia'] = array(
    'name' => 'ristaumedia Social Media',
    'publisher' => 'ristaumedia',
    'publisher url' => 'http://ristaumedia.deviantart.com', 
    'styles' => array(
      '32x32' => '32x32',
    ),
    'path callback' => 'socialmedia_icon_path_ristaumedia', 
    'download' => 'http://ristaumedia.deviantart.com/art/Social-Media-Icons-Volume-3-268850170',
  );
  $icons['theg-force'] = array(
    'name' => 'Hand Drawn',
    'publisher' => 'TheG-Force',
    'publisher url' => 'http://theg-force.deviantart.com/', 
    'styles' => array(
      '24x24' => '24x24',
      '32x32' => '32x32',
      '48x48' => '48x48',
      '64x64' => '64x64',  
    ),
    'path callback' => 'socialmedia_icon_path_thegforce', 
    'download' => 'http://theg-force.deviantart.com/art/Social-Icons-hand-drawned-109467069',
  );
  $icons['arbent/clean'] = array(
    'name' => 'Social Media Circles (clean)',
    'publisher' => 'Ar-bent-ing',
    'publisher url' => 'http://arbent.net',  
    'styles' => array(
      '32x32' => '32x32',
      '64x64' => '64x64', 
      '128x128' => '128x128', 
    ),
    'path callback' => 'socialmedia_icon_path_arbent_clean', 
    'download' => 'http://arbent.net/blog/social-media-circles-icon-set',
  );
  $icons['arbent/grunge'] = array(
    'name' => 'Social Media Circles (grunge)',
    'publisher' => 'Ar-bent-ing',
    'publisher url' => 'http://arbent.net',  
    'styles' => array(
      '32x32' => '32x32',
      '64x64' => '64x64', 
      '128x128' => '128x128', 
    ),
    'path callback' => 'socialmedia_icon_path_arbent_grunge', 
    'download' => 'http://arbent.net/blog/social-media-circles-icon-set',
  );

  return $icons;
}

function socialmedia_icon_path_levelten_glossy($platform = 'twitter', $style = NULL) {
  $style = isset($style) ? $style : '32x32';
  $path = drupal_get_path('module', 'socialmedia') . '/icons/levelten/glossy/' . $style . '/' . ((isset($pt[$platform]))? $pt[$platform] : $platform) . '.png'; 
  return $path;
}

function socialmedia_icon_path_dryicons($platform = 'twitter', $style = NULL) {
  $style = isset($style) ? $style : '32x32';
  $pt = array(
    'googleplus' => 'google_plus',
    ''
  );
  $path = drupal_get_path('module', 'socialmedia') . '/icons/dryicons/PNG/' . $style . '/' . ((isset($pt[$platform]))? $pt[$platform] : $platform) . '.png'; 
  return $path;
}

function socialmedia_icon_path_icondock($platform = 'twitter', $style = NULL) {
  $style = isset($style) ? $style : '32px';
  $t = array(
    'googleplus' => 'google-plus',
  );
  $path = drupal_get_path('module', 'socialmedia') . '/icons/icondock/Vector Social Media Icons/png/' . $style . '/' . ((isset($t[$platform]))? $t[$platform] : $platform) . '.png'; 
  return $path;
}

function socialmedia_icon_path_thegforce($platform = 'twitter', $style = NULL) {
  $trans = array(
    'delicious' => 'Del icio us',
    'digg' => 'Digg',
    'facebook' => 'Facebook',
    'flickr' => 'Flickr',
    'google' => 'Google',
    'googleplus' => 'Google',
    'lastfm' => 'LastFM',
    'linkedin' => 'Linkedin',
    'myspace' => 'Myspace',
    'reddit' => 'Reddit',
    'rss' => 'RSS',   
    'stumbleupon' => 'StumbleUpon',
    'technorati' => 'Technorati',
    'twitter' => 'Twitter',
    'vimeo' => 'Vimeo',
    'youtube' => 'Youtube',
  );
  if (!isset($trans[$platform])) {
    return FALSE;
  }
  $style = isset($style) ? $style : '32x32';
  $path = drupal_get_path('module', 'socialmedia') . '/icons/theg-force/Social icons Hand Drawn/' . $trans[$platform] . '/' . $style . '.png'; 
  return $path;
}

function socialmedia_icon_path_jankoatwarpspeed($platform = 'twitter', $style = NULL) {
  $style = isset($style) ? $style : '32x32';
  
  $pt = array(
    'googleplus' => 'google',
  );
  
  $st = array(
    'blinklist' => 1,
    'twitter' => 1,
    'facebook' => 1,
    'flickr' => 1,
    'google' => 1,
    'googleplus' => 1,
    'lastfm' => 1,
    'linkedin' => 1,
    'newsvine' => 1,
    'vimeo' => 1,
    'youtube' => 1,
    'yahoo' => 1,
  );
  if (isset($st[$platform])) {
    list($style, $t) = explode('x', $style); 
  }

  $style = isset($style) ? $style : '32x32';
  $path = drupal_get_path('module', 'socialmedia') . '/icons/jankoatwarpspeed/' . ((isset($pt[$platform]))? $pt[$platform] : $platform) . '_' . $style . '.png'; 
  return $path;
}

function socialmedia_icon_path_ristaumedia($platform = 'twitter', $style = NULL) {
  $pt = array(
    'email' => 'mail',
    'flickr' => 'flikr'
  );
  $path = drupal_get_path('module', 'socialmedia') . '/icons/ristaumedia/icons png/' . ((isset($pt[$platform]))? $pt[$platform] : $platform) . '.png'; 
  return $path;
}

function socialmedia_icon_path_arbent_clean($platform = 'twitter', $style = NULL) {
  $style = isset($style) ? $style : '32x32';
  $pt = array(
    'email' => 'mail',
  );
  $path = drupal_get_path('module', 'socialmedia') . '/icons/arbent/clean/' . $style . '/' . ((isset($pt[$platform]))? $pt[$platform] : $platform) . '.png'; 
  return $path;
}

function socialmedia_icon_path_arbent_grunge($platform = 'twitter', $style = NULL) {
  $style = isset($style) ? $style : '32x32';
  $pt = array(
    'email' => 'mail',
  );
  $path = drupal_get_path('module', 'socialmedia') . '/icons/arbent/grunge/' . $style . '/' . ((isset($pt[$platform]))? $pt[$platform] : $platform) . '.png'; 
  return $path;
}

function socialmedia_icon_path_instantshift($platform = 'twitter', $style = NULL) {
  $style = isset($style) ? $style : '32';
  $pt = array(
    'delicious' => 'del.icio.us',
    'email' => 'mail',
    'googleplus' => 'buzz',
    'lastfm' => 'last_fm',
    'stumbleupon' => 'StumbleUpon',
  );
  $path = drupal_get_path('module', 'socialmedia') . '/icons/instantshift/' . $style . '/' . ((isset($pt[$platform]))? $pt[$platform] : $platform) . '.png'; 
  return $path;
}
