(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.brunch = true;
})();

window.require.register("app", function(exports, require, module) {
  module.exports = Em.Application.create({
    LOG_TRANSITIONS: true
  });
  
});
window.require.register("controllers/columnItemController", function(exports, require, module) {
  App.ColumnItemController = Em.ObjectController.extend({
    sortColumn: Em.computed.alias('parentController.sortedColumn'),
    sortAscending: Em.computed.alias('parentController.sortAscending'),
    sortDescending: Em.computed.not('sortAscending'),
    isSorted: (function() {
      return this.get('sortColumn') === this.get('column');
    }).property('sortColumn', 'column'),
    sortedAsc: Em.computed.and('sortAscending', 'isSorted'),
    sortedDesc: Em.computed.and('sortDescending', 'isSorted')
  });
  
});
window.require.register("controllers/debtorController", function(exports, require, module) {
  App.DebtorController = Em.ObjectController.extend({
    fullName: (function() {
      var first, last, middle;
      first = this.get('firstName') || '';
      middle = this.get('middleName') || '';
      last = this.get('lastName') || '';
      return first + ' ' + middle + ' ' + last;
    }).property('firstName', 'lastName', 'middleName'),
    isEditing: false,
    emailv: false,
    doneEditing: function() {
      this.set('isEditing', false);
      return this.get('store').commit();
    },
    edit: function() {
      return this.set('isEditing', true);
    }
  });
  
});
window.require.register("controllers/debtorsController", function(exports, require, module) {
  App.DebtorsController = Em.ArrayController.extend({
    sortedColumn: (function() {
      var properties;
      properties = this.get('sortProperties');
      if (!properties) {
        return 'undefined';
      }
      return properties.get('firstObject');
    }).property('sortProperties.[]'),
    columns: (function() {
      return [
        Em.Object.create({
          column: 'id'
        }), Em.Object.create({
          column: 'firstName'
        }), Em.Object.create({
          column: 'middleName'
        }), Em.Object.create({
          column: 'lastName'
        }), Em.Object.create({
          column: 'address1'
        }), Em.Object.create({
          column: 'address2'
        }), Em.Object.create({
          column: 'city'
        }), Em.Object.create({
          column: 'state'
        }), Em.Object.create({
          column: 'zip'
        })
      ];
    }).property(),
    toggleSort: function(column) {
      if (this.get('sortedColumn') === column) {
        return this.toggleProperty('sortAscending');
      } else {
        this.set('sortProperties', [column]);
        return this.set('sortAscending', true);
      }
    }
  });
  
});
window.require.register("helpers/handlebarsHelpers", function(exports, require, module) {
  Em.Handlebars.helper('titleize', function(value, options) {
    var escaped, title;
    title = value.replace(/^([a-z])/, function(match) {
      return match.toUpperCase();
    });
    escaped = Handlebars.Utils.escapeExpression(title);
    return new Handlebars.SafeString(escaped);
  });

  Em.Handlebars.helper('humanize', function(value, options) {
    var escaped;
    value = value.replace(/([A-Z]+|[0-9]+)/g, " $1").replace(/^./, function(str) {
      return str.toUpperCase();
    });
    escaped = Handlebars.Utils.escapeExpression(value);
    return new Handlebars.SafeString(escaped);
  });

  Em.Handlebars.helper('date', function(value, options) {
    var escaped;
    escaped = Handlebars.Utils.escapeExpression(value.toLocaleDateString());
    return new Handlebars.SafeString(escaped);
  });

  Em.Handlebars.helper('currency', function(value, options) {
    var escaped;
    escaped = Handlebars.Utils.escapeExpression('$' + value.toFixed(2));
    return new Handlebars.SafeString(escaped);
  });
  
});
window.require.register("helpers/radioButton", function(exports, require, module) {
  (function(exports) {
    return Em.RadioButton = Em.View.extend({
      tagName: 'input',
      type: 'radio',
      attributeBindings: ['name', 'type', 'value', 'checked:checked:'],
      click: function() {
        return this.set('selection', this.$().val());
      },
      checked: (function() {
        return this.get('value') === this.get('selection');
      }).property()
    });
  })({});
  
});
window.require.register("initialize", function(exports, require, module) {
  window.App = require('app');

  require('helpers/handlebarsHelpers');

  require('helpers/radioButton');

  require('controllers/debtorsController');

  require('controllers/debtorController');

  require('controllers/columnItemController');

  require('models/debtor');

  require('models/contact');

  require('models/relatedPerson');

  require('models/employment');

  require('models/historicalEvent');

  require('routes/indexRoute');

  require('routes/debtorsRoute');

  require('routes/debtorRoute');

  require('templates/application');

  require('templates/index');

  require('templates/about');

  require('templates/_well');

  require('templates/debtors');

  require('templates/debtor');

  require('templates/debtor/_edit');

  require('store/webapi/serializer');

  require('store/webapi/adapter');

  require('store/RESTfulAdapter');

  App.Router.map(function() {
    this.route('about', {
      path: '/about'
    });
    this.route('index', {
      path: '/'
    });
    return this.resource('debtors', function() {
      return this.resource('debtor', {
        path: ':debtor_id'
      });
    });
  });
  
});
window.require.register("models/contact", function(exports, require, module) {
  App.Contact = DS.Model.extend({
    type: DS.attr('string'),
    country: DS.attr('string'),
    phone: DS.attr('string'),
    phoneExt: DS.attr('string'),
    score: DS.attr('number'),
    consentToCall: DS.attr('boolean'),
    debtor: DS.belongsTo('App.Debtor')
  });
  
});
window.require.register("models/debtor", function(exports, require, module) {
  App.Debtor = DS.Model.extend({
    type: DS.attr('boolean'),
    title: DS.attr('string'),
    lastName: DS.attr('string'),
    firstName: DS.attr('string'),
    middleName: DS.attr('string'),
    suffix: DS.attr('string'),
    dob: DS.attr('date'),
    ssn: DS.attr('string'),
    martialStatus: DS.attr('string'),
    email: DS.attr('string'),
    emailValidity: DS.attr('boolean'),
    optIn: DS.attr('boolean'),
    commContact: DS.attr('string'),
    country: DS.attr('string'),
    address1: DS.attr('string'),
    address2: DS.attr('string'),
    address3: DS.attr('string'),
    city: DS.attr('string'),
    state: DS.attr('string'),
    zip: DS.attr('string'),
    county: DS.attr('string'),
    dlIssuer: DS.attr('string'),
    dlNumber: DS.attr('string'),
    passport: DS.attr('string'),
    pin: DS.attr('string'),
    contact: DS.hasMany('App.Contact'),
    relatedPerson: DS.hasMany('App.RelatedPerson'),
    employment: DS.hasMany('App.Employment')
  });
  
});
window.require.register("models/debtorData", function(exports, require, module) {
  App.Debtor.FIXTURES = [
    {
      "id": 4103752,
      "type": "N",
      "title": null,
      "firstName": "Joseph",
      "middleName": "",
      "lastName": "Best",
      "suffix": null,
      "dob": null,
      "ssn": null,
      "maritalStatus": 0,
      "email": null,
      "emailValidity": null,
      "optIn": null,
      "commContact": null,
      "country": 231,
      "address1": "4420 Green Wood",
      "address2": null,
      "address3": null,
      "city": "Shreveport",
      "state": "LA",
      "zip": "71109",
      "county": null,
      "dlIssuer": null,
      "dlNumber": null,
      "passport": null,
      "pin": "0263"
    }, {
      "id": 4103753,
      "type": "N",
      "title": null,
      "firstName": "Jennifer",
      "middleName": null,
      "lastName": "Scneeweis",
      "suffix": null,
      "dob": null,
      "ssn": null,
      "maritalStatus": 0,
      "email": null,
      "emailValidity": null,
      "optIn": null,
      "commContact": null,
      "country": 231,
      "address1": "1815 N 45Th St Ste 218",
      "address2": null,
      "address3": null,
      "city": "Seattle",
      "state": "WA",
      "zip": "98103",
      "county": null,
      "dlIssuer": null,
      "dlNumber": null,
      "passport": null,
      "pin": "6685"
    }
  ];
  
});
window.require.register("models/employment", function(exports, require, module) {
  App.Employment = DS.Model.extend({
    relationship: DS.attr('string'),
    name: DS.attr('string'),
    monthlyNetIncome: DS.attr('number'),
    position: DS.attr('string'),
    hireDate: DS.attr('date'),
    phone: DS.attr('string'),
    website: DS.attr('string'),
    status: DS.attr('string'),
    source: DS.attr('string'),
    jobTitle: DS.attr('string'),
    terminationDate: DS.attr('date'),
    yearlyIncome: DS.attr('number'),
    monthlyGrossIncome: DS.attr('number'),
    country: DS.attr('string'),
    address1: DS.attr('string'),
    address2: DS.attr('string'),
    address3: DS.attr('string'),
    city: DS.attr('string'),
    state: DS.attr('string'),
    zip: DS.attr('string'),
    county: DS.attr('string'),
    debtor: DS.belongsTo('App.Debtor')
  });
  
});
window.require.register("models/historicalEvent", function(exports, require, module) {
  App.HistoricalEvent = DS.Model.extend({
    time: DS.attr('date'),
    actionCode: DS.attr('string'),
    resultCode: DS.attr('string'),
    user: DS.attr('string'),
    message: DS.attr('string')
  });
  
});
window.require.register("models/oldData", function(exports, require, module) {
  App.Debtor.FIXTURES = [
    {
      id: 123456,
      type: 'consumer',
      title: 'Mr.',
      lastName: 'Obama',
      firstName: 'Barack',
      dob: '8/4/1961',
      ssn: '123-45-6789',
      martialStatus: 'M',
      email: 'barackobama@sample.com',
      emailValidity: true,
      optIn: true,
      country: 'United States',
      address1: '1600 Pennsylvania Ave NW',
      city: 'Washington',
      state: 'DC',
      zip: '20500'
    }, {
      id: 234567,
      type: 'consumer',
      title: 'Mrs.',
      lastName: 'Deen',
      firstName: 'Paula',
      dob: '4/13/1950',
      ssn: '321-45-9876',
      martialStatus: 'M',
      email: 'paula@sample.com',
      emailValidity: true,
      optIn: true,
      country: 'United States',
      address1: '2391 Downing Ave',
      city: 'Thunderbolt',
      state: 'GA',
      zip: '31404'
    }, {
      id: 456789,
      type: 'consumer',
      title: 'Mr.',
      lastName: 'Bush',
      middleName: 'W.',
      firstName: 'George',
      dob: '7/6/1946',
      ssn: '555-44-6666',
      martialStatus: 'M',
      email: 'gwb@sample.com',
      emailValidity: false,
      optIn: true,
      country: 'United States',
      address1: 'P.O. Box 259000',
      city: 'Dallas',
      state: 'TX',
      zip: '75225'
    }, {
      id: 567890,
      type: 'consumer',
      title: 'Mr.',
      lastName: 'Bush',
      middleName: 'H.W.',
      firstName: 'George',
      dob: '6/12/1924',
      ssn: '727-12-3434',
      martialStatus: 'M',
      email: 'georgesrb@sample.com',
      emailValidity: false,
      optIn: true,
      country: 'United States',
      address1: '10000 Memorial Dr.',
      address2: 'Suite 900',
      city: 'Houston',
      state: 'TX',
      zip: '77024'
    }, {
      id: 345678,
      type: 'consumer',
      title: 'Mr.',
      lastName: 'Clinton',
      firstName: 'Bill',
      dob: '8/16/1946',
      ssn: '456-77-0000',
      martialStatus: 'M',
      email: 'billclinton@sample.com',
      emailValidity: true,
      optIn: true,
      country: 'United States',
      address1: '55 West 125th Street',
      city: 'New York',
      state: 'NY',
      zip: '10027'
    }
  ];
  
});
window.require.register("models/relatedPerson", function(exports, require, module) {
  App.RelatedPerson = DS.Model.extend({
    relationship: DS.attr('string'),
    title: DS.attr('string'),
    last: DS.attr('string'),
    first: DS.attr('string'),
    middle: DS.attr('string'),
    suffix: DS.attr('string'),
    dob: DS.attr('date'),
    SSN: DS.attr('string'),
    startDate: DS.attr('date'),
    claimNumber: DS.attr('string'),
    source: DS.attr('string'),
    country: DS.attr('string'),
    address1: DS.attr('string'),
    address2: DS.attr('string'),
    address3: DS.attr('string'),
    city: DS.attr('string'),
    state: DS.attr('string'),
    zip: DS.attr('string'),
    county: DS.attr('string'),
    debtor: DS.belongsTo('App.Debtor')
  });
  
});
window.require.register("routes/debtorRoute", function(exports, require, module) {
  App.DebtorRoute = Em.Route.extend();
  
});
window.require.register("routes/debtorsRoute", function(exports, require, module) {
  App.DebtorsRoute = Em.Route.extend({
    model: function() {
      return App.Debtor.find();
    }
  });
  
});
window.require.register("routes/indexRoute", function(exports, require, module) {
  App.IndexRoute = Em.Route.extend({
    redirect: function() {
      return this.transitionTo('debtors');
    }
  });
  
});
window.require.register("store/RESTfulAdapter", function(exports, require, module) {
  App.Store = DS.Store.extend({
    adapter: DS.WebAPIAdapter.extend({
      url: 'http://10.211.55.4',
      namespace: 'hunter-warfield/api',
      bulkCommit: false,
      antiForgeryTokenSelector: '#antiForgeryToken',
      pluralize: function(string) {
        return string + 's';
      }
    })
  });
  
});
window.require.register("store/fixtureAdapter", function(exports, require, module) {
  App.Store = DS.Store.extend({
    adapter: DS.FixtureAdapter.create()
  });

  DS.RESTAdapter.map('App.Debtor', {
    address: {
      embedded: 'always'
    }
  });
  
});
window.require.register("store/webapi/adapter", function(exports, require, module) {
  var get, rejectionHandler;

  rejectionHandler = function(reason) {
    Em.Logger.error(reason, reason.message);
    throw reason;
  };

  get = Em.get;

  DS.WebAPIAdapter = DS.RESTAdapter.extend({
    serializer: DS.WebAPISerializer,
    antiForgeryTokenSelector: null,
    shouldSave: function(record) {
      return true;
    },
    dirtyRecordsForBelongsToChange: null,
    createRecord: function(store, type, record) {
      var adapter, config, data, primaryKey, root;
      root = this.rootForType(type);
      adapter = this;
      data = this.serialize(record, {
        includeId: false
      });
      config = get(this, 'serializer').configurationForType(type);
      primaryKey = config && config.primaryKey;
      if (primaryKey) {
        delete data[primaryKey];
      }
      return this.ajax(this.buildURL(root), 'POST', {
        data: data
      }).then(function(json) {
        return adapter.didCreateRecord(store, type, record, json);
      }, function(xhr) {
        adapter.didError(store, type, record, xhr);
        throw xhr;
      }).then(null, rejectionHandler);
    },
    updateRecord: function(store, type, record) {
      var adapter, data, id, root;
      id = get(record, 'id');
      adapter = this;
      root = this.rootForType(type);
      data = this.serialize(record, {
        includeId: true
      });
      return this.ajax(this.buildURL(root, id), 'PUT', {
        data: data
      }, 'text').then(function(json) {
        adapter.didSaveRecord(store, type, record, json);
        return record.set('error', '');
      }, function(xhr) {
        adapter.didSaveRecord(store, type, record);
        return record.set('error', 'Server update failed');
      }).then(null, rejectionHandler);
    },
    deleteRecord: function(store, type, record) {
      var adapter, config, id, primaryKey, root;
      id = get(record, 'id');
      adapter = this;
      root = this.rootForType(type);
      config = get(this, 'serializer').configurationForType(type);
      primaryKey = config && config.primaryKey;
      return this.ajax(this.buildURL(root, id), 'DELETE').then(function(json) {
        if (json[primaryKey] === id) {
          return adapter.didSaveRecord(store, type, record);
        } else {
          return adapter.didSaveRecord(store, type, record, json);
        }
      }, function(xhr) {
        adapter.didError(store, type, record, xhr);
        throw xhr;
      }).then(null, rejectionHandler);
    },
    ajax: function(url, type, hash, dataType) {
      var adapter;
      adapter = this;
      return new Em.RSVP.Promise(function(resolve, reject) {
        var antiForgeryToken, antiForgeryTokenElemSelector;
        hash = hash || {};
        hash.url = url;
        hash.type = type;
        hash.dataType = 'json';
        hash.context = adapter;
        if (hash.data && type !== 'GET') {
          hash.contentType = 'application/json; charset=utf-8';
          hash.data = JSON.stringify(hash.data);
        }
        antiForgeryTokenElemSelector = get(adapter, 'antiForgeryTokenSelector');
        if (antiForgeryTokenElemSelector) {
          antiForgeryToken = $(antiForgeryTokenElemSelector).val();
          if (antiForgeryToken) {
            hash.headers = {
              RequestVerificationToken: antiForgeryToken
            };
          }
        }
        hash.success = function(json) {
          return Em.run(null, resolve, json);
        };
        hash.error = function(jqXHR, textStatus, errorThrown) {
          return Em.run(null, reject, errorThrown);
        };
        return jQuery.ajax(hash);
      });
    }
  });
  
});
window.require.register("store/webapi/serializer", function(exports, require, module) {
  var get;

  get = Em.get;

  DS.WebAPISerializer = DS.JSONSerializer.extend({
    keyForAttributeName: function(type, name) {
      return name;
    },
    extractMany: function(loader, json, type, records) {
      var i, objects, reference, references, root;
      root = this.rootForType(type);
      root = this.pluralize(root);
      objects = void 0;
      if (json instanceof Array) {
        objects = json;
      } else {
        this.sideload(loader, type, json, root);
        this.extractMeta(loader, type, json);
        objects = json[root];
      }
      if (objects) {
        references = [];
        if (records) {
          records = records.toArray();
        }
        i = 0;
        while (i < objects.length) {
          if (records) {
            loader.updateId(records[i], objects[i]);
          }
          reference = this.extractRecordRepresentation(loader, type, objects[i]);
          references.push(reference);
          i++;
        }
        return loader.populateArray(references);
      }
    },
    extract: function(loader, json, type, record) {
      if (record) {
        loader.updateId(record, json);
      }
      return this.extractRecordRepresentation(loader, type, json);
    },
    rootForType: function(type) {
      var name, parts, typeString;
      typeString = type.toString();
      Em.assert('Your model must not be anonymous. It was ' + type, typeString.charAt(0) !== '(');
      parts = typeString.split('.');
      name = parts[parts.length - 1];
      return name.toLowerCase();
    }
  });
  
});
window.require.register("templates/_well", function(exports, require, module) {
  Ember.TEMPLATES["_well"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
  helpers = helpers || Ember.Handlebars.helpers; data = data || {};
    


    data.buffer.push("<div class=\"well\"><h3>Welcome to the 'Debtor to CRM Project'</h3><p>This is a partial.</p><p>Find me in <code>app/templates/_well.emblem</code></p></div>");
    
  });module.exports = module.id;
});
window.require.register("templates/about", function(exports, require, module) {
  Ember.TEMPLATES["about"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
  helpers = helpers || Ember.Handlebars.helpers; data = data || {};
    var buffer = '', stack1, hashTypes, hashContexts, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


    data.buffer.push("<h2>About</h2><p>Find me in <code>templates/about.emblem</code></p>");
    hashTypes = {};
    hashContexts = {};
    options = {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
    data.buffer.push(escapeExpression(((stack1 = helpers.partial),stack1 ? stack1.call(depth0, "well", options) : helperMissing.call(depth0, "partial", "well", options))));
    return buffer;
    
  });module.exports = module.id;
});
window.require.register("templates/application", function(exports, require, module) {
  Ember.TEMPLATES["application"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
  helpers = helpers || Ember.Handlebars.helpers; data = data || {};
    var buffer = '', stack1, stack2, hashContexts, hashTypes, options, self=this, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    
    data.buffer.push("Hunter Warfield");
    }

  function program3(depth0,data) {
    
    var buffer = '';
    return buffer;
    }

    data.buffer.push("<div class=\"container-fluid\"><div class=\"navbar\"><div class=\"navbar-inner\">");
    hashContexts = {'class': depth0};
    hashTypes = {'class': "STRING"};
    options = {hash:{
      'class': ("brand")
    },inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
    stack2 = ((stack1 = helpers.linkTo),stack1 ? stack1.call(depth0, "index", options) : helperMissing.call(depth0, "linkTo", "index", options));
    if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
    data.buffer.push("<ul class=\"nav\"></ul></div></div><div id=\"page\">");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "outlet", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div></div>");
    return buffer;
    
  });module.exports = module.id;
});
window.require.register("templates/debtor", function(exports, require, module) {
  Ember.TEMPLATES["debtor"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
  helpers = helpers || Ember.Handlebars.helpers; data = data || {};
    var buffer = '', stack1, hashTypes, hashContexts, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    var buffer = '', stack1, hashTypes, hashContexts, options;
    hashTypes = {};
    hashContexts = {};
    options = {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
    data.buffer.push(escapeExpression(((stack1 = helpers.partial),stack1 ? stack1.call(depth0, "debtor/edit", options) : helperMissing.call(depth0, "partial", "debtor/edit", options))));
    data.buffer.push("<button ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "doneEditing", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">Done</button>");
    return buffer;
    }

  function program3(depth0,data) {
    
    var buffer = '', hashTypes, hashContexts;
    data.buffer.push("<button ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "edit", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">Edit</button>");
    return buffer;
    }

    data.buffer.push("<div class=\"span6\">");
    hashTypes = {};
    hashContexts = {};
    stack1 = helpers['if'].call(depth0, "isEditing", {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("<h2>");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "title", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(" ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "fullName", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</h2><h4>");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "ssn", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</h4><hr /><div class=\"intro\"><h5>Address</h5>");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "address1", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("<br />");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "city", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(", ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "state", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(" ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "zip", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("<h5>Email</h5>");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "email", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div></div>");
    return buffer;
    
  });module.exports = module.id;
});
window.require.register("templates/debtor/_edit", function(exports, require, module) {
  Ember.TEMPLATES["debtor/_edit"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
  helpers = helpers || Ember.Handlebars.helpers; data = data || {};
    var buffer = '', stack1, hashContexts, hashTypes, escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    
    data.buffer.push("Valid");
    }

  function program3(depth0,data) {
    
    var buffer = '';
    return buffer;
    }

  function program5(depth0,data) {
    
    
    data.buffer.push("Invalid");
    }

    data.buffer.push("<div class=\"modal\"><div class=\"span6\"><label>Type</label>");
    hashContexts = {'valueBinding': depth0};
    hashTypes = {'valueBinding': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("type")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("<label>Title</label>");
    hashContexts = {'valueBinding': depth0};
    hashTypes = {'valueBinding': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("title")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("<label>Last Name</label>");
    hashContexts = {'valueBinding': depth0};
    hashTypes = {'valueBinding': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("lastName")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("<label>First Name</label>");
    hashContexts = {'valueBinding': depth0};
    hashTypes = {'valueBinding': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("firstName")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("<label>Middle Name</label>");
    hashContexts = {'valueBinding': depth0};
    hashTypes = {'valueBinding': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("middleName")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("<label>Suffix</label>");
    hashContexts = {'valueBinding': depth0};
    hashTypes = {'valueBinding': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("suffix")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("<label>Date of Birth</label>");
    hashContexts = {'valueBinding': depth0};
    hashTypes = {'valueBinding': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("dob")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("<label>SSN</label>");
    hashContexts = {'valueBinding': depth0};
    hashTypes = {'valueBinding': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("ssn")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("<label>Marital Status</label>");
    hashContexts = {'valueBinding': depth0};
    hashTypes = {'valueBinding': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("maritalStatus")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><div class=\"span6\"><label>Email</label>");
    hashContexts = {'valueBinding': depth0};
    hashTypes = {'valueBinding': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("email")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("<label>Email Validity</label><div class=\"span\">");
    hashContexts = {'name': depth0,'selectionBinding': depth0,'value': depth0};
    hashTypes = {'name': "STRING",'selectionBinding': "STRING",'value': "STRING"};
    stack1 = helpers.view.call(depth0, "Ember.RadioButton", {hash:{
      'name': ("emailvalidity"),
      'selectionBinding': ("emailValidity"),
      'value': ("true")
    },inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    hashContexts = {'name': depth0,'selectionBinding': depth0,'value': depth0};
    hashTypes = {'name': "STRING",'selectionBinding': "STRING",'value': "STRING"};
    stack1 = helpers.view.call(depth0, "Ember.RadioButton", {hash:{
      'name': ("emailvalidity"),
      'selectionBinding': ("emailValidity"),
      'value': ("false")
    },inverse:self.program(3, program3, data),fn:self.program(5, program5, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</div><label>Address1</label>");
    hashContexts = {'valueBinding': depth0};
    hashTypes = {'valueBinding': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("address1")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("<label>Address2</label>");
    hashContexts = {'valueBinding': depth0};
    hashTypes = {'valueBinding': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("address2")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("<label>Address3</label>");
    hashContexts = {'valueBinding': depth0};
    hashTypes = {'valueBinding': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("address3")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("<label>City</label>");
    hashContexts = {'valueBinding': depth0};
    hashTypes = {'valueBinding': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("city")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("<label>State</label>");
    hashContexts = {'valueBinding': depth0};
    hashTypes = {'valueBinding': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("state")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("<label>Zip Code</label>");
    hashContexts = {'valueBinding': depth0};
    hashTypes = {'valueBinding': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("zip")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div></div>");
    return buffer;
    
  });module.exports = module.id;
});
window.require.register("templates/debtors", function(exports, require, module) {
  Ember.TEMPLATES["debtors"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
  helpers = helpers || Ember.Handlebars.helpers; data = data || {};
    var buffer = '', stack1, hashContexts, hashTypes, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

  function program1(depth0,data) {
    
    var buffer = '', stack1, stack2, hashTypes, hashContexts, options;
    data.buffer.push("<th ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "toggleSort", "column", {hash:{},contexts:[depth0,depth0],types:["ID","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">");
    hashTypes = {};
    hashContexts = {};
    options = {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
    data.buffer.push(escapeExpression(((stack1 = helpers.humanize),stack1 ? stack1.call(depth0, "column", options) : helperMissing.call(depth0, "humanize", "column", options))));
    hashTypes = {};
    hashContexts = {};
    stack2 = helpers['if'].call(depth0, "sortedAsc", {hash:{},inverse:self.program(4, program4, data),fn:self.program(2, program2, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
    if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
    hashTypes = {};
    hashContexts = {};
    stack2 = helpers['if'].call(depth0, "sortedDesc", {hash:{},inverse:self.program(4, program4, data),fn:self.program(6, program6, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
    if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
    data.buffer.push("</th>");
    return buffer;
    }
  function program2(depth0,data) {
    
    
    data.buffer.push("<i class=\"icon-chevron-up\"></i>");
    }

  function program4(depth0,data) {
    
    var buffer = '';
    return buffer;
    }

  function program6(depth0,data) {
    
    
    data.buffer.push("<i class=\"icon-chevron-down\"></i>");
    }

  function program8(depth0,data) {
    
    var buffer = '', stack1, stack2, hashTypes, hashContexts, options;
    data.buffer.push("<tr><td>");
    hashTypes = {};
    hashContexts = {};
    options = {hash:{},inverse:self.program(4, program4, data),fn:self.program(9, program9, data),contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
    stack2 = ((stack1 = helpers.linkTo),stack1 ? stack1.call(depth0, "debtor", "", options) : helperMissing.call(depth0, "linkTo", "debtor", "", options));
    if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
    data.buffer.push("</td><td>");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "firstName", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</td><td>");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "middleName", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</td><td>");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "lastName", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</td><td>");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "address1", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</td><td>");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "address2", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</td><td>");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "city", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</td><td>");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "state", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</td><td>");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "zip", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</td></tr>");
    return buffer;
    }
  function program9(depth0,data) {
    
    var hashTypes, hashContexts;
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "id", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    }

    data.buffer.push("<div class=\"container-fluid\"><div class=\"row-fluid\"><div class=\"span9\"><table class=\"table\"><thead><tr>");
    hashContexts = {'itemController': depth0};
    hashTypes = {'itemController': "STRING"};
    stack1 = helpers.each.call(depth0, "columns", {hash:{
      'itemController': ("columnItem")
    },inverse:self.program(4, program4, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</tr></thead><tbody>");
    hashTypes = {};
    hashContexts = {};
    stack1 = helpers.each.call(depth0, "controller", {hash:{},inverse:self.program(4, program4, data),fn:self.program(8, program8, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</tbody></table></div><div class=\"span9\">");
    hashContexts = {'unescaped': depth0};
    hashTypes = {'unescaped': "STRING"};
    stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{
      'unescaped': ("true")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</div></div></div>");
    return buffer;
    
  });module.exports = module.id;
});
window.require.register("templates/index", function(exports, require, module) {
  Ember.TEMPLATES["index"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
  helpers = helpers || Ember.Handlebars.helpers; data = data || {};
    


    data.buffer.push("<h1>Debtors</h1>");
    
  });module.exports = module.id;
});
