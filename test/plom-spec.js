var Plom = require('../src/index');
var q = require('q');
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var wrap = require('promisehelpers').wrap;


chai.should();
chai.use(chaiAsPromised);

describe('Model A Plus', function() {
  it('is new-able', function() {
    var plom = new Plom();
    plom.should.be.an('object');
  });

  describe('extendability', function() {
    var PromProto;
    var plom;

    before(function() {
      PlomProto = Plom.extend({
        initialize: function(options) {
          this.a = options;
        }
      });

      plom = new PlomProto(1);
    });

    it('is extendable', function() {
      plom.initialize.should.be.a('function');
    });

    it('is extendable to an arbitrary level', function() {
      var DoubleProto = PlomProto.extend({
        aFunction: function() {}
      });

      var model = new DoubleProto();
      model.aFunction.should.be.a('function');
    });

    it('calls the initialize function', function() {
      plom.a.should.equal(1);
    });
  });

  describe('methods', function() {
    var plom;

    before(function() {
      var PlomProto = Plom.extend();
      plom = new PlomProto();
    });

    it('set and get data', function() {
      plom.set('key', 'val');
      plom.get('key').should.equal('val');
    });

    it('set and get key with a false value', function() {
      plom.set('key2', false);
      plom.get('key2').should.equal(false);
      plom.data.should.deep.equal({ key: 'val', key2: false });
    });

    it('set and get key with a true value', function() {
      plom.set('key3', true);
      plom.get('key3').should.equal(true);
      plom.data.should.deep.equal({ key: 'val', key2: false, key3: true });
    });

    it('set (replaces) and get data objects', function() {
      var newData = {
        key4: 'testing',
        key5: 'cool',
      };

      plom.set(newData);
      plom.get('key4').should.equal('testing');
      plom.get('key5').should.equal('cool');
      plom.data.should.deep.equal({ key4: 'testing', key5: 'cool' });
    });
  });

  describe('promise interfacing', function() {
    var plom;

    beforeEach(function() {
      var PlomProto = Plom.extend({
        saveToServer: function() {
          // Save takes the current state of the plom
          // stored in this.data and saves it to the
          // server
          var deferred = q.defer();

          deferred.resolve(this.data);

          return deferred.promise
            .then(wrap(this, 'data'))
        },

        getFromServer: function() {
          var deferred = q.defer();

          deferred.resolve({
            plom: 'data',
            is: 'data-y'
          });

          return deferred.promise
            .then(wrap(this, 'data'))
        }
      });

      plom = new PlomProto();
    });

    it('allows promise chaining for getting data', function(done) {
      plom.getFromServer()
        .invoke('get', 'is')
        .should.eventually.equal('data-y')
        .notify(done);
    });

    it('allows promise chaining for setting data', function(done) {
      plom.getFromServer()
        .invoke('set', 'key1', 'val1')
        .invoke('saveToServer')
        .invoke('get', 'key1')
        .should.eventually.equal('val1')
        .notify(done);
    });
  });
});
