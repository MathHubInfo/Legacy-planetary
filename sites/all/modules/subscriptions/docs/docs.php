<?php
/**
 * @file
 * This file contains no working PHP code; it exists to provide additional documentation
 * for doxygen as well as to document hooks in the standard Drupal manner.
 */

/**
 * @mainpage Subscriptions API Manual
 *
 * This is preliminary documentation and needs further work.
 *
 * Topics:
 * - @ref subscriptions_hooks
 */

/**
 * @defgroup subscriptions_hooks Subscriptions' hooks
 * @{
 * Hooks that can be implemented by other modules in order to extend
 * Subscriptions.
 */

/**
 * This alter hook is called immediately before sending of a digest.
 *
 * You get the digest bodies as well as the prepared mailvars just before they
 * are merged into a digest, and you can do with them whatever you like.
 * At the very extreme, you can remove digest items or even set $digest_data
 * to NULL to suppress sending this digest.
 */
function hook_subscriptions_digest_alter(&$digest_data) {
  $digest_data['mailvars']['!digest_count'] = count($digest_data['bodies']);
}

