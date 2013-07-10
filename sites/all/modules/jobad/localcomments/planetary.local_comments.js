/*
  A template module.

  Copyright (C) 2013 KWARC Group <kwarc.info>

  This file is part of JOBAD.

  JOBAD is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  JOBAD is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with JOBAD.  If not, see <http://www.gnu.org/licenses/>.
*/


JOBAD.modules.register({
  /* Module Info / Meta Data */
  info:{
    'identifier':  'planetary.local_comments',  //(Unique) identifier for this module, preferably human readable.
    'title':  'Localised Comments for Planetary', //Human Readable title of the module.
    'author':  'Tom Wiesing', //Author
    'description':  'Localised comments module', //A human readable description of the module.
    'hasCleanNamespace': false
  },
  init: function(JOBADInstance){
    var notifications = Drupal.settings.localcomments.comments;
    var comment_types = this.getCommentTypes(); 

    for(var i=0;i<notifications.length;i++){
      (function(){
          var me = notifications[i];
          JOBADInstance.Sidebar.registerNotification(document.getElementById(me.id), {
            "text": me.summary,
            "trace": true,
            "click": function(){
              location.href = me.dest_url; 
            },
            "icon": comment_types[me.type]
          }).on("contextmenu", false);
      })()
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
      res[types[i]] = icons[i]; 
    }

    return res; 
  },
  contextMenuEntries: function(target, JOBADInstance){
    var id = JOBAD.util.closest(target, function(e){
      return (typeof e.attr("id") != "undefined");
    }).attr("id");

    if(typeof id == "undefined"){
      return; 
    }

    var comment_types = this.getCommentTypes(); 

    var result = {}; 

    result["View Comments"] = JOBAD.util.map(this.getCommentsFor(id), function(comment){
      return [comment.summary, function(){
        location.href = comment.dest_url; 
      }, comment_types[comment.type]]; 
    }); 

    if(result["View Comments"].length == 0){
      result["View Comments"].push(["No comments available", function(){return; }]);
    }

   if(Drupal.settings.localcomments.shows_add_menu_entry){
      var add_comment = function(type){
        var url = Drupal.settings.localcomments.nid; 

        var $dialog = jQuery("<div>");
        $dialog
        .attr("title", "New comment for '"+id+"'")
        .append(
          JOBAD.refs.$("<iframe />")
          .attr("src", Drupal.settings.basePath+"localcomment/"+escape(url)+"/"+escape(id)+"/"+escape(type)+"/?ajax")
          .width("100%")
          .height("95%")
        )
        .dialog({
          height: 500,
          width: 1000,
          modal: true,
          close: function(){
            location.reload(); 
          }
        }).parent().css({
          "position": "fixed",
          "top": Math.max(0, ((window.innerHeight - $Div.outerHeight()) / 2)),
          "left": Math.max(0, ((window.innerWidth - $Div.outerWidth()) / 2))
        });
      };

      result["Add Comment"] = JOBAD.util.map(comment_types, function(icon, type){
        return [type, function(){add_comment(type); }, icon]
      }); 
    }

    return result; 
  }
});
