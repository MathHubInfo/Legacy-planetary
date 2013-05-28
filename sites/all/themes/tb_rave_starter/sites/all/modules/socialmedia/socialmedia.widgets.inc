<?php

/**
 * @file
 * Functions needed to execute image elements provided by Image module.
 */

/**
 * Implements hook_widgets_element_info().
 */
function socialmedia_widgets_element_info() {
  //$addthis_js = '<script type="text/javascript" src="http://s7.addthis.com/js/250/addthis_widget.js#username=[?addthis_username:[socialmedia:addthis:username]]"></script>';
  $elements = array(
    'socialmedia_twitter-tweet-no-count' => array(
      'label' => t('Twitter tweet button (no count)'),
      'help' => t('Resizing will make images an exact set of dimensions. This may cause images to be stretched or shrunk disproportionately.'),
      'group' => t('Social media: Twitter'),
      'template' => '<a href="https://twitter.com/share" class="twitter-share-button" data-count="none">Tweet</a><script type="text/javascript" src="//platform.twitter.com/widgets.js"></script>',
      //'form callback' => 'widgets_template_auto_form',
    ), 
    'socialmedia_twitter-tweet-horizontal-count' => array(
      'label' => t('Twitter tweet button with horizontal count'),
      'help' => t('Resizing will make images an exact set of dimensions. This may cause images to be stretched or shrunk disproportionately.'),
      'group' => t('Social media: Twitter'),
      'template' => '<a href="https://twitter.com/share" class="twitter-share-button" data-count="horizontal">Tweet</a><script type="text/javascript" src="//platform.twitter.com/widgets.js"></script>',
          //'form callback' => 'widgets_template_auto_form',
    ), 
  );
  
  // AddThis advanced widgets
  $elements = array_merge($elements, socialmedia_widgets_element_addthis_addthis_counter()); 
  $elements = array_merge($elements, socialmedia_widgets_element_addthis_email());
  $elements = array_merge($elements, socialmedia_widgets_element_addthis_facebook_like());  
  $elements = array_merge($elements, socialmedia_widgets_element_addthis_google_plusone()); 
  $elements = array_merge($elements, socialmedia_widgets_element_addthis_pinterest_pinit());    
  $elements = array_merge($elements, socialmedia_widgets_element_addthis_stumbleupon_badge());
  $elements = array_merge($elements, socialmedia_widgets_element_addthis_tweet());  
  
  
  // Facebook advanced widgets
  $elements = array_merge($elements, socialmedia_widgets_element_facebook_like_box());
  $elements = array_merge($elements, socialmedia_widgets_element_facebook_like_button());  // PVE 7/2/12

  // LinkedIn advanced widgets
  $elements = array_merge($elements, socialmedia_widgets_element_linkedin_share_button());  
  
  // RSS widgets
  //$elements = array_merge($elements, socialmedia_widgets_element_rss_button());
  
  // Twitter advanced widgets
  $elements = array_merge($elements, socialmedia_widgets_element_twitter_profile_widget());
  
  // StumbleUpon advanced widgets
  $elements = array_merge($elements, socialmedia_widgets_element_stumbleupon_badge());
  
  // standard base platform widgets
  $elements = array_merge($elements, socialmedia_base_platforms_info());
  
  return $elements;
}

function socialmedia_base_platforms_info() {
  $platforms = socialmedia_base_platforms();
  $elements = array();
  $labelpost = array(
    'profile-url' => t('profile url'),
    'profile-text-link' => t('profile text link'),
    'profile-button' => t('profile button'),    
    'share-text-link' => t('share text link'),
    'share-button' => t('share button'),
    'feed-url' => t('feed url'),
    'feed-text-link' => t('feed text link'),
    'feed-button' => t('feed button'),
  );
  foreach ($platforms AS $platform_name => $platform) {
    foreach ($platform['templates'] AS $template_name => $template) {
      $elements['socialmedia_socialmedia-' . $platform_name . '-' . $template_name] = array(
        'platform' => $platform_name,
        'label' => t('Socialmedia @platform @type', 
          array(
            '@platform' => $platform['label'],
            '@type' => $labelpost[$template_name],
          )),
        //'help' => t('Resizing will make images an exact set of dimensions. This may cause images to be stretched or shrunk disproportionately.'),
        'group' => $platform['group'],
        'template' => $template,
        //'form callback' => 'socialmedia_widgets_share_platforms_form',
      );
      // add form callback if fields
      if ($template_name != 'share-text-link') {
        $elements['socialmedia_socialmedia-' . $platform_name . '-' . $template_name]['form callback'] = 'socialmedia_widgets_share_platforms_form';
      }
    }
  }
  return $elements;
}

