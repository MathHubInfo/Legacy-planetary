# Folding the DOM

With JOBAD, it is possible to fold an element. Folding means to hide the element and instead only show its title. 

Any module can fold elements of the page, however it is also possible for code outside of a module to fold the DOM. To do so, you can use the '.Folding.enable' and '.Folding.disable' methods: 

```js
var JOBADInstance; //is a JOBAD Instance. 
JOBADInstance.Folding.enable("p", { //enable folding on all <p> elements
    "preview": function(element){
        //provide some nice preview for the element
        return element.text().substring(0, 10)+"...";
    },
    "align": "right" //align the folding bar to the right    
}); 
//To disable it: 
JOBADInstance.Folding.disable("p");
```

You may also want to read: 

* [Config UI](config.md) - How can I configure JOBAD modules?