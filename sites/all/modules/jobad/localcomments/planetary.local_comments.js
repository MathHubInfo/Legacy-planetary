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
  globalinit: function(){
      //icon source http://openiconlibrary.sourceforge.net/gallery2/open_icon_library-full/icons/png/48x48/actions/documentation.png
      //license lgpl
      JOBAD.resources.provide("icon", "planetary.localcomment", "data:image/png;base64,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"); 
  },
  init: function(JOBADInstance){
    var notifications = Drupal.settings.localcomments.comments;
    var comments = []; 

    for(var i=0;i<notifications.length;i++){
      (function(){
          var me = notifications[i];
          JOBADInstance.Sidebar.registerNotification(JOBAD.refs.$("#"+me.id), {
            "text": me.summary,
            "trace": true,
            "click": function(){
              location.href = me.url; 
            },
            "class": "info",
            "icon": "planetary.localcomment",
          }).on("contextmenu", false);

          comments.push(me.id);
      })()

      this.localStore.set("comments", comments);
    }
  },
  getComment: function(id){
    var notifications = Drupal.settings.localcomments.comments;
    for(var i=0;i<notifications.length;i++){
      if(notifications[i].id == id){
        return notifications[i]; 
      }
    }
    return undefined; 
  },
  contextMenuEntries: function(target, JOBADInstance){
    var id = JOBAD.util.closest(target, function(e){
      return (typeof e.attr("id") != "undefined");
    }).attr("id");

    var me = this; 

    if(JOBAD.util.indexOf(this.localStore.get("comments"), id) != -1){
      return {
        "View Comment": function(){
          return location.href = me.getComment(id).url; 
        }
      };
    } else {
      return {
        "Add Comment": function(){
          var url = Drupal.settings.localcomments.nid; 

          var $dialog = jQuery("<div>");
          $dialog
          .attr("title", "New comment for '"+id+"'")
          .append(
            JOBAD.refs.$("<iframe />")
            .attr("src", Drupal.settings.basePath+"localcomment/"+escape(url)+"/"+escape(id)+"/?ajax")
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
          });
        }
      };
    }
  }
});
