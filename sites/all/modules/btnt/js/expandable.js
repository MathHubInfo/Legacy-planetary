/*
 * Makes chapters expandable links, displaying their content in book pages.
 * Also adds numbering to the chapters and sections of the documents, realtive to
 * their parents.
 * @author Vlad Merticariu<v.merticariu@jacobs-university.de>
 */
(function($){
    $(document).ready(function(){
        $('.chapter-link').addClass('chapter-collapsed');
        $('.chapter-collapsed').each(function(){
            $(this).append('<br/>'); 
        });
        $('.chapter-collapsed').each(function(){
            $(this).wrap('<li class = "expandable-collapsed" />'); 
        });
        
        //adding numbering for chapter links
        $('.omdoc-omgroup').each(function(){
            var childNumber = $(this).find('.omdoc-omgroup-number')[0];
            var base = $(childNumber).html().replace(" ","");
            var subChapters = $(this).find('.chapter-link');
            var counter = 1;
            $(subChapters).each(function(){
                var oldHtml = $(this).html();
                $(this).html(base + counter + '. ' + oldHtml);
                counter++;
            });
        });
        
        $('.chapter-collapsed').live('click', function(e){
            var that = this;
            var path = $(this).attr('href').split('..');
            path = path[path.length-1];
   
            $(this).removeClass('chapter-collapsed').addClass('chapter-expanded');
            $(this).parent().removeClass('expandable-collapsed').addClass('expandable-expanded');
            //check for cache
            if($(this).parent().children('.subchapter').length){
                $(this).parent().children('.subchapter').show();
            }//no cache
            else{
                $.post('/btnt/callback/body', {
                    'filePath': path
                }, function(data){
                    //data = data.split('</a>').join('</a><br/>');
                    $(that).parent().append('<div class="subchapter">' + data + '</div>');
                    
                    //omdoc-omgroup-number
                    var counter = 1;
                    var base = -1;
                    var subSpans = $($(that).parents('.omdoc-omgroup')[0]).children('.para').children('p').children();
                    $(that).parent().find('.omdoc-omgroup-number').each(function(){
                        newThis = this;
                        counter = 1;
                        $(subSpans).each(function(){
                            if($(this).attr('href') == $($(newThis).parents('.omdoc-oref')[0]).attr('href')){
                                return false;
                            }
                            counter++;
                        });
                        var parent = $(this).parent().parent().parent().parent().parent().parent().parent().parent('.omdoc-omgroup');
                        if(base == -1){
                            $(parent).find('.omdoc-omgroup-number').each(function(){
                                base = $(this).html().replace(" ", ""); 
                                return false;
                            });
                        }
                        $(this).html(base + counter + '.');
                        counter++;
                    });
                    //omdoc-omtext-number
                    counter = 1;
                    $(that).parent().find('.omdoc-omtext-number, .omdoc-definition-number, .omdoc-transition-number, .omdoc-introduction-number').each(function(){
                        var parent = $(this).parents('.omdoc-omgroup')[0];
                        var number = $(parent).find('.omdoc-omgroup-number')[0];
                        base = $(number).html().replace(" ", "");
                        $(this).html(base + counter + '.');
                        counter++;
                    });
                    $('.chapter-link:not(.chapter-collapsed):not(.chapter-expanded)').each(function(){
                        $(this).wrap('<li class = "expandable-collapsed" />'); 
                        $(this).addClass('chapter-collapsed');
                        $(this).append('<br/>');
                    });
                    //link numbering
                    var omgroups = $(that).parent().find('.omdoc-omgroup');
                    $(omgroups).each(function(){
                        var childNumber = $(this).find('.omdoc-omgroup-number')[0];
                        var base = $(childNumber).html();
                        var subChapters = $(this).find('.chapter-link');
                        var counter = 1;
                        $(subChapters).each(function(){
                            var oldHtml = $(this).html();
                            $(this).html(base + counter + '. ' + oldHtml);
                            counter++;
                        });
                    });
                });
            }
            e.preventDefault();
        });
        
        $('.chapter-expanded').live('click', function(e){
            $(this).parent().children('.subchapter').hide();
            $(this).removeClass('chapter-expanded').addClass('chapter-collapsed');
            $(this).parent().removeClass('expandable-expanded').addClass('expandable-collapsed');
            e.preventDefault();
        });
    });
})(jQuery)

