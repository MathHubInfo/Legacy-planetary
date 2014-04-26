var local_comments = {
  info:{
    'identifier':  'planetary.local_comments',  
    'title':  'Localised Comments for Planetary', 
    'author':  'JOBAD/MMT Developer team', 
    'description':  'Localised comments module', 
    'version' : '1.0',
    'dependencies' : [],
    'hasCleanNamespace': false
  },

  init: function(JOBADInstance){
    var notifications = Drupal.settings.localcomments.comments;
    var comment_types = this.getCommentTypes(); 

    var showNotification = function(me) {
      JOBADInstance.Sidebar.registerNotification(document.getElementById(me.id), {
        "text": me.summary,
        "trace": true,
        "click": function(){
          location.href = me.dest_url; 
        },
        "icon": comment_types[me.type]
      }).on("contextmenu", false);
    };
    for(var i=0;i<notifications.length;i++){
      showNotification(notifications[i]);
    }
  },
  getCommentsFor: function(id){
    var notifications = Drupal.settings.localcomments.comments;
    var res = []; 
    for(var i=0;i<notifications.length;i++){
      if(notifications[i].id == id){
        res.push(notifications[i]); 
      }
    }
    return res; 
  },
  getCommentTypes: function(){
    var types = Drupal.settings.localcomments.comment_types;
    var icons = Drupal.settings.localcomments.comment_icons;

    if(types.length != icons.length){
      JOBAD.console.warn("Received wrong data from Drupal for localcomment types. Please check config. ");
    }

    var res = {}; 

    for(var i=0;i<types.length;i++){
      res[types[i]] = icons[i].replace("\r", ""); 
    }

    return res; 
  },
  contextMenuEntries: function(target, JOBADInstance){
    var id = JOBAD.util.closest(target, function(e){
      return (typeof e.attr("id") != "undefined");
    }).attr("id");

    if(typeof id == "undefined"){      
      id = "test";//return; 
    }

    var comment_types = this.getCommentTypes(); 

    var result = {}; 

    if(Drupal.settings.localcomments.shows_add_menu_entry){
      var add_comment = function(type){
        var url = Drupal.settings.localcomments.nid; 

        var lc_dialog = jQuery(
          '<div id="lc-form" title="Add new local comment">' + 
          '<p class="validateTips">All form fields are required.</p>' + 
          '<form>' + 
          ' <fieldset>' + 
          '   <label for="title">Title</label>' +
          '   <input type="text" name="title" id="title" class="text ui-widget-content ui-corner-all" />' +
          '   <label for="body">Body</label>' +
          '   <textarea rows="5" cols="30" name="body" id="body" class="text ui-widget-content ui-corner-all" />' +
          ' </fieldset>' +
          '</form>' +
          '</div>');
        lc_dialog.dialog({
          autoOpen: false,
          height: 300,
          width: 350,
          modal: true,
          buttons: {
            'Save' : function() {
              var arr = lc_dialog.find("form").serializeArray();
              var title = arr[0].value;
              var body = arr[1].value;
              $.ajax({
                url: Drupal.settings.basePath+"?q=lctest", 
                type:'POST',
                data: {
                  'url' : url,
                  'id' : id,
                  'type' : type, 
                  'body' : body,
                  'title' : title,
                },
                error : function(req, status, error) {console.log(error);}
              });
              $( this ).dialog( "close" );
            },
            'Cancel': function() {
              $( this ).dialog( "close" );
            },

          },
          close: function() {
            lc_dialog.find("input").removeClass( "ui-state-error" );
          },  
        });
        
        lc_dialog.dialog("open");
      };

      result["Add Comment"] = JOBAD.util.map(comment_types, function(icon, type){
        return [type, function(){add_comment(type); }, icon];
      });
    }
    
    return result; 
  }
};
JOBAD.modules.register(local_comments);