function socialmedia_base_platforms() {
  $platforms = array();
  
  $platforms['delicious'] = array(
    'label' => t('Delicious'),
    'group' => t('Social media: Delicious'),
  );
  $title = t("Bookmark on Del.icio.us");
  $platforms['delicious']['templates'] = array(
    'share-text-link' => '<a href="http://del.icio.us/post?url=[|[node:url]||[current-page:url]|]&title=[|[node:title]||[current-page:title-plain]|]" title="[?link-text=' . $title . '?]"[?link-target= target="{[socialmedia:sm-default_link_target_sharing]}"?][?link-rel= rel="{[socialmedia:sm-default_link_rel_sharing]}"?]>[?link-text=' . $title . '?]</a>',
    'share-button' => '<a href="http://del.icio.us/post?url=[|[node:url]||[current-page:url]|]&title=[|[node:title]||[current-page:title-plain]|]" title="[?link-text=' . $title . '?]"[?link-target= target="{[socialmedia:sm-default_link_target_sharing]}"?][?link-rel= rel="{[socialmedia:sm-default_link_rel_sharing]}"?]><img src="[?icon-path=[socialmedia:sm-delicious_icon-path]?]" alt="Del.icio.us icon" ></a>',
  ); 

  $platforms['digg'] = array(
    'label' => t('Digg'),
    'group' => t('Social media: Digg'),
  );
  $title = t("Post to Digg");
  $platforms['digg']['templates'] = array(
    'share-text-link' => '<a href="http://digg.com/submit?phase=2&url=[|[node:url]||[current-page:url]|]&title=[|[node:title]||[current-page:title-plain]|]" title="[?link-text=' . $title . '?][?link-target= target="{[socialmedia:sm-default_link_target_sharing]}"?][?link-rel= rel="{[socialmedia:sm-default_link_rel_sharing]}"?]">[?link-text=' . $title . '?]</a>',
    'share-button' => '<a href="http://digg.com/submit?phase=2&url=[|[node:url]||[current-page:url]|]&title=[|[node:title]||[current-page:title-plain]|]" title="[?link-text=' . $title . '?]"[?link-target= target="{[socialmedia:sm-default_link_target_sharing]}"?][?link-rel= rel="{[socialmedia:sm-default_link_rel_sharing]}"?]><img src="[?icon-path=[socialmedia:sm-digg_icon-path]?]" alt="Digg icon" ></a>',
  );  
  
  $platforms['facebook'] = array(
    'label' => t('Facebook'),
    'group' => t('Social media: Facebook'),
  );
  $title = t("Visit !varusername on Facebook", array('!varusername' => '[?profile_username=[socialmedia:sm-facebook_username]?]'));
  $stitle = t("Share on Facebook");
  $platforms['facebook']['templates'] = array(
    'profile-url' => "[?profile_url=[socialmedia:sm-facebook_url]?]",
    'profile-text-link' => '<a href="[?profile_url=[socialmedia:sm-facebook_url]?]" title="' . $title . '"[?link-target= target="{[socialmedia:sm-default_link_target_profile]}"?][?link-rel= rel="{[socialmedia:sm-default_link_rel_profile]}"?]>[?profile_username=[socialmedia:sm-facebook_username]?]</a>',  
    'profile-button' => '<a href="[?profile_url=[socialmedia:sm-facebook_url]?]" title="' . $title . '"[?link-target= target="{[socialmedia:sm-default_link_target_profile]}"?][?link-rel= rel="{[socialmedia:sm-default_link_rel_profile]}"?]><img src="[?icon-path=[socialmedia:sm-facebook_icon-path]?]" alt="Facebook icon"></a>',
    'share-text-link' => '<a href="http://www.facebook.com/sharer.php?u=[|[node:url]||[current-page:url]|]&t=[|[node:title]||[current-page:title-plain]|]" title="[?link-text=Share on Facebook?]"[?link-target= target="{[socialmedia:sm-default_link_target_sharing]}"?][?link-rel= rel="{[socialmedia:sm-default_link_rel_sharing]}"?]>[?link-text=' . $title . '?]</a>',
    'share-button' => '<a href="http://www.facebook.com/sharer.php?u=[|[node:url]||[current-page:url]|]&t=[|[node:title]||[current-page:title-plain]|]" title="' . $title . '"[?link-target= target="{[socialmedia:sm-default_link_target_sharing]}"?][?link-rel= rel="{[socialmedia:sm-default_link_rel_sharing]}"?]><img src="[?icon-path=[socialmedia:sm-facebook_icon-path]?]" alt="Facebook icon" ></a>',
  );
  
  $platforms['flickr'] = array(
    'label' => t('Flickr'),
    'group' => t('Social media: Flickr'),
  );
  $title = t("Visit !varusername on Flickr", array('!varusername' => '[?profile_username=[socialmedia:sm-flickr_username]?]'));
  $platforms['flickr']['templates'] = array(
    'profile-url' => "[?profile_url=[socialmedia:sm-flickr_url]?]",
    'profile-text-link' => '<a href="[?profile_url=[socialmedia:sm-flickr_url]?]" title="' . $title . '"[?link-target= target="{[socialmedia:sm-default_link_target_sharing]}"?][?link-rel= rel="{[socialmedia:sm-default_link_rel_sharing]}"?]>[?profile_username=[socialmedia:sm-flickr_username]?]</a>',  
    'profile-button' => '<a href="[?profile_url=[socialmedia:sm-flickr_url]?]" title="' . $title . '"[?link-target= target="{[socialmedia:sm-default_link_target_sharing]}"?][?link-rel= rel="{[socialmedia:sm-default_link_rel_sharing]}"?]><img src="[?icon-path=[socialmedia:sm-flickr_icon-path]?]" alt="Flickr icon"></a>',
  );
  
  $platforms['google'] = array(
    'label' => t('Google'),
    'group' => t('Social media: Google'),
  );
  $platforms['google']['templates'] = array(
    'share-text-link' => '<a href="http://www.google.com/bookmarks/mark?op=add&bkmk=[|[node:url]||[current-page:url]|]&title=[|[node:title]||[current-page:title-plain]|]" title="[?link-text=Bookmark on Google?][?link-target= target="{[socialmedia:sm-default_link_target_sharing]}"?][?link-rel= rel="{[socialmedia:sm-default_link_rel_sharing]}"?]">[?link-text=Bookmark on Google?]</a>',
    'share-button' => '<a href="http://www.google.com/bookmarks/mark?op=add&bkmk=[|[node:url]||[current-page:url]|]&title=[|[node:title]||[current-page:title-plain]|]" title="[?link-text=Bookmark on Google?]"[?link-target= target="{[socialmedia:sm-default_link_target_sharing]}"?][?link-rel= rel="{[socialmedia:sm-default_link_rel_sharing]}"?]><img src="[?icon-path=[socialmedia:sm-google_icon-path]?]" alt="Google icon" ></a>',
  );
  
  $platforms['googleplus'] = array(
    'label' => t('Google+'),
    'group' => t('Social media: Google+'),
  );
  $title = t("Visit !varusername on Google+", array('!varusername' => '[?profile_username=[socialmedia:sm-googleplus_username]?]'));
  $platforms['googleplus']['templates'] = array(
    'profile-url' => "[?profile_url=[socialmedia:sm-googleplus_url]?]",
    'profile-text-link' => '<a href="[?profile_url=[socialmedia:sm-googleplus_url]?]" title="' . $title . '"[?link-target= target="{[socialmedia:sm-default_link_target_profile]}"?][?link-rel= rel="{[socialmedia:sm-default_link_rel_profile]}"?]>[?profile_username=[socialmedia:sm-googleplus_username]?]</a>',  
    'profile-button' => '<a href="[?profile_url=[socialmedia:sm-googleplus_url]?]" title="' . $title . '"[?link-target= target="{[socialmedia:sm-default_link_target_profile]}"?][?link-rel= rel="{[socialmedia:sm-default_link_rel_profile]}"?]><img src="[?icon-path=[socialmedia:sm-googleplus_icon-path]?]" alt="Google+ icon" ></a>',
  );
  
  $platforms['linkedin'] = array(
    'label' => t('LinkedIn'),
    'group' => t('Social media: LinkedIn'),
  );
  $title = t("Visit !varusername on LinkedIn", array('!varusername' => '[?profile_username=[socialmedia:sm-linkedin_username]?]'));
  $stitle = t("Share on LinkedIn");
  $platforms['linkedin']['templates'] = array(
    'profile-url' => "[?profile_url=[socialmedia:sm-linkedin_url]?]",
    'profile-text-link' => '<a href="[?profile_url=[socialmedia:sm-linkedin_url]?]" title="' . $title . '"[?link-target= target="{[socialmedia:sm-default_link_target_profile]}"?][?link-rel= rel="{[socialmedia:sm-default_link_rel_profile]}"?]>[?profile_username=[socialmedia:sm-linkedin_username]?]</a>',  
    'profile-button' => '<a href="[?profile_url=[socialmedia:sm-linkedin_url]?]" title="' . $title . '"[?link-target= target="{[socialmedia:sm-default_link_target_profile]}"?][?link-rel= rel="{[socialmedia:sm-default_link_rel_profile]}"?]><img src="[?icon-path=[socialmedia:sm-linkedin_icon-path]?]" alt="LinkedIn icon" ></a>',
    'share-text-link' => '<a href="http://www.linkedin.com/shareArticle?mini=true&url=[|[node:url]||[current-page:url]|]&title=[|[node:title]||[current-page:title-plain]|]&source=' . $_SERVER['HTTP_HOST'] . '" title="[?link-text=' . $stitle . '?]"[?link-target= target="{[socialmedia:sm-default_link_target_sharing]}"?][?link-rel= rel="{[socialmedia:sm-default_link_rel_sharing]}"?]>[?link-text=' . $stitle . '?]</a>',
    'share-button' => '<a href="http://www.linkedin.com/shareArticle?mini=true&url=[|[node:url]||[current-page:url]|]&title=[|[node:title]||[current-page:title-plain]|]" title="[?link-text=' . $stitle . '?]"[?link-target= target="{[socialmedia:sm-default_link_target_sharing]}"?][?link-rel= rel="{[socialmedia:sm-default_link_rel_sharing]}"?]><img src="[?icon-path=[socialmedia:sm-linkedin_icon-path]?]" alt="LinkedIn icon" ></a>',
  );
  
  $platforms['myspace'] = array(
    'label' => t('MySpace'),
    'group' => t('Social media: MySpace'),
  );
  $stitle = t("Share on MySpace");
  $platforms['myspace']['templates'] = array(
    'share-text-link' => '<a href="http://www.myspace.com/index.cfm?fuseaction=postto&u=[|[node:url]||[current-page:url]|]&t=[|[node:title]||[current-page:title-plain]|]" title="[?link-text=' . $stitle . '?]"[?link-target= target="{[socialmedia:sm-default_link_target_sharing]}"?][?link-rel= rel="{[socialmedia:sm-default_link_rel_sharing]}"?]>[?link-text=' . $stitle . '?]</a>',
    'share-button' => '<a href="http://www.myspace.com/index.cfm?fuseaction=postto&u=[|[node:url]||[current-page:url]|]&t=[|[node:title]||[current-page:title-plain]|]" title="[?link-text=' . $stitle . '?]"[?link-target= target="{[socialmedia:sm-default_link_target_sharing]}"?][?link-rel= rel="{[socialmedia:sm-default_link_rel_sharing]}"?]><img src="[?icon-path=[socialmedia:sm-myspace_icon-path]?]" alt="MySpace icon" ></a>',
  );
  
  $platforms['newsvine'] = array(
    'label' => t('Newsvine'),
    'group' => t('Social media: Newsvine'),
  );
  $stitle = t("Post on Newsvine");
  $platforms['newsvine']['templates'] = array(
    'share-text-link' => '<a href="http://www.newsvine.com/_tools/seed&save?u=[|[node:url]||[current-page:url]|]&h=[|[node:title]||[current-page:title-plain]|]" title="[?link-text=' . $stitle . '?]"[?link-target= target="{[socialmedia:sm-default_link_target_sharing]}"?][?link-rel= rel="{[socialmedia:sm-default_link_rel_sharing]}"?]>[?link-text=' . $stitle . '?]</a>',
    'share-button' => '<a href="http://www.newsvine.com/_tools/seed&save?u=[|[node:url]||[current-page:url]|]&h=[|[node:title]||[current-page:title-plain]|]" title="[?link-text=' . $stitle . '?]"[?link-target= target="{[socialmedia:sm-default_link_target_sharing]}"?][?link-rel= rel="{[socialmedia:sm-default_link_rel_sharing]}"?]><img src="[?icon-path=[socialmedia:sm-newsvine_icon-path]?]" alt="Newsvine icon" ></a>',
  );
  
  $platforms['pinterest'] = array(
    'label' => t('Pinterest'),
    'group' => t('Social media: Pinterest'),
  );
  $title = t("Visit !varusername on Pinterest", array('!varusername' => '[?profile_username=[socialmedia:sm-pinterest_username]?]'));
  $stitle = t("Pin It");
  $platforms['pinterest']['templates'] = array(
    'profile-url' => "[?profile_url=[socialmedia:sm-pinterest_url]?]",
    'profile-text-link' => '<a href="[?profile_url=[socialmedia:sm-pinterest_url]?]" title="' . $title . '"[?link-target= target="{[socialmedia:sm-default_link_target_profile]}"?][?link-rel= rel="{[socialmedia:sm-default_link_rel_profile]}"?]>[?profile_username=[socialmedia:sm-pinterest_username]?]</a>',  
    'profile-button' => '<a href="[?profile_url=[socialmedia:sm-pinterest_url]?]" title="' . $title . '"[?link-target= target="{[socialmedia:sm-default_link_target_profile]}"?][?link-rel= rel="{[socialmedia:sm-default_link_rel_profile]}"?]><img src="[?icon-path=[socialmedia:sm-pinterest_icon-path]?]" alt="Pinterest icon" ></a>',
    //'share-text-link' => '<a href="http://pinterest.com/pin/create/button/?url=[|[node:url]||[current-page:url]|]&media=[|[node:title]||[current-page:title-plain]|]" title="[?link-text=Pin It?]"[?link-target= target="{[socialmedia:sm-default_link_target_sharing]}"?][?link-rel= rel="{[socialmedia:sm-default_link_rel_sharing]}"?]>[?link-text=Pin It?]</a>',
    'share-button' => '<a href="javascript:void((function()%7Bvar%20e=document.createElement(&apos;script&apos;);e.setAttribute(&apos;type&apos;,&apos;text/javascript&apos;);e.setAttribute(&apos;charset&apos;,&apos;UTF-8&apos;);e.setAttribute(&apos;src&apos;,&apos;http://assets.pinterest.com/js/pinmarklet.js?r=&apos;+Math.random()*99999999);document.body.appendChild(e)%7D)());" title="[?link-text=' . $stitle . '?]"[?link-target= target="{[socialmedia:sm-default_link_target_sharing]}"?][?link-rel= rel="{[socialmedia:sm-default_link_rel_sharing]}"?]><img src="[?icon-path=[socialmedia:sm-pinterest_icon-path]?]" alt="Pinterest icon" ></a>',
  );
  // note: code from: http://www.brandaiddesignco.com/blog/add-a-custom-pinterest-pin-it-button-to-your-website/375/
  
  $platforms['reddit'] = array(
    'label' => t('Reddit'),
    'group' => t('Social media: Reddit'),
  );
  $stitle = t("Post to Reddit");
  $platforms['reddit']['templates'] = array(
    'share-text-link' => '<a href="http://reddit.com/submit?url=[|[node:url]||[current-page:url]|]&title=[|[node:title]||[current-page:title-plain]|]" title="[?link-text=' . $stitle . '?]"[?link-target= target="{[socialmedia:sm-default_link_target_sharing]}"?][?link-rel= rel="{[socialmedia:sm-default_link_rel_sharing]}"?]>[?link-text=' . $stitle . '?]</a>',
    'share-button' => '<a href="http://reddit.com/submit?url=[|[node:url]||[current-page:url]|]&title=[|[node:title]||[current-page:title-plain]|]" title="[?link-text=' . $stitle . '?]"[?link-target= target="{[socialmedia:sm-default_link_target_sharing]}"?][?link-rel= rel="{[socialmedia:sm-default_link_rel_sharing]}"?]><img src="[?icon-path=[socialmedia:sm-reddit_icon-path]?]" alt="Reddit icon" ></a>',
  );
      
  $platforms['rss'] = array(
    'label' => t('RSS'),
    'group' => t('Social media: RSS'),
  );
  $stitle = t("Subscribe via RSS");
  $stitle2 = t("Subscribe to !varfeedname via RSS", array('!varfeedname' => '[?profile_username=[socialmedia:sm-rss_feedname]?]'));
  $platforms['rss']['templates'] = array(
    'feed-url' => "[?profile_url=[socialmedia:sm-rss_url]?]",
    'feed-text-link' => '<a href="[?profile_url=[socialmedia:sm-rss_url]?]" title="' . $stitle . '"[?link-target= target="{[socialmedia:sm-default_link_target_profile]}"?][?link-rel= rel="{[socialmedia:sm-default_link_rel_profile]}"?]>[?profile_feedname=[socialmedia:sm-rss_feedname]?]</a>',  
    'feed-button' => '<a href="[?profile_url=[socialmedia:sm-rss_url]?]" title="' . $stitle2 . '"[?link-target= target="{[socialmedia:sm-default_link_target_profile]}"?][?link-rel= rel="{[socialmedia:sm-default_link_rel_profile]}"?]><img src="[?icon-path=[socialmedia:sm-rss_icon-path]?]" alt="RSS icon" ></a>',
  );

  $platforms['slideshare'] = array(
    'label' => t('SlideShare'),
    'group' => t('Social media: SlideShare'),
  );
  $title = t("Visit !varusername on SlideShare", array('!varusername' => '[?profile_username=[socialmedia:sm-slideshare_username]?]'));
  $platforms['slideshare']['templates'] = array(
    'profile-url' => "[?profile_url=[socialmedia:sm-slideshare_url]?]",
    'profile-text-link' => '<a href="[?profile_url=[socialmedia:sm-slideshare_url]?]" title="' . $title . '"[?link-target= target="{[socialmedia:sm-default_link_target_profile]}"?][?link-rel= rel="{[socialmedia:sm-default_link_rel_profile]}"?]>[?profile_username=[socialmedia:sm-slideshare_username]?]</a>',  
    'profile-button' => '<a href="[?profile_url=[socialmedia:sm-slideshare_url]?]" title="' . $title . '"[?link-target= target="{[socialmedia:sm-default_link_target_profile]}"?][?link-rel= rel="{[socialmedia:sm-default_link_rel_profile]}"?]><img src="[?icon-path=[socialmedia:sm-slideshare_icon-path]?]" alt="SlideShare icon" ></a>',
  );

  $platforms['stumbleupon'] = array(
    'label' => t('StumbleUpon'),
    'group' => t('Social media: StumbleUpon'),
  );
  $stitle = t("Stumble this on StumbleUpon");
  $platforms['stumbleupon']['templates'] = array(
    'share-text-link' => '<a href="http://www.stumbleupon.com/submit?url=[|[node:url]||[current-page:url]|]&title=[|[node:title]||[current-page:title-plain]|]" title="[?link-text=' . $stitle . '?]"[?link-target= target="{[socialmedia:sm-default_link_target_sharing]}"?][?link-rel= rel="{[socialmedia:sm-default_link_rel_sharing]}"?]>[?link-text=' . $stitle . '?]</a>',
    'share-button' => '<a href="http://www.stumbleupon.com/submit?url=[|[node:url]||[current-page:url]|]&title=[|[node:title]||[current-page:title-plain]|]" title="[?link-text=' . $stitle . '?]"[?link-target= target="{[socialmedia:sm-default_link_target_sharing]}"?][?link-rel= rel="{[socialmedia:sm-default_link_rel_sharing]}"?]><img src="[?icon-path=[socialmedia:sm-stumbleupon_icon-path]?]" alt="StumbleUpon icon" ></a>',
  ); 

  $platforms['technorati'] = array(
    'label' => t('Technorati'),
    'group' => t('Social media: Technorati'),
  );
  $stitle = t("Favorite on Technorati");
  $platforms['technorati']['templates'] = array(
    'share-text-link' => '<a href="http://technorati.com/faves?sub=addfavbtn&add=[|[node:url]||[current-page:url]|]" title="[?link-text=' . $stitle . '?]"[?link-target= target="{[socialmedia:sm-default_link_target_sharing]}"?][?link-rel= rel="{[socialmedia:sm-default_link_rel_sharing]}"?]>[?link-text=' . $stitle . '?]</a>',
    'share-button' => '<a href="http://technorati.com/faves?sub=addfavbtn&add=[|[node:url]||[current-page:url]|]" title="[?link-text=' . $stitle . '?]"[?link-target= target="{[socialmedia:sm-default_link_target_sharing]}"?][?link-rel= rel="{[socialmedia:sm-default_link_rel_sharing]}"?]><img src="[?icon-path=[socialmedia:sm-technorati_icon-path]?]" alt="Technorati icon"></a>',
  ); 

  $platforms['twitter'] = array(
    'label' => t('Twitter'),
    'group' => t('Social media: Twitter'),
  );
  $title = t("Visit !varusername on Twitter", array('!varusername' => '[?profile_username=[socialmedia:sm-twitter_username]?]'));
  $stitle = t("Tweet this");
  $platforms['twitter']['templates'] = array(
    'profile-url' => "[?profile_url=[socialmedia:sm-twitter_url]?]",
    'profile-text-link' => '<a href="http://twitter.com/[?profile_username=[socialmedia:sm-twitter_username]?]" title="' . $title . '"[?link-target= target="{[socialmedia:sm-default_link_target_profile]}"?][?link-rel= rel="{[socialmedia:sm-default_link_rel_profile]}"?]>@[?profile_username=[socialmedia:sm-twitter_username]?]</a>',  
    'profile-button' => '<a href="http://twitter.com/[?profile_username=[socialmedia:sm-twitter_username]?]" title="' . $title . '"[?link-target= target="{[socialmedia:sm-default_link_target_profile]}"?][?link-rel= rel="{[socialmedia:sm-default_link_rel_profile]}"?]><img src="[?icon-path=[socialmedia:sm-twitter_icon-path]?]" alt="Twitter icon" ></a>',
    'share-text-link' => '<a href="http://twitter.com/share?url=[|[node:url]||[current-page:url]|]&text=[|[node:title]||[current-page:title-plain]|]" title="' . $stitle . '"[?link-target= target="{[socialmedia:sm-default_link_target_sharing]}"?][?link-rel= rel="{[socialmedia:sm-default_link_rel_sharing]}"?]>[?link-text=' . $stitle . '?]</a>',
    //'share-button' => '<a href="http://twitter.com/share?url=[|[node:url]||[current-page:url]|]&text=[|[node:title]||[current-page:title-plain]|]" title="' . $stitle . '"[?link-target= target="{[socialmedia:sm-default_link_target_sharing]}"?][?link-rel= rel="{[socialmedia:sm-default_link_rel_sharing]}"?]><img src="[?icon-path=[socialmedia:sm-twitter_icon-path]?]" alt="Twitter icon" ></a>',
    'share-button' => '<a href="http://twitter.com/share?url=[|[node:url]||[current-page:url]|]&text=[?message=[|[node:title]||[current-page:title-plain]|] [|[node:url]||[current-page:url]|] via @[socialmedia:sm-twitter_username]?]" title="' . $stitle . '"[?link-target= target="{[socialmedia:sm-default_link_target_sharing]}"?][?link-rel= rel="{[socialmedia:sm-default_link_rel_sharing]}"?]><img src="[?icon-path=[socialmedia:sm-twitter_icon-path]?]" alt="Twitter icon" ></a>',
  
  );

  $platforms['vimeo'] = array(
    'label' => t('Vimeo'),
    'group' => t('Social media: Vimeo'),
  );
  $title = t("Visit !varusername on Vimeo", array('!varusername' => '[?profile_username=[socialmedia:sm-vimeo_username]?]'));
  $platforms['vimeo']['templates'] = array(
    'profile-url' => "[?profile_url=[socialmedia:sm-vimeo_url]?]",
    'profile-text-link' => '<a href="[?profile_url=[socialmedia:sm-vimeo_url]?]" title="' . $title . '"[?link-target= target="{[socialmedia:sm-default_link_target_profile]}"?][?link-rel= rel="{[socialmedia:sm-default_link_rel_profile]}"?]>[?profile_username=[socialmedia:sm-vimeo_username]?]</a>',  
    'profile-button' => '<a href="[?profile_url=[socialmedia:sm-vimeo_url]?]" title="' . $title . '"[?link-target= target="{[socialmedia:sm-default_link_target_profile]}"?][?link-rel= rel="{[socialmedia:sm-default_link_rel_profile]}"?]><img src="[?icon-path=[socialmedia:sm-vimeo_icon-path]?]" alt="Vimeo icon" ></a>',
  );
  
  $platforms['yahoo'] = array(
    'label' => t('Yahoo!'),
    'group' => t('Social media: Yahoo!'),
  );
  $stitle = t("Bookmark on Yahoo!");
  $platforms['yahoo']['templates'] = array(
    'share-text-link' => '<a href="http://bookmarks.yahoo.com/myresults/bookmarklet?u=[|[node:url]||[current-page:url]|]&t=[|[node:title]||[current-page:title-plain]|]" title="[?link-text=' . $stitle . '?]"[?link-target= target="{[socialmedia:sm-default_link_target_sharing]}"?][?link-rel= rel="{[socialmedia:sm-default_link_rel_sharing]}"?]>[?link-text=' . $stitle . '?]</a>',
    'share-button' => '<a href="http://bookmarks.yahoo.com/myresults/bookmarklet?u=[|[node:url]||[current-page:url]|]&t=[|[node:title]||[current-page:title-plain]|]" title="[?link-text=' . $stitle . '?]"[?link-target= target="{[socialmedia:sm-default_link_target_sharing]}"?][?link-rel= rel="{[socialmedia:sm-default_link_rel_sharing]}"?]><img src="[?icon-path=[socialmedia:sm-yahoo_icon-path]?]" alt="Yahoo! icon" ></a>',
  );

  $platforms['youtube'] = array(
    'label' => t('YouTube'),
    'group' => t('Social media: YouTube'),
  );
  $title = t("Visit !varusername on YouTube", array('!varusername' => '[?profile_username=[socialmedia:sm-youtube_username]?]'));
  $platforms['youtube']['templates'] = array(
    'profile-url' => "[?profile_url=[socialmedia:sm-youtube_url]?]",
    'profile-text-link' => '<a href="[?profile_url=[socialmedia:sm-youtube_url]?]" title="' . $title . '"[?link-target= target="{[socialmedia:sm-default_link_target_profile]}"?][?link-rel= rel="{[socialmedia:sm-default_link_rel_profile]}"?]>[?profile_username=[socialmedia:sm-youtube_username]?]</a>',  
    'profile-button' => '<a href="[?profile_url=[socialmedia:sm-youtube_url]?]" title="' . $title . '"[?link-target= target="{[socialmedia:sm-default_link_target_profile]}"?][?link-rel= rel="{[socialmedia:sm-default_link_rel_profile]}"?]><img src="[?icon-path=[socialmedia:sm-youtube_icon-path]?]" alt="YouTube icon" ></a>',
  );
  
  return $platforms;
}

