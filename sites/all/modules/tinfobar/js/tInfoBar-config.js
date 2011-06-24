
   var $ = jQuery;

window.onload = function(){

	$.extend($.expr[':'], {
		math : function(a){
			return a.nodeName.toLowerCase() == 'm:math' || a.nodeName.toLowerCase() == 'math';
		},
		mrow : function(a){
			return a.nodeName.toLowerCase() == 'm:row';
		},
		contextPoint : function(a){
			return !!$(a).data('contextPoint');
		}
	});
   
   var content = $('#block-system-main'); 
	var imgDir  = 'sites/all/modules/tinfobar/images/';
   
   /*
   var c = 0;
   $('b, u, i').each(function(){
      $(this).attr('id', 'UID_'+(++c));
   });
   */
   
   var infoBar = new tInfoBar({
			ajaxFile		: '?q=tInfoBar/getTokens',
			handle		: $(':math, p[id], .omdoc-image[id]', content),
			context		: getContext(),
			hoverAttr	: {
				mathbackground	: 'yellow'
			},
			menu			: {
				liveBind				: true,
				distance				: 45,
				mousePositioning	: true
			},
			tooltip		: {
//				scheme	: 'scheme-simple-left',
				position	: 'left'
			}
		}, null, {		// redefine path to images
			ajax				: imgDir+'ajax.gif',
			info				: imgDir+'sIcon_info.png',
			bug				: imgDir+'icon_bug.png',
			comment			: imgDir+'icon_comment.png',
			comments			: imgDir+'icon_comments.png',
			definition		: imgDir+'icon_definition.png',
			prerequisites	: imgDir+'icon_prerequisites.png',
			guidedTours		: imgDir+'icon_guidedTours.png'
			
		}
	);
	
	infoBar.attach( content );
	infoBar.getData();
	
	iconMenu_setup( infoBar );
}

function iconMenu_setup( infoBar ){
	var opt 	= infoBar.data.opt;
	var cls 	= infoBar.data.cls;
	var img 	= infoBar.data.img;
	var com 	= infoBar.data.com;
	
	var menu		= com.menu.menu();
	var tooltip	= com.tooltip.get();
	
	com.menu
		.add( menuItem('Definition look-up', img.definition),	null, 'definition')
		.add( menuItem('View forum discussions', img.comments),	null, 'forum')
		.add( menuItem('Ask a question', img.comment), null, 'question')
		.add( menuItem('Guided tours', img.guidedTours), null, 'tours')
		.add( menuItem('Prerequisites graph', img.prerequisites), null, 'prerequisites')
		.add( menuItem('Report an error', img.bug), null, 'bug')
	;
	
	tooltip
		.html(	'<table cellspacing="0" cellpadding="0" id="questionView" class="tokenView">'+
						'<tr><td class="'+cls.comments+'"></td></tr>'+
						'<tr><td><textarea style="width:155px;resize:none"></textarea></td></tr>'+
						'<tr><td style="text-align:right">'+
							'<input type="button" value="Cancel" class="closeMe" />'+
							'<input type="button" value="Submit" class="submit" />'+
						'</td></tr>'+
					'</table>'+
					
					'<div id="commentsView" class="tokenView">'+
						'<ul id="commentsHolder"></ul>'+
						'<div style="text-align:right;background:#fff; padding:2px">'+
//							'<a href="'+(gdn.url('/post/discussion'))+'" id="postQuestion" target="_blank" style="color:darkred; display:block; border-bottom:1px solid #696969; text-shadow:none">Ask a new question</a>'+
							'<input type="button" value="Cancel" class="closeMe" />'+
						'</div>'+
					'</div>'
		).hide()
		.find('.closeMe')
		.bind('click.closeMe', function(){ com.tooltip.hide(); })
		.end()
		.find('.submit')
		.bind('click.sendMessage', function(){
			var s 		= menu.data('source');
         
         var context = getContext();

			$.get( '?q=tInfoBar/comment/' + (s.attr('id') || 'ERROR') + '/' + context + '/' + GI('username') + '/' + escape( tooltip.find('textarea').eq(0).val() ), 
			   {}, 
			   function(r){
					if(r['result'] == 'true'){
						if(!s.data('infoBarIcon')) com.self.addToken(s);
						tooltip.find('textarea').eq(0).val('');
						com.menu.hideMenu();
					} else M(r, 'error');
			});
		});
		
	menu.append(tooltip)
		.data('tooltip', tooltip)
		.bind('onHideMenu', function(){
			menu.data('tooltip').hide();
		});
	
	com.menu
		.get('question')
		.bind('click.questionToken', function(e){
		
			infoBar.getTooltip().target($(this));
			
			menu
				.find('.'+cls.comments)
				.html( $(document.createElement('img')).attr({'src':img.ajax, 'height':16}) );
			
			showView('questionView');
				
			$.get( '?q=tInfoBar/getComments/' + menu.data('source').attr('id') , 
			   {}, 
			   function(r){
					var h = '';
					for(var i in r){
						h += '<div><b>'+r[i].user+'</b>: '+r[i].text+'</div>';
					}
					menu.find('.'+cls.comments).html(h);
			});
		});
		
	
	com.menu
		.get('forum')
		.bind('click.commentsToken', function(e){
		
			infoBar.getTooltip().target($(this));
			
			var commentsHolder =	menu.find('#commentsHolder');
			
			var ArticleID	= $('#CurrentArticleID').html();
			ArticleID		= ArticleID ? ArticleID : -1;
			
			var link = $('#postQuestion');
			link[0].href = link.attr('href') + '&code=' + ArticleID + '||' + menu.data('source').attr('id');
			
			commentsHolder
				.html( $(document.createElement('img')).attr({'src':img.ajax, 'height':16}) );
			
			showView('commentsView');
			
			$.get( '?q=tInfoBar/getComments/'+menu.data('source').attr('id'), 
			   {}, 
			   function(r){
					commentsHolder.html( r );
				});
			
		});
	
	function showView(id){
		if(!id) return;
		tooltip
			.find('.tokenView')
			.hide()
			.end()
			.find('#'+id)
			.show();
	}
	
	/** Inner Functions defined bellow **/
	function menuItem(title, path){
		return $(document.createElement('a'))
					.attr({
						'href'	: 'javascript:void(0)',
						'class'	: cls.popItem,
						'title'	: title
					})
					.append( 
						$(document.createElement('img'))
							.attr('src', path) 
					);
	}
}

function getContext(){
   return GI('nodeType') + '_' + GI('nodeId');
}

/** Get global info script **/
function GI( name ){
   var wrapper = 'tInfoBar_info';
   var prefix  = 'info_';
   return $('#'+wrapper).find('#'+prefix+name).html();
}
