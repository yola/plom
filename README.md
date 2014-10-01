![Plom](./Plom.png)
# plom

A super simple model written with promises in mind.

## Usage

```javascript
var Plom = require('plom');

var Person = Plom.extend({
  saveToServer: function() {
    var data = this.get();
    return $.post({
      url: '/api/url',
      data: data
    })
  }
});

var person = new Person();

person.set('name', 'Rhino');
person.set('location', 'San Francisco');
person
  .saveToServer()
  .then(console.log)
  .done();
```