function socialmedia_widgets_share_platforms_form($data) {
  $form = widgets_template_auto_form($data);

  $element = widgets_element_load_by_admin_path();
  if (isset($form['icon-path'])) {
    $options = socialmedia_icon_style_options(TRUE, $element['platform']);
    $form['icon-path'] = array(
      '#type' => 'select',
      '#title' => t('Icon style'),
      '#default_value' => (isset($data['icon-path']) && $data['icon-path']) ? $data['icon-path'] : '',
    //'#description' => t('The name is used in URLs for generated images. Use only lowercase alphanumeric characters, underscores (_), and hyphens (-).'),
      '#options' => $options,
    );
  }
  return $form;
}



function socialmedia_widgets_element_form_alter(&$form, $set, $element) {
  if ($element['name'] == 'socialmedia_addthis-addthis-counter') {
    socialmedia_widgets_element_alter_addthis_addthis_counter($form, $set, $element);
  }
  elseif ($element['name'] == 'socialmedia_addthis-facebook-like') {
    socialmedia_widgets_element_alter_addthis_facebook_like($form, $set, $element);
  }
  elseif ($element['name'] == 'socialmedia_addthis-google-plusone') {
    socialmedia_widgets_element_alter_addthis_google_plusone($form, $set, $element);
  }
  elseif ($element['name'] == 'socialmedia_addthis-pinterest-pinit') {
    socialmedia_widgets_element_alter_addthis_pinterest_pinit($form, $set, $element);
  }
  elseif ($element['name'] == 'socialmedia_addthis-tweet') {
    socialmedia_widgets_element_alter_addthis_tweet($form, $set, $element);
  }
  elseif ($element['name'] == 'socialmedia_addthis-stumbleupon-badge') {
    socialmedia_widgets_element_alter_addthis_stumbleupon_badge($form, $set, $element);
  }
  elseif ($element['name'] == 'socialmedia_facebook-like-box') {
    socialmedia_widgets_element_alter_facebook_like_box($form, $set, $element);
  }
  elseif ($element['name'] == 'socialmedia_facebook-like-button') {  // PVE 7/2/12
    socialmedia_widgets_element_alter_facebook_like_button($form, $set, $element);
  }
  elseif ($element['name'] == 'socialmedia_linkedin-share-button') {
    socialmedia_widgets_element_alter_linkedin_share_button($form, $set, $element);
  }
  elseif ($element['name'] == 'socialmedia_twitter-profile-widget') {
    socialmedia_widgets_element_alter_twitter_profile_widget($form, $set, $element);
  }
  elseif ($element['name'] == 'socialmedia_stumbleupon-badge') {
    socialmedia_widgets_element_alter_stumbleupon_badge($form, $set, $element);
  }

}

