<?php
/**
 * @file
 * Template file for the galleryformatter default formatter
 */

/**
 * Only edit this file for switching order of the slides info, adding classes or other minor changes within the overall html structure.
 * KEEP the original html structure or you'll run into problems with the JS.
 * IDs on the slides and the hash for the thumb links MUST be there for the gallery to function.
 * width and height must be set inline for gallery-slides container, the gallery-thumbs, and the li's inside it.
 *
 * Available variables:
 *
 * $dimensions - Array containing both slides and thumbs dimensions
 * $slides - Array containing all slide images, its sanatized title & alt ready to print, its hash id and the full image URL if you need it
 * $thumbs - Array containing all thumbnail images ready to print and their hash
 * $settings - The settings for galleryformatter as configured for this field instance.
 */
?>
<div class="galleryformatter galleryview galleryformatter-<?php print $settings['style'] ?>">
  <div class="gallery-slides" style="width: <?php print $dimensions['slides']['width']; ?>px; height: <?php print $dimensions['slides']['height']; ?>px;">
    <div class="gallery-frame">
      <ul>
      <?php foreach ($slides as $id => $data): ?>
        <li class="gallery-slide" id="<?php print $data['hash_id']; ?>">
          <?php print $data['image']; ?>
          <?php if (!empty($data['title']) || !empty($data['alt'])): ?>
            <div class="panel-overlay">
              <div class="overlay-inner">
                <?php if ($data['alt']): ?><h4><?php print $data['alt']; ?></h4><?php endif; ?>
                <?php if ($data['title']): ?><h3><?php print $data['title']; ?></h3><?php endif; ?>
              </div>
            </div>
          <?php endif; ?>
        </li>
      <?php endforeach; ?>
      </ul>
    </div>
  </div>
  <?php if(!empty($thumbs)): ?>
  <div class="gallery-thumbs" style="width: <?php print $dimensions['slides']['width']; ?>px;">
    <div class="wrapper">
      <ul>
        <?php foreach ($thumbs as $id => $data): ?>
          <li class="slide-<?php print $id; ?>" style="width: <?php print $dimensions['thumbs']['width']; ?>px;"><a href="#<?php print $data['hash_id']; ?>"><?php print $data['image']; ?></a></li>
        <?php endforeach; ?>
      </ul>
    </div>
  </div>
  <?php endif; ?>
</div>
