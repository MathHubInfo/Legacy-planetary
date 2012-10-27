(function($){
	   $(window).load(function(){
	       $('.thesaurus').each(function(){
		   var dataShown =0;
		   var data = $(this);
		   console.log(data);
		   data.find('label.show_hide')
		       .text('Show thesaurus metadata »')
		       .css('color','#06799F')
        	       .css('cursor','pointer');
		   data.find('div').hide;
		   data.find('label.show_hide').click(function(){
		       data.find('div').eq(0).toggle(500,function(){
			   console.log(dataShown);
			   if (dataShown==0){
			       data.find('label.show_hide').text('« Hide thesaurus metadata');
			       dataShown=1;
			   } else {
			       data.find('label.show_hide').text('Show thesaurus metadata »');
			       dataShown=0;
			   }
		       }); 
		   });
});
});
})(jQuery);