function socialmedia_widgets_element_addthis_js() {
  return '<script type="text/javascript" src="http://s7.addthis.com/js/250/addthis_widget.js#username=[?username=[socialmedia:sm-addthis_username]?]"></script>';
  //return '<script type="text/javascript" src="http://s7.addthis.com/js/250/addthis_widget.js#username="></script>';
}

function socialmedia_widgets_element_addthis_addthis_counter() {
  $addthis_js = socialmedia_widgets_element_addthis_js();
  $elements['socialmedia_addthis-addthis-counter'] = array(
    'label' => t('AddThis counter button'),
    'group' => t('Social media: Multi'),
    'template' => '<a class="addthis_counter[?style=?]"></a>',
    'add_js' => array(
      'data' => $addthis_js,
      'options' => array(
        'scope' => 'set_post', 
      ),
    ),
    'form callback' => 'widgets_template_auto_form',
  );
  return $elements;
}

function socialmedia_widgets_element_alter_addthis_addthis_counter(&$form, $set, $element) {
  $options = array(
    '' => t('Large button with verticle count'),
    //' addthis_32x32_style addthis_bubble_style' => t('Large button with horizontal count'),
    //' addthis_bubble_style' => t('Small button with horizontal count'),
    ' addthis_pill_style' => t('Pill button (no count)'),
  );
  $form['style']['#type'] = 'select';
  $form['style']['#options'] = $options;
  $form['style']['#description'] = t('Select button and style');
}

