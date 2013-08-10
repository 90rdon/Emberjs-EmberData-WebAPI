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
window.require.register("controllers/contactController", function(exports, require, module) {
  App.ContactController = Em.ObjectController.extend();
  
});
window.require.register("controllers/contactsController", function(exports, require, module) {
  App.ContactsController = Em.ArrayController.extend({
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
          column: 'phone'
        }), Em.Object.create({
          column: 'extension'
        }), Em.Object.create({
          column: 'type'
        }), Em.Object.create({
          column: 'score'
        }), Em.Object.create({
          column: 'source'
        }), Em.Object.create({
          column: 'status'
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
    },
    back: function() {
      this.set('isEditing', false);
      return this.transitionToRoute('debtors');
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

  require('controllers/columnItemController');

  require('controllers/contactController');

  require('controllers/contactsController');

  require('controllers/debtorController');

  require('controllers/debtorsController');

  require('models/contact');

  require('models/debtor');

  require('models/employment');

  require('models/historicalEvent');

  require('models/relatedPerson');

  require('routes/indexRoute');

  require('routes/debtorsRoute');

  require('routes/debtorRoute');

  require('templates/_well');

  require('templates/about');

  require('templates/application');

  require('templates/contact/_edit');

  require('templates/contact');

  require('templates/contacts');

  require('templates/debtor/_edit');

  require('templates/debtor');

  require('templates/debtors');

  require('templates/index');

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
    this.route('debtors');
    return this.resource('debtor', {
      path: '/debtor/:debtor_id'
    }, function() {
      return this.resource('contact', {
        path: '/contact/:contact_id'
      });
    });
  });
  
});
window.require.register("models/contact", function(exports, require, module) {
  App.Contact = DS.Model.extend({
    debtorId: DS.attr('number'),
    type: DS.attr('number'),
    country: DS.attr('number'),
    phone: DS.attr('string'),
    extension: DS.attr('string'),
    score: DS.attr('number'),
    status: DS.attr('number'),
    source: DS.attr('number'),
    consent: DS.attr('string'),
    debtor: DS.belongsTo('App.Debtor')
  });
  
});
window.require.register("models/debtor", function(exports, require, module) {
  App.Debtor = DS.Model.extend({
    type: DS.attr('string'),
    title: DS.attr('string'),
    lastName: DS.attr('string'),
    firstName: DS.attr('string'),
    middleName: DS.attr('string'),
    suffix: DS.attr('string'),
    dob: DS.attr('date'),
    ssn: DS.attr('string'),
    martialStatus: DS.attr('string'),
    email: DS.attr('string'),
    emailValidity: DS.attr('number'),
    optIn: DS.attr('string'),
    contact: DS.attr('string'),
    country: DS.attr('number'),
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
    contacts: DS.hasMany('App.Contact')
  });
  
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

  DS.WebAPIAdapter.map('App.Debtor', {
    contacts: {
      embedded: 'load'
    }
  });

  DS.WebAPIAdapter.configure('App.Debtor', {
    sideloadAs: 'debtor',
    primaryKey: 'id'
  });

  DS.WebAPIAdapter.configure('App.Contact', {
    sideloadAs: 'contact',
    primaryKey: 'id'
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
window.require.register("templates/contact", function(exports, require, module) {
  Ember.TEMPLATES["contact"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
  helpers = helpers || Ember.Handlebars.helpers; data = data || {};
    var buffer = '', hashTypes, hashContexts, escapeExpression=this.escapeExpression;


    data.buffer.push("<div class=\"span9\"><h2>Contact</h2>");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "phone", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(" ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "extension", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div>");
    return buffer;
    
  });module.exports = module.id;
});
window.require.register("templates/contact/_edit", function(exports, require, module) {
  Ember.TEMPLATES["contact/_edit"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
  helpers = helpers || Ember.Handlebars.helpers; data = data || {};
    var buffer = '', hashContexts, hashTypes, escapeExpression=this.escapeExpression;


    data.buffer.push("<div class=\"modal\"><div class=\"span6\"><label>Type</label>");
    hashContexts = {'valueBinding': depth0};
    hashTypes = {'valueBinding': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("type")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("<label>Country</label>");
    hashContexts = {'valueBinding': depth0};
    hashTypes = {'valueBinding': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("country")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("<label>Phone</label>");
    hashContexts = {'valueBinding': depth0};
    hashTypes = {'valueBinding': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("phone")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("<label>Extension</label>");
    hashContexts = {'valueBinding': depth0};
    hashTypes = {'valueBinding': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("extension")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("<label>Score</label>");
    hashContexts = {'valueBinding': depth0};
    hashTypes = {'valueBinding': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("score")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("<label>Status</label>");
    hashContexts = {'valueBinding': depth0};
    hashTypes = {'valueBinding': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("status")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("<label>Source</label>");
    hashContexts = {'valueBinding': depth0};
    hashTypes = {'valueBinding': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("source")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("<label>Consent</label>");
    hashContexts = {'valueBinding': depth0};
    hashTypes = {'valueBinding': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("consent")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><button ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "donePhoneEditing", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">Done</button></div>");
    return buffer;
    
  });module.exports = module.id;
});
window.require.register("templates/contacts", function(exports, require, module) {
  Ember.TEMPLATES["contacts"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
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
    stack2 = ((stack1 = helpers.linkTo),stack1 ? stack1.call(depth0, "contact", "", options) : helperMissing.call(depth0, "linkTo", "contact", "", options));
    if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
    data.buffer.push("</td><td>");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "extension", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</td><td>");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "type", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</td><td>");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "score", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</td><td>");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "source", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</td><td>");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "status", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</td></tr>");
    return buffer;
    }
  function program9(depth0,data) {
    
    var hashTypes, hashContexts;
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "phone", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    }

    data.buffer.push("<div class=\"row-fluid\"><div class=\"span9\"><table class=\"table\"><thead><tr>");
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
    data.buffer.push("</tbody></table></div></div>");
    return buffer;
    
  });module.exports = module.id;
});
window.require.register("templates/debtor", function(exports, require, module) {
  Ember.TEMPLATES["debtor"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
  helpers = helpers || Ember.Handlebars.helpers; data = data || {};
    var buffer = '', stack1, hashTypes, hashContexts, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    var stack1, hashTypes, hashContexts, options;
    hashTypes = {};
    hashContexts = {};
    options = {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
    data.buffer.push(escapeExpression(((stack1 = helpers.partial),stack1 ? stack1.call(depth0, "debtor/edit", options) : helperMissing.call(depth0, "partial", "debtor/edit", options))));
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

    data.buffer.push("<div class=\"container-fluid\"><div class=\"row-fluid\"><button ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "back", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">Back</button>");
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
    hashTypes = {};
    hashContexts = {};
    options = {hash:{},contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
    data.buffer.push(escapeExpression(((stack1 = helpers.render),stack1 ? stack1.call(depth0, "contacts", "contacts", options) : helperMissing.call(depth0, "render", "contacts", "contacts", options))));
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "outlet", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div>");
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
    data.buffer.push("</div><button ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "doneEditing", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">Done</button></div>");
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
    data.buffer.push("</tbody></table></div></div></div>");
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
