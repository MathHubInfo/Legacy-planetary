(function($) {
		
	/**
	 * The heartbeat object.
	 */
	Drupal.heartbeat = Drupal.heartbeat || {};
	
	Drupal.heartbeat.moreLink = null;
	
	/**
	 * wait().
	 * Function that shows throbber while waiting a response.
	 */
	Drupal.heartbeat.wait = function(element, parentSelector) {
	
	  // We wait for a server response and show a throbber 
	  // by adding the class heartbeat-messages-waiting.
	  Drupal.heartbeat.moreLink = $(element).parents(parentSelector);
	  // Disable double-clicking.
	  if (Drupal.heartbeat.moreLink.is('.heartbeat-messages-waiting')) {      
	    return false;
	  }
	  Drupal.heartbeat.moreLink.addClass('heartbeat-messages-waiting');
	  
	}
	
	/**
	 * doneWaiting().
	 * Function that is triggered if waiting period is over, to start
	 * normal behavior again.
	 */
	Drupal.heartbeat.doneWaiting = function() {
	  Drupal.heartbeat.moreLink.removeClass('heartbeat-messages-waiting');
	}
	
	/**
	 * Get the uaid from the heartbeat activity messages.
	 */
	Drupal.heartbeat.getActivityId = function(selector) {
	  // Look into the classes.
	  if ($(selector).attr('id') == "") {
	    var classList = $(selector).attr('class').split(/\s+/);
      for (i = 0; i < classList.length; i++) {
        if (classList[i].indexOf("heartbeat-activity-") == 0) {
          return classList[i].replace("heartbeat-activity-", "");
        }
      }
	  }
	  // Retrieve uaid immediately from id if possible.
	  else {
	    return $(selector).attr('id').replace("heartbeat-activity-", "");
	  }
	}
	
	/**
	 * pollMessages().
	 *   Function that checks and fetches newer messages to the
	 *   current stream.
	 */
	Drupal.heartbeat.pollMessages = function(streamName, pollType) {

	  // Lookup the streams and poll each one of them.
	  if (streamName == undefined || streamName == null) {
	    
	    $('.heartbeat-stream').each(function(i) {
	      var streamId = $(this).attr('id');
	      var streamName = streamId.replace("heartbeat-stream-", "");
	      Drupal.heartbeat._pollMessages(streamName, pollType);
	    });
	    
	  }
	  // Just poll the called stream by name.
	  else {
	    Drupal.heartbeat._pollMessages(streamName, pollType);
	  }
	  
	}

	  
/**
 * _pollMessages().
 * Checks and fetches newer messages for the current stream.
 * 
 * @param streamName 
 *   The unique name of the stream.
 */
Drupal.heartbeat._pollMessages = function(streamName, pollType) {

  var stream_selector = "#heartbeat-stream-" + streamName;

  // Only trigger if a selector is met.
	  if ($(stream_selector).length > 0) {

	    // The pollType is always 0 if the current user added a Status.
	    if ((pollType == undefined || pollType == null) && Drupal.settings.heartbeatPollTypes[streamName] != undefined) {
	      var pollType = parseInt(Drupal.settings.heartbeatPollTypes[streamName]);
	    }
	    
	    var href = Drupal.settings.heartbeat_poll_url;
	    var uaids = new Array();
	    var beats = $(stream_selector + ' .heartbeat-activity');
	    var firstUaid = 0;
	    if (beats.length > 0) {
	      firstUaid = Drupal.heartbeat.getActivityId(beats.get(0));
	      beats.each(function(i) {  
	        var uaid = parseInt(Drupal.heartbeat.getActivityId(this));
	        uaids.push(uaid);
	      });
	    }
	    
	    var stream = stream_selector.replace("#heartbeat-stream-", "");
	    var args = {
	      block: $(stream_selector).hasClass('heartbeat-block'),
	      ajax: true,
	      stream_name: stream,
	      stream_class: stream,
	      latestUaid: firstUaid,
      language: Drupal.settings.heartbeat_language,
      viewed_uid: Drupal.settings.viewed_uid,
	      uaids: uaids.join(',')
	    };
	    
	    // Are there contextual arguments to send along.
	    if (Drupal.settings.heartbeatContextArguments != undefined) {
	      args.contextualArguments = Drupal.settings.heartbeatContextArguments;
	    }
    
	    // Allow overrides or additions to the arguments.
	    $.event.trigger('heartbeatBeforePoll', [args]);
	    
	    if (pollType == 0) {
	      var onNewMessagesSuccess = Drupal.heartbeat.prependMessages;
	    }
	    else {
	      var onNewMessagesSuccess = Drupal.heartbeat.prependMessagesActions;
	    }
	
    $.ajax({
      url: href,
  			    dataType: 'json',
  		    data: args,
  		    success: onNewMessagesSuccess
  		  });

	  }
	  
	}

/**
 * prependMessagesActions().
 * Prepend a action box above the stream to allow the user
 * to see the newer messages, by prepending to the stream.
 */
Drupal.heartbeat.prependMessagesActions = function (data) {

  var stream_selector = '#heartbeat-stream-' + data.stream;
  
  // Prepend the messages after a click.
  if (data.count != undefined && data.count > 0) {
    if ($(".heartbeat-stream-notification").length == 0) {
      $(stream_selector).before('<div class="heartbeat-stream-notification"></div>');
    }
    var $link = $('<a href="#">' + Drupal.t("@count new messages", {"@count": data.count}) + '</a>');
    $link.bind('click', function() {
      Drupal.heartbeat.prependMessages(data);
      $(stream_selector).find(".heartbeat-empty").hide();
      $(".heartbeat-stream-notification").hide("slow").remove();
      return false;
    });
    $(".heartbeat-stream-notification").html($link);
    
  }

  // Update the times in the stream.
  var time_updates = data.time_updates;
  for (uaid in time_updates) {
    $(stream_selector + ' .heartbeat-activity-' + uaid).find('.heartbeat-time-ago a').text(time_updates[uaid]);
  }
  
}
	
	/**
	 * prependMessages().
	 * Prepend messages to the front of the stream. This done for newer 
	 * messages, often with the auto poller.
	 */
	Drupal.heartbeat.prependMessages = function(data) {

  var stream_selector = '#heartbeat-stream-' + data.stream;

	  // Prepend the messages.
	  if (data.data != '') {
	    var new_messages = $(stream_selector + ' .heartbeat-messages-wrapper').prepend(data.data);
    $(stream_selector).find(".heartbeat-empty").hide();
	    // Re-attach behaviors for new added HTML.
	    Drupal.attachBehaviors(new_messages);
	  }

  // Update the times in the stream.
  var time_updates = data.time_updates;
  for (uaid in time_updates) {
    $(stream_selector + ' .heartbeat-activity-' + uaid).find('.heartbeat-time-ago a').text(time_updates[uaid]);
  }
	  
	}
	
	/**
	 * getOlderMessages().
	 *   Fetch older messages with ajax.
	 */
	Drupal.heartbeat.getOlderMessages = function(element, params) {

  Drupal.heartbeat.wait(element, '.heartbeat-more-messages-wrapper');

	  var data = {
	    stream_name: params.stream_name,
	    stream_class: params.stream_class,
      offset_time: params.offset_time,
      uid: params.uid,
      block: params.page ? 0 : 1,
      ajax: 1
	  }
	  $.ajax({url: element.href, dataType: 'json', data: data, success: Drupal.heartbeat.appendMessages});
	  
	  return false;
	  
	}
	
	/**
	 * appendMessages().
	 * 
	 * Function that appends older messages to the stream.
	 */
	Drupal.heartbeat.appendMessages = function(data) {
	  
	  var wrapper = Drupal.heartbeat.moreLink.parents('.heartbeat-messages-wrapper');
	  Drupal.heartbeat.moreLink.remove();
	  var new_messages = wrapper.append(data.data);
	  Drupal.heartbeat.doneWaiting();
	    
	  // Reattach behaviors for new added html
	  Drupal.attachBehaviors(new_messages);
	  
	}

	/**
	 * jQuery.heartbeatRemoveElement().
	 * Remove element.
	 */
	$.fn.heartbeatRemoveElement = function (id, text) {
	  var element = $(this[0]);
	  var height = element.height();
	  
	  setTimeout(function() { element.css({height: height}).html(text); }, 600);
	  element.effect("highlight", {}, 2000, function() {
	    element.hide('blind', 1000, function() {
	      // This is not necessarily the same element if other elements 
	      // with the same class exist (E.g. several streams on one page).
	      element.remove();
	      // Remove possible existing elements as well.
	      var clss = Drupal.heartbeat.getActivityId(element);
	      $('.heartbeat-activity-' + clss).hide().remove();
	    });
	  });
	  
	}

	/**
	 * jQuery.heartbeatNotifyStreams().
	 * Notifies all streams so they can update.
	 */
	$.fn.heartbeatNotifyStreams = function(ownStatus) {
  Drupal.heartbeat.pollMessages(null, ownStatus);
	};
	
	/**
	 * flagGlobalAfterLinkUpdate.
	 */
	$(document).bind('flagGlobalBeforeLinkUpdate', function(event, data) {
	  var newLine = $('.flag-message', data.newLink);
  $('.heartbeat-activity-' + data.contentId + ' .heartbeat-flag-count').html(newLine.html());
	});

/**
 * Attach behaviours to the message streams
 */
Drupal.behaviors.heartbeat = {
  attach: function (context, settings) {
    $('.beat-remaining', context).each(function() {
      $(this).click(function(e) {
        var id = $(this).attr('id');
        $('#' + id + '_wrapper').toggle('slow'); 
        return false;
      });
    });
  }
};
	
	/**
	 * Document onReady().
	 * 
	 * This is a one-time on load event, not a behavior. It only delegates variables to 
	 * start intervals for polling new activity.
	 */
	$(document).ready(function() {
	  var span = 0;
	  if (Drupal.settings.heartbeatPollNewerMessages != undefined) {
	    for (n in Drupal.settings.heartbeatPollNewerMessages) {
	      if (parseInt(Drupal.settings.heartbeatPollNewerMessages[n]) > 0) {
	        var interval = (Drupal.settings.heartbeatPollNewerMessages[n] * 1000) + span;
	        var poll = setInterval('Drupal.heartbeat.pollMessages("' + n + '")', interval);
	        span += 100;
	      }
	    }  
	  }
	});


	/**
	 * Implements Drupal.shoutbox.afterSubmit.hook.execute().
	 */
	Drupal.shoutbox = Drupal.shoutbox || {afterSubmit: function(){}};
	Drupal.shoutbox.afterSubmit.heartbeatPoller = {
	  execute: function (response) {
	    // Render new messages.
	    Drupal.heartbeat.pollMessages();
	  }
	}
  
})(jQuery);


/**
* Provide the HTML to create the modal dialog.
*/
Drupal.theme.prototype.CToolsHeartbeatModal = function () {
  var html = ''

  html += '<div id="ctools-modal" class="popups-box">';
  html += '  <div class="ctools-modal-content ctools-heartbeat-modal-content">';
  html += '    <div class="popups-container">';
  html += '      <div class="modal-header popups-title">';
  html += '        <span id="modal-title" class="modal-title"></span>';
  html += '        <span class="popups-close"><a class="close" href="#">' + Drupal.CTools.Modal.currentSettings.closeText + '</a></span>';
  html += '        <div class="clear-block"></div>';
  html += '      </div>';
  html += '      <div class="modal-scroll"><div id="modal-content" class="modal-content popups-body"></div></div>';
  html += '      <div class="popups-buttons"></div>'; //Maybe someday add the option for some specific buttons.
  html += '      <div class="popups-footer"></div>'; //Maybe someday add some footer.
  html += '    </div>';
  html += '  </div>';
  html += '</div>';

  return html;

}  