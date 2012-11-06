(function($){
 $(document).ready(function(){
// There's probably a "cooler" way to do this.
//remove grippies code
$(window).load(RemoveGrippies);
function RemoveGrippies() {
	var objs = document.getElementsByTagName("div");
	var oi = 0;
	var thisObj;
	for (oi = 0; oi != objs.length; oi++) {
		thisObj = objs[oi];
		if (thisObj.className == 'grippie') {
		        thisObj.className = "";
		}
	}
	return;
}

$('.form-type-textarea').each(function(){
var regex = / form-item-field-.*und-0-preamble$/;
var className = $(this).attr('class');
var preambleShown =0;

if (className.match(regex)){
	var preamble = $(this);
        preamble.find('label').text('Show preamble »').
            css('color','#06799F').
            css('cursor','pointer');
        preamble.find('div').hide();
        preamble.find('label').click(function(){
            preamble.find('div').eq(0).toggle(500,function(){
                //console.log(preambleShown);
                if (preambleShown==0){
                    preamble.find('label').text('« Hide preamble');
                    preambleShown=1;
                }else {
                    preamble.find('label').text('Show preamble »');
                    preambleShown=0;
                }
            });
        });
}
regex = / form-item-field-.*und-0-metadata$/;
if (className.match(regex)){
$(this).hide();
}

}); // end of $('.form-type-textarea').each
}); // end of $(document).ready
})(jQuery);
