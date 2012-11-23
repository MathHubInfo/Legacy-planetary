/*
 * Makes spatial adjustments in the layout of mathematical documents' presentations
 * in Drupal
 * @author Vlad Merticariu<v.merticariu@jacobs-university.de>
 */

(function($){
    $(document).ready(function(){
       $('h1').css('color', '#1E5799');
       var a = $('.field-items').html();
       //removing unnecessary break lines
       a = a.split('<br>').join('');
       //a = a.split('</a>').join('</a><br/>');
       $('.field-items').html(a);
       $('.book-navigation .menu').remove();
    });
})(jQuery)

