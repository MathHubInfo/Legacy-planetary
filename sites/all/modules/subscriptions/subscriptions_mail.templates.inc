<?php

/**
 * @file
 * Subscriptions module mail templates constants.
 */

define('SUBSCRIPTIONS_DIGEST_MAILKEY', 'digest');

/**
 * @param $key
 * @param $langcode
 * @return array|null|string
 */
function subscriptions_mail_template_raw($key, $langcode) {
  switch ($key) {

    case 'SEP':      return // SUBSCRIPTIONS_DEFAULT_SEPARATOR
t('| ---------------------------------------------------', array(), array('langcode' => $langcode));

    case 'SEPD':     return // SUBSCRIPTIONS_DIGEST_SEPARATOR
t('=====================================================', array(), array('langcode' => $langcode));

    case 'SUBJ':     return // SUBSCRIPTIONS_DEFAULT_SUBJECT
t('[[site:name]] [subs:type] subscription for [current-user:name]: [node:title]', array(), array('langcode' => $langcode));

    case 'FOOT':     return // SUBSCRIPTIONS_DEFAULT_FOOTER
t('| This is an automated message. Please do NOT reply to the sender address!
| To manage your subscriptions go to
| [subs:manage-url]
', array(), array('langcode' => $langcode));

    case 'BODY':     return // SUBSCRIPTIONS_DEFAULT_BODY
t('{{MAIL@| Greetings, [current-user:name].
|
| Your subscription on [site:name]
| notifies you of {{[subs:is-new]==0?:a new post:
}}{{[subs:is-updated]#an updated post:
}}{{[subs:is-old]#new comments on:
}}|
}}{{![subs:is-published]#| ***** This post is unpublished! *****
}}{{![subs:category:tid]?:{{[subs:category:tid]==[subs:forum:tid]?:| Category: [subs:category:name]
}}}}{{![subs:forum:tid]?:| Forum: [subs:forum:name]
}}{{![node:author:name]?:| Author: [node:author:name]
}}| Title: [node:title]
{{![subs:terms:field_tags:count]?:| [subs:terms:field_tags:first:vocabulary:name]: {{[subs:terms:field_tags:count]#{{!!#0#, }}[subs:terms:field_tags:index:#0:name]}}
}}{{![subs:is-old]?&nbsp;
[node:body]:{{![subs:has-distinct-summary]?&nbsp;
[node:body]:| Summary:
&nbsp;
[node:summary]}}}}
| LINK: [node:url]
{{![subs:is-old]#{{!![subs:files:field_files:count]#| Attached files:
{{[subs:files:field_files:count]#| [subs:files:field_files:index:#0:url]
}}}}}}{{![subs:comments:count]?!SEPARATOR
:|
| Comments: [subs:comments:count]
!SEPARATOR
[subs:comments:join:
]
}}| Direct unsubscribe link ([subs:type]):
| [subs:unsubscribe-url]
{{MAIL@!FOOTER}}', array('!SEPARATOR' => subscriptions_mail_template_raw('SEP', $langcode), '!FOOTER' => subscriptions_mail_template_raw('FOOT', $langcode)), array('langcode' => $langcode));

    case 'CITEM':    return // SUBSCRIPTIONS_DEFAULT_COMMENT_ITEM
t('| {{[subs:is-new]?New:Updated}} {{[subs:is-published]?:UNPUBLISHED }}comment:
| Author: [comment:author:name]
| Title: [comment:title]
&nbsp;
[comment:body]
| LINK: [comment:url]
{{!![subs:files:field_files:count]#| Attached files:
{{[subs:files:field_files:count]#| [subs:files:field_files:index:#0:url]
}}}}!SEPARATOR', array('!SEPARATOR' => subscriptions_mail_template_raw('SEP', $langcode)), array('langcode' => $langcode));

    case 'DSUBJ':    return // SUBSCRIPTIONS_DEFAULT_DIGEST_SUBJECT
t('[[site:name]] Subscriptions Digest for [current-user:name]', array(), array('langcode' => $langcode));

    case 'DBODY':    return // SUBSCRIPTIONS_DEFAULT_DIGEST_BODY
t('| Greetings, [current-user:name].
|
| Your subscriptions on [site:name]
| notify you of the following changes since the previous digest:
|
{{[subs:items:count]#!SEPARATOR #1 of [subs:items:count] {{[subs:items:index:#0:subs:is-new]?(new):}}{{[subs:items:index:#0:subs:is-updated]?(updated):}}{{[subs:items:index:#0:subs:is-old]?(commented):}}
[subs:items:index:#0:formatted]
}}!SEPARATOR
!FOOTER', array('!SEPARATOR' => subscriptions_mail_template_raw('SEPD', $langcode), '!FOOTER' => subscriptions_mail_template_raw('FOOT', $langcode)), array('langcode' => $langcode));

  }
  return NULL;
}

function subscriptions_mail_template($key, $langcode) {
  static $templates;
  if (!isset($templates[$langcode][$key])) {
    $templates[$langcode][$key] = subscriptions_mail_template_raw($key, $langcode);
  }
  return $templates[$langcode][$key];
}

/**
 * Retrieve a mail template, either from the mail_edit table or take
 * our default template in this file, passing it through t().
 *
 * @param string $mailmod
 *  The module requesting the template (part of the full mailkey).
 * @param string $mailkey
 *  The mailkey, used with $mailmod as id in the {mail_edit} table.
 * @param string $langcode
 *  The language code, used as language in the {mail_edit} table or for
 *  translating out default template.
 * @param string $part
 *  Either 'subject' or 'body', used to indicate the column to retrieve
 *  from the {mail_edit} table.
 * @param string $key
 *  The key for calling subscriptions_mail_template() to retrieve the
 *  default template, if there's no match in the {mail_edit} table.
 *
 * @return
 */
function subscriptions_mail_template_load($mailmod, $mailkey, $langcode, $part, $key) {
  if (module_exists('mail_edit')) {
    $id = $mailmod . '_' . $mailkey;
    static $cache = array();
    if (!isset($cache[$langcode][$id])) {
      $query = db_select('mail_edit', 'me')
        ->fields('me')
        ->condition('me.id', $id)
        ->condition('me.language', $langcode);
      $cache[$langcode][$id] = $query->execute()->fetchObject();
    }
    if (isset($cache[$langcode][$id]->$part)) {
      return $cache[$langcode][$id]->$part;
    }
  }
  return subscriptions_mail_template($key, $langcode);
}

