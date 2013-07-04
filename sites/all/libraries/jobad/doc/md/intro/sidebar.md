# The Sidebar

The Sidebar is a way to register notifications to elements on the page. 

The Sidebar exists in 3 versions: 

* aligned to the left
* aligned to the right
* bound to an element

The style can be changed in the configuration UI and via code. 

Any module can register notifcations to an element on a page by using the `.Sidebar` namespace of any JOBADInstance: 

```js
var my_notification = JOBADInstance.Sidebar.registerNotification(element, { //element is a jQuery element
    "class": "warning" //or "info" or "error",
    "text": "Hello", //or anything else
    "icon": "my-awesome-icon" //an awesome icon
    "click": function(){
        alert("I have been clicked"); 
    }
});
```

To remove a notification from the sidebar, use: 

```js
my_notification.removeNotification(my_notification);
```

The variable `my_notification` has the value of a jQuery element which represents the notification, hence anything can be done with it. 
For a more detailed description of the available options, see the [API Documentation](../api/JOBAD/JOBADInstance/sidebar.md). 