function socialmedia_widgets_element_addthis_facebook_like() {
  $addthis_js = socialmedia_widgets_element_addthis_js();
  $elements['socialmedia_addthis-facebook-like'] = array(
    'label' => t('AddThis Facebook like counter button'),
    'group' => t('Social media: Facebook'),
    'template' => '<a class="addthis_button_facebook_like"[?layout=?] [?width=fb:like:width="{<none>}"?]></a>',
    'add_js' => array(
      'data' => $addthis_js,
      'options' => array(
        'scope' => 'set_post', 
      ),
    ),
    'form callback' => 'widgets_template_auto_form',
  );
  return $elements;
}

function socialmedia_widgets_element_alter_addthis_facebook_like(&$form, $set, $element) {
  $options = array(
    '' => t('Standard (no count)'),
    ' fb:like:layout="button_count"' => t('Button count'),
    ' fb:like:layout="box_count"' => t('Box count'),
  );
  $form['layout']['#type'] = 'select';
  $form['layout']['#options'] = $options;
  $form['layout']['#description'] = t('Select button and count style');
}

function socialmedia_widgets_element_addthis_google_plusone() {
  $addthis_js = socialmedia_widgets_element_addthis_js();
  $elements['socialmedia_addthis-google-plusone'] = array(
    'label' => t('AddThis Google +1 counter button'),
    'help' => t('Resizing will make images an exact set of dimensions. This may cause images to be stretched or shrunk disproportionately.'),
    'group' => t('Social media: Google+'),
    'template' => '<a class="addthis_button_google_plusone"[?size=?]></a>',
    'add_js' => array(
      'data' => $addthis_js,
      'options' => array(
        'scope' => 'set_post', 
      ),
    ),
    'form callback' => 'widgets_template_auto_form',
  );
  return $elements;
}

function socialmedia_widgets_element_alter_addthis_google_plusone(&$form, $set, $element) {
  $options = array(
    ' g:plusone:size="standard"' => t('Standard'),
    ' g:plusone:size="small"' => t('Small'),
    ' g:plusone:size="medium"' => t('Medium'),
    ' g:plusone:size="tall"' => t('Tall'),
  );
  $form['size']['#type'] = 'select';
  $form['size']['#options'] = $options;
  $form['size']['#description'] = t('Select button size and layout');

  return $form;
}

function socialmedia_widgets_element_addthis_email() {
  $addthis_js = socialmedia_widgets_element_addthis_js();
  $elements['socialmedia_addthis-email'] = array(
    'label' => t('AddThis email a friend button'),
    'group' => t('Social media: E-mail'),
    'template' => '<a class="addthis_button_email"?]><img src="[?icon-path=[socialmedia:sm-email_icon-path]?]" alt="e-mail icon" ></a>',
    'add_js' => array(
      'data' => $addthis_js,
      'options' => array(
        'scope' => 'set_post', 
      ),
    ),
    'form callback' => 'widgets_template_auto_form',
  );
  return $elements;
}

function socialmedia_widgets_element_addthis_pinterest_pinit() {
  $addthis_js = socialmedia_widgets_element_addthis_js();
  $elements['socialmedia_addthis-pinterest-pinit'] = array(
    'label' => t('AddThis Pinterest counter button'),
    'help' => t('Resizing will make images an exact set of dimensions. This may cause images to be stretched or shrunk disproportionately.'),
    'group' => t('Social media: Pinterest'),
    'template' => '<a class="addthis_button_pinterest_pinit"[?size=?]></a>',
    'add_js' => array(
      'data' => $addthis_js,
      'options' => array(
        'scope' => 'set_post', 
      ),
    ),
    'form callback' => 'widgets_template_auto_form',
  );
  return $elements;
}

