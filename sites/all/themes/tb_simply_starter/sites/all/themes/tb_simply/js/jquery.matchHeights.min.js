/*
 * Match Heights Plugin
 * Match the heights of targeted elements
 * 
 * Version 1.3
 * Updated 4/7/2010
 * Copyright (c) 2010 Mike Avello
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */
(function(a){a.fn.matchHeights=function(b){b=jQuery.extend(this,{minHeight:null,maxHeight:null},b);tallest=b.minHeight?b.minHeight:0;this.each(function(){if(a(this).innerHeight()>tallest)tallest=a(this).outerHeight()});if(b.maxHeight&&tallest>b.maxHeight)tallest=b.maxHeight;return this.each(function(){extra=a(this).innerHeight()-a(this).height();extra+=a(this).outerHeight()-a(this).innerHeight();a.browser.msie&&a.browser.version==6||b.maxHeight?a(this).css({height:tallest-extra}):a(this).css({"min-height":tallest-extra})})}})(jQuery);