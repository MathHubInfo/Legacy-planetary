Subscriptions by Reference for Drupal 7
--------------------------------------------------------------------
This project is an extention to Subscriptions module which allows
users to subscribe to new content via node reference fields. 

Sample use case
-------------------
 - There are two content types Answer and Question and each Answer references
    specific question via node reference or entity reference field.
 - As a user I want to subscribe to a Question, which means that every new
    answer related to that question will be mailed to me.

For Developers
-------------------
All that is required for the above use case to work is following implementation
of hook_subscriptions_reference_info() which is provided by this module:

/**
 * Implements hook_subscriptions_reference_info()
 */
function example_subscriptions_reference_info() {
  return array(
    'question_answers' => array(
      'parent' => 'question',
      'child' => 'answer',
      'field' => QUESTION_REFERENCE_FIELD,
      'ref_item' => 'nid', // this will be 'target_id' for entity reference
  ));
}