function socialmedia_widgets_element_alter_addthis_pinterest_pinit(&$form, $set, $element) {
  $options = array(
    '' => t('No counter'),
    ' pi:pinit:layout="horizontal"' => t('Horizontal'),
    ' pi:pinit:layout="vertical"' => t('Vertical'),
  );
  $form['size']['#type'] = 'select';
  $form['size']['#options'] = $options;
  $form['size']['#description'] = t('Select button size and layout');

  return $form;
}

function socialmedia_widgets_element_addthis_tweet() {
  $addthis_js = socialmedia_widgets_element_addthis_js();
  $elements['socialmedia_addthis-tweet'] = array(
    'label' => t('Addthis tweet counter button'),
    'group' => t('Social media: Twitter'),
    'template' => '<a class="addthis_button_tweet"[?count=?] [?via=tw:via="{[socialmedia:sm-twitter_username]}"?]></a>',
    'add_js' => array(
      'data' => $addthis_js,
      'options' => array(
        'scope' => 'set_post', 
      ),
    ),
    'form callback' => 'widgets_template_auto_form',
  );
  return $elements;
}

function socialmedia_widgets_element_alter_addthis_tweet(&$form, $set, $element) {

  $options = array(
    '' => t('None'),
    ' tw:count="vertical"' => t('Vertical'),
    ' tw:count="horizontal"' => t('Horizontal'),
  );
  $form['count']['#type'] = 'select';
  $form['count']['#options'] = $options;
  return $form;
}

function socialmedia_widgets_element_addthis_stumbleupon_badge() {
  $addthis_js = socialmedia_widgets_element_addthis_js();
  $elements['socialmedia_addthis-stumbleupon-badge'] = array(
    'label' => t('AddThis StumbleUpon counter badge'),
    'group' => t('Social media: StumbleUpon'),
    //'template' => '<a class="addthis_button_stumbleupon_badge"[?style=?] su:badge:url="[?url=[|[node:url]||[current-page:url]|]?]"></a>',
    'template' => '<a class="addthis_button_stumbleupon_badge"[?style=?]"></a>',
    'add_js' => array(
      'data' => $addthis_js,
      'options' => array(
        'scope' => 'set_post', 
      ),
    ),
    'form callback' => 'widgets_template_auto_form',
  );
  return $elements;
}

function socialmedia_widgets_element_alter_addthis_stumbleupon_badge(&$form, $set, $element) {
  $options = array(
    ' su:bdg:style="4"' => t('Small button (no count)'),
    ' su:bdg:style="6"' => t('Large button (no count)'),
    ' su:bdg:style="1"' => t('Small button with horizontal count'),
    ' su:bdg:style="5"' => t('Large button with verticle count'),
  );
  $form['style']['#type'] = 'select';
  $form['style']['#options'] = $options;
  return $form;
}


// PVE 8-10/2/12 translation management + produce FB library only one time
function socialmedia_widgets_facebook_js_sdk() {
  global $language;
// Get fb local based on site language and country.
  $country = variable_get('site_default_country', 'US');
  $locale = $language->language . '_' . $country;
  $locales = _socialmedia_widgets_get_facebook_locales();
  if (!isset($locales[$locale])) {
    // Locale not valid, use default.
    $locale = 'en_US';
  }
  $facebook_js_sdk = '<script>
if (!document.getElementById("fb-root")) {
  fb_root = document.createElement("div");
  fb_root.id = "fb-root";
  document.body.insertBefore(fb_root,document.body.firstChild);
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/' . $locale . '/all.js#xfbml=1";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, "script", "facebook-jssdk"));
}</script>';
  return $facebook_js_sdk;
}

function _socialmedia_widgets_get_facebook_locales() {
  $fb_locale = array();
  $cache = cache_get('socialmedia_facebook_locales');
  if (empty($cache->data)) {
    $result = drupal_http_request("https://www.facebook.com/translations/FacebookLocales.xml");
    $xml = simplexml_load_string($result->data);
    foreach ($xml->locale as $line) {
      $representation = (array) $line->codes->code->standard->representation;
      $name = (array) $line->englishName;
      $key = $representation[0];
      $value = $name[0];
      $fb_locale[$key] = $value;
    }
    cache_set('socialmedia_facebook_locales', serialize($fb_locale), 'cache');
  }
  else {
    $fb_locale = unserialize($cache->data);
  }
  return $fb_locale;
}

function socialmedia_widgets_element_facebook_like_box() {
  $facebook_js_sdk = socialmedia_widgets_facebook_js_sdk();
  $elements = array();
  $elements['socialmedia_facebook-like-box'] = array(
    'label' => t('Facebook like box'),
    'help' => t('Resizing will make images an exact set of dimensions. This may cause images to be stretched or shrunk disproportionately.'),
    'group' => t('Social media: Facebook'),
    'template' => '<div class="fb-like-box" data-href="[?facebook_page_url=[socialmedia:sm-facebook_url]?]" data-width="[?width=[socialmedia:sm-default_width]?]" [?height=data-height="{<none>}"?] data-colorscheme="[?color_scheme=light?]" data-border-color="[?border_color=[socialmedia:sm-default_color_border]?]" data-show-faces="[?show_faces=true?]" data-stream="[?data_stream=false?]" data-header="[?data_header=false?]"></div>',
    'add_js' => array(
      'data' => $facebook_js_sdk,
      'options' => array(
        'scope' => 'set_pre', 
        'type' => 'inline'
      ),
    ),
    'form callback' => 'widgets_template_auto_form',
  );
  return $elements;
}

function socialmedia_widgets_element_alter_facebook_like_box(&$form, $set, $element) {
  $form['facebook_page_url']['#description'] = t('The URL of the Facebook Page for this Like box. (example: http://www.facebook.com/platform) ') . $form['facebook_page_url']['#description'];
  $form['height']['#description'] = t('Leave blank to not set a height. Use <em>[socialmedia:sm-default_height]</em> to use the social media widget default.');  
  $options = array(
    'true' => t('Yes'),
    'false' => t('No'),
  );
  $fields = array(
    'show_faces',
    'data_stream',
    'data_header',
  );
  foreach ($fields AS $field) {
    $form[$field]['#type'] = 'radios';
    $form[$field]['#options'] = $options;
  }  
  $form['show_faces']['#description'] = t('Show profile photos in the plugin.');
  $form['data_stream']['#description'] = t('Show the profile stream for the public profile.');
  $form['data_header']['#description'] = t('Show the \'Find us on Facebook\' bar at top. Only shown when either stream or faces are present.');
  
  $options = array(
    'light' => t('Light'),
    'dark' => t('Dark'),
  );
  $form['color_scheme']['#type'] = 'select';
  $form['color_scheme']['#options'] = $options;
  $form['color_scheme']['#description'] = t('The color scheme of the plugin');
}

// PVE 7/2/12 see http://developers.facebook.com/docs/reference/plugins/like/
function socialmedia_widgets_element_facebook_like_button() {
  $facebook_js_sdk = socialmedia_widgets_facebook_js_sdk();
  $elements = array();
  $elements['socialmedia_facebook-like-button'] = array(
    'label' => t('Facebook like button'),
    //'help' => t(''),
    'group' => t('Social media: Facebook'),
    'template' => '<div class="fb-like" data-href="[|[node:url]||[current-page:url]|]" data-send="[?send_button=true?]" [?layout=data-layout="{<none>}"?] data-width="[?width=[socialmedia:sm-default_width]?]" data-show-faces="[?show_faces=true?]" [?action=data-action="{<none>}"?] data-colorscheme="[?color_scheme=light?]" [?font=data-font="{<none>}"?]></div>',
    'add_js' => array(
      'data' => $facebook_js_sdk,
      'options' => array(
        'scope' => 'set_pre', 
        'type' => 'inline'
      ),
    ),
    'form callback' => 'widgets_template_auto_form',
  );
  return $elements;
}

