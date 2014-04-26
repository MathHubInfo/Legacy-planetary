(function( $ ){
	$.fn.ribbon = function() {
		ribObj = this;

		var that = function() { 
			return thatRet;
		};
		
		var thatRet = that;
		
		that.selectedTabIndex = -1;
		
		var tabNames = [];
		
		that.goToBackstage = function() {
			ribObj.addClass('backstage');
		}
			
		that.returnFromBackstage = function() {
			ribObj.removeClass('backstage');
		}	
	
		that.init = function() {
			ribObj.find('.ribbon-window-title').after('<div class="ribbon-tab-header-strip"></div>');
			var header = ribObj.find('.ribbon-tab-header-strip');
			
			ribObj.find('.ribbon-tab').each(function(index) {
				var id = $(this).attr('id');
				if (id == undefined || id == null)
				{
					$(this).attr('id', 'tab-'+index);
					id = 'tab-'+index;
				}
				tabNames[index] = id;
			
				var title = $(this).find('.ribbon-title');
				var isBackstage = $(this).hasClass('file');
				header.append('<div id="ribbon-tab-header-'+index+'" class="ribbon-tab-header"></div>');
				var thisTabHeader = header.find('#ribbon-tab-header-'+index);
				thisTabHeader.append(title);
				if (isBackstage) {
					thisTabHeader.addClass('file');
					
					thisTabHeader.click(function() {
						that.switchToTabByIndex(index);
						that.goToBackstage();
					});
				} else {
					if (that.selectedTabIndex==-1) {
						that.selectedTabIndex = index;
						thisTabHeader.addClass('sel');
					}
					
					thisTabHeader.click(function() {
						that.returnFromBackstage();
						that.switchToTabByIndex(index);
					});
				}
				
				
				
				$(this).hide();
			});
			
			ribObj.find('.ribbon-button').each(function(index) {
				var title = $(this).find('.button-title');
				title.detach();
				$(this).append(title);
				
				var el = $(this);
				
				this.enable = function() {
					el.removeClass('disabled');
				}
				this.disable = function() {
					el.addClass('disabled');
				}
				this.isEnabled = function() {
					return !el.hasClass('disabled');
				}
								
				if ($(this).find('.ribbon-hot').length==0) {
					$(this).find('.ribbon-normal').addClass('ribbon-hot');
				}			
				if ($(this).find('.ribbon-disabled').length==0) {
					$(this).find('.ribbon-normal').addClass('ribbon-disabled');
					$(this).find('.ribbon-normal').addClass('ribbon-implicit-disabled');
				}
				

			    var tor = '';
			    if ($(this).children('.button-help').size() > 0) {
				tor = (jQuery(this).children('.button-help').html());
				//$(this).tooltip({"content": tor});
			    }
			});
			
			ribObj.find('.ribbon-section').each(function(index) {
				$(this).after('<div class="ribbon-section-sep"></div>');
			});

			ribObj.find('div').attr('unselectable', 'on');
			ribObj.find('span').attr('unselectable', 'on');
			ribObj.attr('unselectable', 'on');

			that.switchToTabByIndex(that.selectedTabIndex);
		}
		
		that.switchToTabByIndex = function(index) {
			var headerStrip = ribObj.find('.ribbon-tab-header-strip');
			headerStrip.find('.ribbon-tab-header').removeClass('sel');
			headerStrip.find('#ribbon-tab-header-'+index).addClass('sel');

			ribObj.find(".ribbon-tab").hide();
			ribObj.find('#'+tabNames[index]).show();
		}
		
		$.fn.enable = function() {
			if (this.hasClass('ribbon-button')) {
				if (this[0] && this[0].enable) {
					this[0].enable();
				}	
			}
			else {
				this.find('.ribbon-button').each(function() {
					$(this).enable();
				});
			}				
		}
		
		
			
				
		$.fn.disable = function() {
			if (this.hasClass('ribbon-button')) {
				if (this[0] && this[0].disable) {
					this[0].disable();
				}	
			}
			else {
				this.find('.ribbon-button').each(function() {
					$(this).disable();
				});
			}				
		}
	
		$.fn.isEnabled = function() {
			if (this[0] && this[0].isEnabled) {
				return this[0].isEnabled();
			} else {
				return true;
			}
		}
	
	
		that.init();
	
		$.fn.ribbon = that;
	};

})( jQuery );
