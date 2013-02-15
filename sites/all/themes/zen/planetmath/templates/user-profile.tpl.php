<?php

/**
 * @file
 * Default theme implementation to present all user profile data.
 *
 * This template is used when viewing a registered member's profile page,
 * e.g., example.com/user/123. 123 being the users ID.
 *
 * Use render($user_profile) to print all profile items, or print a subset
 * such as render($user_profile['user_picture']). Always call
 * render($user_profile) at the end in order to print all remaining items. If
 * the item is a category, it will contain all its profile items. By default,
 * $user_profile['summary'] is provided, which contains data on the user's
 * history. Other data can be included by modules. $user_profile['user_picture']
 * is available for showing the account picture.
 *
 * Available variables:
 *   - $user_profile: An array of profile items. Use render() to print them.
 *   - Field variables: for each field instance attached to the user a
 *     corresponding variable is defined; e.g., $account->field_example has a
 *     variable $field_example defined. When needing to access a field's raw
 *     values, developers/themers are strongly encouraged to use these
 *     variables. Otherwise they will have to explicitly specify the desired
 *     field language, e.g. $account->field_example['en'], thus overriding any
 *     language negotiation rule that was previously applied.
 *
 * @see user-profile-category.tpl.php
 *   Where the html is handled for the group.
 * @see user-profile-item.tpl.php
 *   Where the html is handled for each item in the group.
 * @see template_preprocess_user_profile()
 */
?>
<div class="profile"<?php print $attributes; ?>>
<?php 
   print render($user_profile['privatemsg_send_new_message']);
   print render($user_profile['userpoints']);
   print render($user_profile['summary']);
 ?>
<table border="0" style="border:none;">
<tr border="0">
<td width="50%">
  <?php
     if(empty($user_profile['planetmath_private_articles']['#links'])) {
         hide($user_profile['planetmath_private_articles']);
     }
     else {
         print render($user_profile['planetmath_private_articles']);
     }

     if(empty($user_profile['planetmath_user_articles']['#links'])) {
         hide($user_profile['planetmath_user_articles']);
     }
     else {
         print render($user_profile['planetmath_user_articles']);
     }

     if(empty($user_profile['planetmath_coauthored_articles']['#links'])) {
         hide($user_profile['planetmath_coauthored_articles']);
     }
     else {
         print render($user_profile['planetmath_coauthored_articles']); 
     }


 ?>
</td>
<td width="50%" >
  <?php
     if(!empty($user_profile['buddy_list'])){
         print render($user_profile['buddy_list']);
     }
         print render($user_profile['planetmath_user_buddies']);
         hide($user_profile['og_group_ref']);
         hide($user_profile['og_user_group_ref']);
         hide($user_profile['og_user_node']);
         print render($user_profile['planetmath_my_teams']);?>
</td>
</tr>
</table>

<?php
  //dd("USER_PROFILE");
  //dd($user_profile);
         print render($user_profile); ?>
</div>