// PVE 7/2/12
function socialmedia_widgets_element_alter_facebook_like_button(&$form, $set, $element) {

  $options = array(
    '<none>' => t('Standard'),
    'button_count' => t('Button count'),
    'box_count' => t('Box count'),
  );
  $form['layout']['#type'] = 'select';
  $form['layout']['#options'] = $options;
  $form['layout']['#description'] = t('Select button and count style');

  $options = array(
    'true' => t('Yes'),
    'false' => t('No'),
  );
  $fields = array(
    'send_button',
    'show_faces',
  );
  foreach ($fields AS $field) {
    $form[$field]['#type'] = 'radios';
    $form[$field]['#options'] = $options;
  }
  $form['send_button']['#description'] = t('Include a Send button');
  $form['show_faces']['#description'] = t('Show profile photos in the plugin');
  
  $options = array(
    '<none>' => t('Like'),
    'recommend' => t('Recommend'),
  );
  $form['action']['#title'] = t('Verb to display');
  $form['action']['#type'] = 'select';
  $form['action']['#options'] = $options;
  $form['action']['#description'] = t('The verb to display in the button');

  $options = array(
    '<none>' => t('Light'),
    'dark' => t('Dark'),
  );
  $form['color_scheme']['#type'] = 'select';
  $form['color_scheme']['#options'] = $options;
  $form['color_scheme']['#description'] = t('The color scheme of the plugin');

  $options = array(
    '<none>' => t('Default'),
    'arial' => 'arial',
    'lucida grande' => 'lucida grande',
    'segoe ui' => 'segoe ui',
    'tahoma' => 'tahoma',
    'trebuchet ms' => 'trebuchet ms',
    'verdana' => 'verdana',
  );
  $form['font']['#type'] = 'select';
  $form['font']['#options'] = $options;
  $form['font']['#description'] = t('The font of the plugin');
}

function socialmedia_widgets_element_linkedin_share_button() {
  $addthis_js = socialmedia_widgets_element_addthis_js();
  $elements['socialmedia_linkedin-share-button'] = array(
    'label' => t('LinkedIn share button'),
    'group' => t('Social media: LinkedIn'),
    'template' => '<script src="http://platform.linkedin.com/in.js" type="text/javascript"></script><script type="IN/Share" [?style=data-counter="{top}"?]></script>',
    'form callback' => 'widgets_template_auto_form',
  );
  return $elements;
}

function socialmedia_widgets_element_alter_linkedin_share_button(&$form, $set, $element) {
  $data = $element['data'];
  $options = array(
    '<none>' => t('Small button (no count)'),
    'top' => t('Vertical count'),
    'right' => t('Horizontal count'),
  );
  $form['style']['#type'] = 'select';
  $form['style']['#options'] = $options;
  return $form;
}
/*
function socialmedia_widgets_element_rss_button() {
  $elements['socialmedia_rss-button'] = array(
    'label' => t('RSS button'),
    'group' => t('Social media: RSS'),
    'template' => '<a href="[?rss_url=[socialmedia:sm-rss_url]?]" title="Subscribe via RSS"[?link-target= target="{[socialmedia:sm-default_link_target_profile]}"?][?link-rel= rel="{[socialmedia:sm-default_link_rel_profile]}"?]><img src="[?icon-path=[socialmedia:sm-rss_icon-path]?]" alt="RSS icon" ></a>',
    'form callback' => 'widgets_template_auto_form',
  );
  return $elements;
}
*/

function socialmedia_widgets_element_twitter_profile_widget() {
  $template = <<<EOF
<script src="http://widgets.twimg.com/j/2/widget.js"></script>
<script>
new TWTR.Widget({
  version: 2,
  type: 'profile',
  rpp: [?preferences:number_of_tweets=4?],
  interval: 30000,
  width: [?dimensions:width=[socialmedia:sm-default_width]?],
  height: [?dimensions:height=[socialmedia:sm-default_height]?],
  theme: {
    shell: {
      background: '[?appearance:shell_background_color=[socialmedia:sm-default_color_header_background]?]',
      color: '[?appearance:shell_text_color=[socialmedia:sm-default_color_header_text]?]'
    },
    tweets: {
      background: '[?appearance:tweets_background_color=[socialmedia:sm-default_color_body_background]?]',
      color: '[?appearance:tweets_text_color=[socialmedia:sm-default_color_body_text]?]',
      links: '[?appearance:link_color=[socialmedia:sm-default_color_body_linktext]?]'
    }
  },
  features: {
    scrollbar: [?preferences:include_scrollbar=false?],
    loop: false,
    live: [?preferences:poll_for_new_results=false?],
    behavior: 'all'
  }
}).render().setUser('[?settings:twitter_username=[socialmedia:sm-twitter_username]?]').start();
</script>  
EOF;
  $elements['socialmedia_twitter-profile-widget'] = array(
    'label' => t('Twitter profile widget'),
    'group' => t('Social media: Twitter'),
    'template' => $template,
    'form callback' => 'widgets_template_auto_form',
  );
  return $elements;
}

function socialmedia_widgets_element_alter_twitter_profile_widget(&$form, $set, $element) {
  
  $options = array(
    'true' => t('Yes'),
    'false' => t('No'),
  );
  $fields = array(
    'poll_for_new_results',
    'include_scrollbar',
  );
  foreach ($fields AS $field) {
    $form['preferences'][$field]['#type'] = 'radios';
    $form['preferences'][$field]['#options'] = $options;
    //$form[$field]['#default_value'] = $
  } 
  $form['settings']['#weight'] = -1; 
  $form['preferences']['#collapsed'] = TRUE;
  $form['appearance']['#collapsed'] = TRUE; 
  $form['dimensions']['#collapsed'] = TRUE;  

}



function socialmedia_widgets_element_stumbleupon_badge() {
  $addthis_js = socialmedia_widgets_element_addthis_js();
  $elements['socialmedia_stumbleupon-badge'] = array(
    'label' => t('StumbleUpon Badge'),
    'group' => t('Social media: StumbleUpon'),
    'template' => '<script src="http://www.stumbleupon.com/hostedbadge.php?s=[?style=5?]"></script>',
    'form callback' => 'widgets_template_auto_form',
  );
  return $elements;
}

function socialmedia_widgets_element_alter_stumbleupon_badge(&$form, $set, $element) {
  $options = array(
    '4' => t('Small button (no count)'),
    '6' => t('Large button (no count)'),
    '1' => t('Small button with horizontal count'),
    '5' => t('Large button with verticle count'),
  );
  $form['style']['#type'] = 'select';
  $form['style']['#options'] = $options;
  return $form;
}

function socialmedia_widgets_set_profile_default_elements() {
  $elements = array();
  $elements['basic'] = array(
    'name' => t('Basic'),
    'elements' => array(),
  );
  $profiles = variable_get('socialmedia_platforms_site' , array());
  $platforms = socialmedia_socialmedia_platform_info();
//dsm($profiles);
//dsm($platforms);
  $weight = 1;
  foreach ($profiles AS $key => $profile) {
    if ($profile && (!isset($platforms[$key]['group']) || $platforms[$key]['group'] == 'Syndication')) {
      if (isset($platforms[$key]['group']) && $platforms[$key]['group'] == 'Syndication') {
        $name = 'socialmedia_socialmedia-' . $key . '-feed-button';
      }
      else {
        $name = 'socialmedia_socialmedia-' . $key . '-profile-button';
      }
      $elements['basic']['elements'][$name] = array(
        'name' => $name,
        'weight' => ($name == 'socialmedia_socialmedia-rss-feed-button') ? $weight + 20 : $weight,  
      ); 
      $weight++;   
    }
  }
//dsm($elements);
  return $elements;
}

function socialmedia_widgets_set_profile_default() {
  $set = variable_get('socialmedia_widget_set_default_profile', NULL);
  if ($set) {
    return $set;
  }
  $elements = socialmedia_widgets_set_profile_default_elements();

  $set = array(
    'data' => array(
      'style' => 'horizontal',
      'cache' => array('scope' => 'site'),
    ),
    'elements' => array(),
  );
  $i=1;
  foreach ($elements['basic']['elements'] AS $key => $element) {
    $element += widgets_element_definition_load($key);
    $element['weight'] = isset($element['weight']) ? $element['weight'] : $i++;
    $set['elements'][] = $element;
  }
  usort($set['elements'], '_socialmedia_widgets_set_profile_default_sort_elements');
  return $set;  
}

