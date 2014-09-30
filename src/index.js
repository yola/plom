var extend = require('extend');


var Plom = function(options) {
  this.options = options || {};
  this.data = this.options.data || {};
}

Plom.extend = function(object) {
  var NewPlom = function(options) {
    this.options = options || {};
    this.data = this.options.data || {};

    if(this.initialize) {
      this.initialize(options);
    }
  };

  object = object || null;

  NewPlom.prototype = extend({}, this.prototype, object);
  NewPlom.extend = this.extend.bind(this);

  return NewPlom;
};

Plom.prototype.set = function(key, val) {
  if(typeof val !== 'undefined') {
    this.data[key] = val;
    return this;
  }

  this.data = key;
  return this;
};

Plom.prototype.get = function(key) {
  if(key) {
    return this.data[key];
  }

  return this.data;
};


module.exports = Plom;