function _socialmedia_widgets_set_profile_default_sort_elements($a, $b) {
  return ($a['weight'] < $b['weight']) ? -1 : 1;
}

function socialmedia_widgets_set_share_default_elements() {
  $elements = array();
  $elements['basic'] = array(
    'name' => t('Basic'),
    'elements' => array(
      'socialmedia_socialmedia-twitter-share-button' => array(
        'name' => 'socialmedia_socialmedia-twitter-share-button',
      ),
      'socialmedia_socialmedia-facebook-share-button' => array(
        'name' => 'socialmedia_socialmedia-facebook-share-button',
      ),
      'socialmedia_socialmedia-google-share-button' => array(
        'name' => 'socialmedia_socialmedia-google-share-button',
      ),
      'socialmedia_socialmedia-stumbleupon-share-button' => array(
        'name' => 'socialmedia_socialmedia-stumbleupon-share-button',
      ),
      'socialmedia_socialmedia-delicious-share-button' => array(
        'name' => 'socialmedia_socialmedia-delicious-share-button',
      ),
      'socialmedia_socialmedia-digg-share-button' => array(
        'name' => 'socialmedia_socialmedia-digg-share-button',
      ),
      'socialmedia_socialmedia-linkedin-share-button' => array(
        'name' => 'socialmedia_socialmedia-linkedin-share-button',
      ),
      'socialmedia_socialmedia-myspace-share-button' => array(
        'name' => 'socialmedia_socialmedia-myspace-share-button',
      ),
      'socialmedia_socialmedia-newsvine-share-button' => array(
        'name' => 'socialmedia_socialmedia-newsvine-share-button',
      ),
      'socialmedia_socialmedia-pinterest-share-button' => array(
        'name' => 'socialmedia_socialmedia-pinterest-share-button',
      ),
      'socialmedia_socialmedia-reddit-share-button' => array(
        'name' => 'socialmedia_socialmedia-reddit-share-button',
      ),
      'socialmedia_socialmedia-technorati-share-button' => array(
        'name' => 'socialmedia_socialmedia-technorati-share-button',
      ),
      'socialmedia_socialmedia-yahoo-share-button' => array(
        'name' => 'socialmedia_socialmedia-yahoo-share-button',
      ),
      'socialmedia_addthis-email' => array(
        'name' => 'socialmedia_addthis-email',
      ),
    ),
  );
  /*
  $elements['standard_counters'] = array(
    'name' => t('Standard counters'),
    'elements' => array(
      'stubleupon' => array(
        'name' => 'socialmedia_stumbleupon-badge',
      ),
    ),
  );
  */
  $elements['addthis_counters'] = array(
    'name' => t('AddThis counters'),
    'elements' => array(
      'socialmedia_addthis-tweet' => array(
        'name' => 'socialmedia_addthis-tweet',
        'data' => array('count' => ' tw:count="vertical"'),
      ),
      'socialmedia_addthis-facebook-like' => array(
        'name' => 'socialmedia_addthis-facebook-like',
        'data' => array('layout' =>  ' fb:like:layout="box_count"'),
      ),
      'socialmedia_addthis-google-plusone' => array(
        'name' => 'socialmedia_addthis-google-plusone',
        'data' => array('size' => ' g:plusone:size="tall"'),
      ),
      'socialmedia_addthis-addthis-counter' => array(
        'name' => 'socialmedia_addthis-addthis-counter',
        'data' => array(),
      ),
    ),  
  );
  return $elements;
}

function socialmedia_widgets_set_share_default() {
  
  $set = variable_get('socialmedia_widget_set_default_share', NULL);
  if ($set) {
    return $set;
  }
  
  $elements = socialmedia_widgets_set_share_default_elements();
  $set = array(
    'data' => array(
      'style' => 'horizontal',
      'cache' => array('scope' => 'page'),
    ),
    'elements' => array(),
  );
  $i=1;
  foreach ($elements['basic']['elements'] AS $key => $element) {
    $element += widgets_element_definition_load($key);
    $element['weight'] = $i++;
    $set['elements'][] = $element;
  }
  return $set;
}

function socialmedia_widgets_default_sets() {
  $sets = array();

  $sets['socialmedia_profile-default'] = socialmedia_widgets_set_profile_default();
  
  $sets['socialmedia_share-default'] = socialmedia_widgets_set_share_default();
 
  $sets['socialmedia_profile-urls'] = array(
    'data' => array(
      'style' => 'plain-linebreaks',
      'cache' => array('scope' => 'author'),
    ),
    'elements' => array(
      array(
        'name' => 'socialmedia_socialmedia-twitter-profile-url',
        'data' => array(),
        'weight' => 1,
      ),
      array(
        'name' => 'socialmedia_socialmedia-facebook-profile-url',
        'data' => array(),
        'weight' => 1,
      ),
      array(
        'name' => 'socialmedia_socialmedia-linkedin-profile-url',
        'data' => array(),
        'weight' => 1,
      ),
      array(
        'name' => 'socialmedia_socialmedia-googleplus-profile-url',
        'data' => array(),
        'weight' => 1,
      ),
      array(
        'name' => 'socialmedia_socialmedia-youtube-profile-url',
        'data' => array(),
        'weight' => 1,
      ),
    ),
  );
  $sets['socialmedia_profile-buttons'] = array(
    'data' => array(
      'style' => 'horizontal',
      'cache' => array('scope' => 'author'),
    ),
    'elements' => array(
      array(
        'name' => 'socialmedia_socialmedia-twitter-profile-button',
        'data' => array(),
        'weight' => 1,
      ),
      array(
        'name' => 'socialmedia_socialmedia-facebook-profile-button',
        'data' => array(),
        'weight' => 2,
      ),
      array(
        'name' => 'socialmedia_socialmedia-linkedin-profile-button',
        'data' => array(),
        'weight' => 3,
      ),
      array(
        'name' => 'socialmedia_socialmedia-googleplus-profile-button',
        'data' => array(),
        'weight' => 4,
      ),
      array(
        'name' => 'socialmedia_socialmedia-youtube-profile-button',
        'data' => array(),
        'weight' => 5,
      ),
      array(
        'name' => 'socialmedia_socialmedia-rss-feed-button',
        'data' => array(),
        'weight' => 6,
      ),
    ),
  );
  $sets['addthis-share'] = array(
    'data' => array(
      'style' => 'horizontal',
      'cache' => array('scope' => 'page'),
    ),
    'elements' => array(
      array(
        'name' => 'socialmedia_addthis-tweet',
        'data' => array('count' => ' tw:count="vertical"'),
        'weight' => 1,
      ),
      array(
        'name' => 'socialmedia_addthis-facebook-like',
        'data' => array('layout' =>  ' fb:like:layout="box_count"'),
        'weight' => 2,
      ),
      array(
        'name' => 'socialmedia_addthis-google-plusone',
        'data' => array('size' => ' g:plusone:size="tall"'),
        'weight' => 3,
      ),
      array(
        'name' => 'socialmedia_addthis-addthis-counter',
        'data' => array(),
        'weight' => 4,
      ),
    ),
  );
  $sets['facebook-like-box'] = array(
    'data' => array(
      'cache' => array('scope' => 'author'),
    ),
    'elements' => array(
      array(
        'name' => 'socialmedia_facebook-like-box',
        'weight' => 1,
        'data' => array(
        ),
      ),
    ),
  );
  $sets['twitter-profile-widget'] = array(
    'data' => array(
      'cache' => array('scope' => 'author'),
    ),
    'elements' => array(
      array(
        'name' => 'socialmedia_twitter-profile-widget',
        'weight' => 1,
        'data' => array(
          'preferences' => array(
          ),
          'dimensions' => array(
          ),
          'appearance' => array(
          ),
          'settings' => array(
          ),
        ),
      ),
    ),
  );

  return $sets;
}