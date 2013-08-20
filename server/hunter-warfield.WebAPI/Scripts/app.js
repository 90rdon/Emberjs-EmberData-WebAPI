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
window.require.register("controllers/contactController", function(exports, require, module) {
  App.ContactController = App.EditObjectController.extend({
    needs: ['debtor', 'countries', 'phoneTypes', 'phoneStatuses', 'phoneSources', 'yesNo'],
    setSelections: function() {
      this.get('controllers.countries').setSelectedById(this.get('country'));
      this.get('controllers.phoneTypes').setSelectedById(this.get('type'));
      this.get('controllers.phoneStatuses').setSelectedById(this.get('status'));
      this.get('controllers.phoneSources').setSelectedById(this.get('source'));
      return this.get('controllers.yesNo').setSelectedById(this.get('consent'));
    },
    getSelections: function() {
      this.set('country', this.get('controllers.countries').getSelectedId());
      this.set('type', this.get('controllers.phoneTypes').getSelectedId());
      this.set('status', this.get('controllers.phoneStatuses').getSelectedId());
      this.set('source', this.get('controllers.phoneSources').getSelectedId());
      return this.set('consent', this.get('controllers.yesNo').getSelectedId());
    }
  });
  
});
window.require.register("controllers/contactsController", function(exports, require, module) {
  App.ContactsController = App.ColumnSorterController.extend({
    needs: ['debtor', 'contact', 'phoneTypes'],
    typeLabel: (function() {
      return this.set('type', this.get('controllers.phoneTypes').getSelectedId());
    }).property('@content.@each.type'),
    columns: (function() {
      return [
        Em.Object.create({
          column: 'phone'
        }), Em.Object.create({
          column: 'extension'
        }), Em.Object.create({
          column: 'type'
        }), Em.Object.create({
          column: 'status'
        })
      ];
    }).property(),
    create: function() {
      var transaction;
      transaction = this.get('store').transaction();
      return this.transitionToRoute('contact', transaction.createRecord(App.Contact, {
        'debtor': this.get('controllers.debtor').content,
        'debtorId': this.get('controllers.debtor').content.id
      }));
    },
    "delete": function(item) {
      item.deleteRecord();
      return this.get('store').commit();
    }
  });
  
});
window.require.register("controllers/debtorController", function(exports, require, module) {
  App.DebtorController = App.EditObjectController.extend({
    needs: ['contacts', 'employments', 'persons', 'notes', 'countries', 'consumerFlags', 'titles', 'suffixes', 'validInvalid', 'yesNo'],
    name: (function() {
      var first, last, middle;
      first = this.get('firstName') || '';
      middle = this.get('middleName') || '';
      last = this.get('lastName') || '';
      return first + ' ' + middle + ' ' + last;
    }).property('firstName', 'lastName', 'middleName'),
    setSelections: function() {
      this.get('controllers.consumerFlags').setSelectedById(this.get('type'));
      this.get('controllers.titles').setSelectedById(this.get('title'));
      this.get('controllers.suffixes').setSelectedById(this.get('suffix'));
      this.get('controllers.validInvalid').setSelectedById(this.get('emailValidity'));
      this.get('controllers.yesNo').setSelectedById(this.get('optIn'));
      return this.get('controllers.countries').setSelectedById(this.get('country'));
    },
    getSelections: function() {
      this.set('type', this.get('controllers.consumerFlags').getSelectedId());
      this.set('title', this.get('controllers.titles').getSelectedId());
      this.set('suffix', this.get('controllers.suffixes').getSelectedId());
      this.set('emailValidity', this.get('controllers.validInvalid').getSelectedId());
      this.set('optIn', this.get('controllers.yesNo').getSelectedId());
      return this.set('country', this.get('controllers.countries').getSelectedId());
    },
    back: function() {
      this.set('isEditing', false);
      return this.transitionToRoute('index');
    }
  });
  
});
window.require.register("controllers/debtorsController", function(exports, require, module) {
  App.DebtorsController = App.ColumnSorterController.extend({
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
    loaded: (function() {
      return this.get('filtered');
    }).observes('@content.isLoaded'),
    filtering: (function() {
      return this.get('filtered');
    }).observes('search'),
    filtered: (function() {
      var regexp;
      regexp = new RegExp(this.get('search'));
      return this.get('content').filter(function(item) {
        return regexp.test(item.get('id'));
      });
    }).property('search', 'content.@each.id')
  });
  
});
window.require.register("controllers/employmentController", function(exports, require, module) {
  App.EmploymentController = App.EditObjectController.extend({
    needs: ['debtor', 'associations', 'employmentStatuses', 'countries'],
    setSelections: function() {
      this.get('controllers.associations').setSelectedById(this.get('association'));
      this.get('controllers.countries').setSelectedById(this.get('country'));
      return this.get('controllers.employmentStatuses').setSelectedById(this.get('status'));
    },
    getSelections: function() {
      this.set('country', this.get('controllers.countries').getSelectedId());
      this.set('status', this.get('controllers.employmentStatuses').getSelectedId());
      return this.set('association', this.get('controllers.associations').getSelectedId());
    }
  });
  
});
window.require.register("controllers/employmentsController", function(exports, require, module) {
  App.EmploymentsController = App.ColumnSorterController.extend({
    needs: ['debtor', 'employment'],
    columns: (function() {
      return [
        Em.Object.create({
          column: 'name'
        }), Em.Object.create({
          column: 'status'
        }), Em.Object.create({
          column: 'source'
        }), Em.Object.create({
          column: 'phone'
        }), Em.Object.create({
          column: 'title'
        }), Em.Object.create({
          column: 'hireDate'
        })
      ];
    }).property(),
    create: function() {
      var transaction;
      transaction = this.get('store').transaction();
      return this.transitionToRoute('employment', transaction.createRecord(App.Employment, {
        'debtor': this.get('controllers.debtor').content,
        'debtorId': this.get('controllers.debtor').content.id
      }));
    },
    "delete": function(item) {
      item.deleteRecord();
      return this.get('store').commit();
    }
  });
  
});
window.require.register("controllers/helpers/columnItemController", function(exports, require, module) {
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
window.require.register("controllers/helpers/columnSorterController", function(exports, require, module) {
  App.ColumnSorterController = Em.ArrayController.extend({
    columns: [],
    sortedColumn: (function() {
      var properties;
      properties = this.get('sortProperties');
      if (!properties) {
        return 'undefined';
      }
      return properties.get('firstObject');
    }).property('sortProperties.[]'),
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
window.require.register("controllers/helpers/editObjectController", function(exports, require, module) {
  App.EditObjectController = Em.ObjectController.extend({
    isEditing: false,
    loaded: (function() {
      return this.setSelections();
    }).observes('@content.isLoaded'),
    dirtied: (function() {
      if ((this.get('transaction') === null || this.get('transaction') === void 0) && this.get('isDirty') === true) {
        return this.set('transaction', this.get('store').transaction());
      }
    }).observes('isDirty'),
    edit: function() {
      this.set('isEditing', true);
      return this.setSelection;
    },
    doneEditing: function() {
      this.getSelections();
      if (this.get('transaction') !== null || this.get('transaction') === void 0) {
        this.get('transaction').commit();
      }
      this.set('isEditing', false);
      return this.transitionToRoute('debtor');
    },
    cancelEditing: function() {
      this.setSelections();
      if (this.get('transaction') !== null || this.get('transaction') === void 0) {
        this.get('transaction').rollback();
      }
      this.set('isEditing', false);
      return this.transitionToRoute('debtor');
    }
  });
  
});
window.require.register("controllers/lookupDataController", function(exports, require, module) {
  App.LookupDataController = Em.ArrayController.extend({
    selected: null,
    getSelectedId: function() {
      return this.get('selected.id');
    },
    getObjectById: function(id) {
      return this.get('content').filterProperty('id', id).get('firstObject');
    },
    getLabelById: function(id) {
      return this.get('content').filterProperty('id', id).get('firstObject.type');
    },
    setSelectedById: function(id) {
      return this.set('selected', this.getObjectById(id));
    }
  });

  App.ConsumerFlagsController = App.LookupDataController.extend({
    content: [
      Em.Object.create({
        id: 'N',
        label: 'Consumer'
      }), Em.Object.create({
        id: 'Y',
        label: 'Commerical'
      })
    ]
  });

  App.TitlesController = App.LookupDataController.extend({
    content: [
      Em.Object.create({
        id: 'Dr.'
      }), Em.Object.create({
        id: 'Miss'
      }), Em.Object.create({
        id: 'Mr.'
      }), Em.Object.create({
        id: 'Mrs.'
      }), Em.Object.create({
        id: 'Ms.'
      }), Em.Object.create({
        id: 'Prof'
      })
    ]
  });

  App.SuffixesController = App.LookupDataController.extend({
    content: [
      Em.Object.create({
        id: 'Jr.'
      }), Em.Object.create({
        id: 'Sr.'
      }), Em.Object.create({
        id: 'Esq.'
      }), Em.Object.create({
        id: 'I'
      }), Em.Object.create({
        id: 'II'
      }), Em.Object.create({
        id: 'III'
      })
    ]
  });

  App.ValidInvalidController = App.LookupDataController.extend({
    content: [
      Em.Object.create({
        id: 1,
        label: 'Valid'
      }), Em.Object.create({
        id: 2,
        label: 'Invalid'
      })
    ]
  });

  App.YesNoController = App.LookupDataController.extend({
    content: [
      Em.Object.create({
        id: 'Y',
        label: 'Yes'
      }), Em.Object.create({
        id: 'N',
        label: 'No'
      })
    ]
  });

  App.PhoneTypesController = App.LookupDataController.extend({
    content: [
      Em.Object.create({
        id: 0,
        label: 'Unknown'
      }), Em.Object.create({
        id: 1,
        label: 'Home'
      }), Em.Object.create({
        id: 2,
        label: 'Work'
      }), Em.Object.create({
        id: 3,
        label: 'Cell'
      }), Em.Object.create({
        id: 4,
        label: 'Fax'
      }), Em.Object.create({
        id: 5,
        label: 'VOIP'
      })
    ]
  });

  App.PhoneStatusesController = App.LookupDataController.extend({
    content: [
      Em.Object.create({
        id: 0,
        label: 'Unknown'
      }), Em.Object.create({
        id: 1,
        label: 'Valid'
      }), Em.Object.create({
        id: 2,
        label: 'Invalid'
      }), Em.Object.create({
        id: 3,
        label: 'New'
      }), Em.Object.create({
        id: 4,
        label: 'Valid - Do not call'
      })
    ]
  });

  App.PhoneSourcesController = App.LookupDataController.extend({
    content: [
      Em.Object.create({
        id: 0,
        label: 'Unknown'
      }), Em.Object.create({
        id: 1,
        label: 'Type In'
      }), Em.Object.create({
        id: 2,
        label: 'Client'
      }), Em.Object.create({
        id: 3,
        label: 'Skip Trance'
      }), Em.Object.create({
        id: 4,
        label: 'Consumer Portal'
      })
    ]
  });

  App.AssociationsController = App.LookupDataController.extend({
    content: [
      Em.Object.create({
        id: '1',
        label: 'Consumer'
      }), Em.Object.create({
        id: '2',
        label: 'Spouse'
      })
    ]
  });

  App.EmploymentStatusesController = App.LookupDataController.extend({
    content: [
      Em.Object.create({
        id: 1,
        label: 'Employed'
      }), Em.Object.create({
        id: 2,
        label: 'Full Time'
      }), Em.Object.create({
        id: 3,
        label: 'Part Time'
      }), Em.Object.create({
        id: 4,
        label: 'Unemployed'
      }), Em.Object.create({
        id: 5,
        label: 'Other'
      }), Em.Object.create({
        id: 6,
        label: 'Self Employed'
      })
    ]
  });

  App.CountriesController = App.LookupDataController.extend({
    loaded: (function() {
      return this.set('sortAscending', true);
    }).observes('@content.isloaded')
  });

  App.RelationshipsController = App.LookupDataController.extend();
  
});
window.require.register("controllers/noteController", function(exports, require, module) {
  App.NoteController = Em.ObjectController.extend({
    close: function() {
      return this.transitionToRoute('debtor');
    }
  });
  
});
window.require.register("controllers/notesController", function(exports, require, module) {
  App.NotesController = App.ColumnSorterController.extend({
    columns: (function() {
      return [
        Em.Object.create({
          column: 'time'
        }), Em.Object.create({
          column: 'actionCode'
        }), Em.Object.create({
          column: 'resultCode'
        }), Em.Object.create({
          column: 'user'
        }), Em.Object.create({
          column: 'message'
        })
      ];
    }).property()
  });
  
});
window.require.register("controllers/personController", function(exports, require, module) {
  App.PersonController = App.EditObjectController.extend({
    needs: ['countries', 'relationships', 'titles'],
    setSelections: function() {
      this.get('controllers.countries').setSelectedById(this.get('country'));
      this.get('controllers.relationships').setSelectedById(this.get('relationship'));
      return this.get('controllers.titles').setSelectedById(this.get('title'));
    },
    getSelections: function() {
      this.set('country', this.get('controllers.countries').getSelectedId());
      this.set('relationship', this.get('controllers.relationships').getSelectedId());
      return this.set('title', this.get('controllers.titles').getSelectedId());
    }
  });
  
});
window.require.register("controllers/personsController", function(exports, require, module) {
  App.PersonsController = App.ColumnSorterController.extend({
    needs: ['debtor', 'person'],
    columns: (function() {
      return [
        Em.Object.create({
          column: 'name'
        }), Em.Object.create({
          column: 'relationship'
        }), Em.Object.create({
          column: 'phone'
        }), Em.Object.create({
          column: 'city'
        }), Em.Object.create({
          column: 'state'
        }), Em.Object.create({
          column: 'comment'
        })
      ];
    }).property(),
    create: function() {
      var transaction;
      transaction = this.get('store').transaction();
      return this.transitionToRoute('person', transaction.createRecord(App.Person, {
        'debtor': this.get('controllers.debtor').content,
        'debtorId': this.get('controllers.debtor').content.id
      }));
    },
    "delete": function(item) {
      var transaction;
      transaction = this.get('store').transaction();
      transaction.add(item);
      item.deleteRecord();
      return transaction.commit();
    }
  });
  
});
window.require.register("helpers/datePicker", function(exports, require, module) {
  App.DatePicker = Em.TextField.extend({
    classNames: ['date-picker'],
    textToDateTransform: (function(key, value) {
      var date, month, parts;
      if (arguments.length === 2) {
        if (value && /\d{4}-\d{2}-\d{2}/.test(value)) {
          parts = value.split('-');
          date = new Date();
          date.setYear(parts[0]);
          date.setMonth(parts[1] - 1);
          date.setDate(parts[2]);
          return this.set('date', date);
        } else {
          return this.set('date', null);
        }
      } else if (!value && this.get('date')) {
        month = this.get('date').getMonth() + 1;
        date = this.get('date').getDate();
        if (month < 10) {
          month = "0" + month;
        }
        if (date < 10) {
          date = "0" + date;
        }
        return "%@-%@-%@".fmt(this.get('date').getFullYear(), month, date);
      } else {
        return value;
      }
    }).property(),
    placeholder: "yyyy-mm-dd",
    size: 8,
    valueBinding: "textToDateTransform"
  });
  
});
window.require.register("helpers/handlebarsHelpers", function(exports, require, module) {
  Em.Handlebars.helper('titleize', function(value, options) {
    var escaped, title;
    if (value === null || value === void 0) {
      return value;
    }
    title = value.replace(/^([a-z])/, function(match) {
      return match.toUpperCase();
    });
    escaped = Handlebars.Utils.escapeExpression(title);
    return new Handlebars.SafeString(escaped);
  });

  Em.Handlebars.helper('humanize', function(value, options) {
    var escaped;
    if (value === null || value === void 0) {
      return value;
    }
    value = value.replace(/([A-Z]+|[0-9]+)/g, " $1").replace(/^./, function(str) {
      return str.toUpperCase();
    });
    escaped = Handlebars.Utils.escapeExpression(value);
    return new Handlebars.SafeString(escaped);
  });

  Em.Handlebars.helper('date', function(value, options) {
    var escaped;
    if (value === null || value === void 0) {
      return value;
    }
    escaped = Handlebars.Utils.escapeExpression(value.toLocaleDateString());
    return new Handlebars.SafeString(escaped);
  });

  Em.Handlebars.helper('currency', function(value, options) {
    var escaped;
    if (value === null || value === void 0) {
      return value;
    }
    escaped = Handlebars.Utils.escapeExpression('$' + value.toFixed(2));
    return new Handlebars.SafeString(escaped);
  });

  Em.Handlebars.helper('summarize', function(value, oprions) {
    var escaped;
    if (value === null || value === void 0) {
      return value;
    }
    value = value.substr(0, 255) + ' ...';
    escaped = Handlebars.Utils.escapeExpression(value);
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

  require('helpers/datePicker');

  require('controllers/helpers/columnItemController');

  require('controllers/helpers/columnSorterController');

  require('controllers/helpers/editObjectController');

  require('controllers/contactController');

  require('controllers/contactsController');

  require('controllers/debtorController');

  require('controllers/debtorsController');

  require('controllers/personsController');

  require('controllers/personController');

  require('controllers/employmentController');

  require('controllers/employmentsController');

  require('controllers/noteController');

  require('controllers/notesController');

  require('controllers/lookupDataController');

  require('models/contact');

  require('models/debtor');

  require('models/employment');

  require('models/note');

  require('models/person');

  require('models/relationship');

  require('models/country');

  require('routes/indexRoute');

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

  require('templates/person/_edit');

  require('templates/person');

  require('templates/persons');

  require('templates/employment/_edit');

  require('templates/employment');

  require('templates/employments');

  require('templates/note');

  require('templates/notes');

  require('store/webapi/serializer');

  require('store/webapi/adapter');

  require('store/RESTfulAdapter');

  App.Router.map(function() {
    this.route('index', {
      path: '/'
    }, function() {});
    return this.resource('debtor', {
      path: 'debtor/:debtor_id'
    }, function() {
      this.resource('contact', {
        path: 'contact/:contact_id'
      }, this.resource('person', {
        path: 'person/:person_id'
      }, this.resource('employment', {
        path: 'employment/:employment_id'
      })));
      return this.resource('note', {
        path: 'note/:note_id'
      });
    });
  });
  
});
window.require.register("models/client", function(exports, require, module) {
  App.Client = DS.Model.extend({
    description: DS.attr('string')
  });
  
});
window.require.register("models/contact", function(exports, require, module) {
  App.Contact = DS.Model.extend({
    type: DS.attr('number'),
    country: DS.attr('string'),
    phone: DS.attr('string'),
    extension: DS.attr('string'),
    score: DS.attr('number'),
    status: DS.attr('number'),
    source: DS.attr('number'),
    consent: DS.attr('string'),
    debtorId: DS.attr('number'),
    debtor: DS.belongsTo('App.Debtor')
  });
  
});
window.require.register("models/country", function(exports, require, module) {
  App.Country = DS.Model.extend({
    label: DS.attr('string')
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
    contacts: DS.hasMany('App.Contact'),
    persons: DS.hasMany('App.Person'),
    employments: DS.hasMany('App.Employment'),
    notes: DS.hasMany('App.Note'),
    clientId: DS.attr('number')
  });
  
});
window.require.register("models/employment", function(exports, require, module) {
  App.Employment = DS.Model.extend({
    association: DS.attr('number'),
    name: DS.attr('string'),
    monthlyNetIncome: DS.attr('number'),
    position: DS.attr('string'),
    hireDate: DS.attr('date'),
    phone: DS.attr('string'),
    website: DS.attr('string'),
    status: DS.attr('number'),
    source: DS.attr('number'),
    jobTitle: DS.attr('string'),
    terminationDate: DS.attr('date'),
    yearlyIncome: DS.attr('number'),
    monthlyGrossIncome: DS.attr('number'),
    country: DS.attr('number'),
    address1: DS.attr('string'),
    address2: DS.attr('string'),
    address3: DS.attr('string'),
    city: DS.attr('string'),
    state: DS.attr('string'),
    zip: DS.attr('string'),
    county: DS.attr('string'),
    debtorId: DS.attr('number'),
    debtor: DS.belongsTo('App.Debtor')
  });
  
});
window.require.register("models/note", function(exports, require, module) {
  App.Note = DS.Model.extend({
    time: DS.attr('date'),
    actionCode: DS.attr('number'),
    resultCode: DS.attr('number'),
    message: DS.attr('string'),
    userid: DS.attr('number'),
    clientId: DS.attr('number'),
    debtorId: DS.attr('number'),
    debtor: DS.belongsTo('App.Debtor')
  });
  
});
window.require.register("models/person", function(exports, require, module) {
  App.Person = DS.Model.extend({
    relationship: DS.attr('number'),
    title: DS.attr('string'),
    lastName: DS.attr('string'),
    firstName: DS.attr('string'),
    middleName: DS.attr('string'),
    suffix: DS.attr('string'),
    dob: DS.attr('date'),
    SSN: DS.attr('string'),
    startDate: DS.attr('date'),
    endDate: DS.attr('date'),
    claimNumber: DS.attr('string'),
    phone: DS.attr('string'),
    country: DS.attr('number'),
    address1: DS.attr('string'),
    address2: DS.attr('string'),
    address3: DS.attr('string'),
    city: DS.attr('string'),
    state: DS.attr('string'),
    zip: DS.attr('string'),
    county: DS.attr('string'),
    debtorId: DS.attr('number'),
    debtor: DS.belongsTo('App.Debtor')
  });
  
});
window.require.register("models/relationship", function(exports, require, module) {
  App.Relationship = DS.Model.extend({
    label: DS.attr('string')
  });
  
});
window.require.register("routes/debtorRoute", function(exports, require, module) {
  App.DebtorRoute = Em.Route.extend({
    model: function(params) {
      return App.Debtor.find(params.debtor_id);
    },
    setupController: function(controller, model) {
      controller.set('model', model);
      this.controllerFor('countries').set('content', App.Country.find());
      return this.controllerFor('relationships').set('content', App.Relationship.find());
    }
  });
  
});
window.require.register("routes/indexRoute", function(exports, require, module) {
  App.IndexRoute = Em.Route.extend({
    setupController: function(controller, model) {
      return this.controllerFor('debtors').set('model', App.Debtor.find());
    },
    renderTemplate: function() {
      return this.render('debtors', {
        controller: 'debtors'
      });
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
      plurals: {
        'country': 'countries'
      },
      pluralize: function(name) {
        var plurals;
        plurals = this.get('plurals');
        return (plurals && plurals[name]) || name + 's';
      }
    })
  });

  DS.WebAPIAdapter.map('App.Debtor', {
    contacts: {
      embedded: 'load'
    },
    persons: {
      embedded: 'load'
    },
    employments: {
      embedded: 'load'
    },
    notes: {
      embedded: 'load'
    }
  });

  DS.WebAPIAdapter.map('App.Contact', {
    countries: {
      embedded: 'always'
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

  DS.WebAPIAdapter.configure('App.Person', {
    sideloadAs: 'person',
    primaryKey: 'id'
  });

  DS.WebAPIAdapter.configure('App.Employment', {
    sideloadAs: 'employment',
    primaryKey: 'id'
  });

  DS.WebAPIAdapter.configure('App.Note', {
    sideloadAs: 'note',
    primaryKey: 'id'
  });

  DS.WebAPIAdapter.configure('App.Country', {
    sideloadAs: 'country',
    primaryKey: 'id'
  });

  DS.WebAPIAdapter.configure('App.Relationship', {
    sideloadAs: 'relationship',
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
    var buffer = '', stack1, hashTypes, hashContexts, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


    data.buffer.push("<div class=\"row-fluid\">");
    hashTypes = {};
    hashContexts = {};
    options = {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
    data.buffer.push(escapeExpression(((stack1 = helpers.partial),stack1 ? stack1.call(depth0, "contact/edit", options) : helperMissing.call(depth0, "partial", "contact/edit", options))));
    data.buffer.push("</div>");
    return buffer;
    
  });module.exports = module.id;
});
window.require.register("templates/contact/_edit", function(exports, require, module) {
  Ember.TEMPLATES["contact/_edit"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
  helpers = helpers || Ember.Handlebars.helpers; data = data || {};
    var buffer = '', hashContexts, hashTypes, escapeExpression=this.escapeExpression;


    data.buffer.push("<div class=\"modal\"><div class=\"container-fluid\"><div class=\"row-fluid\"><div class=\"span6\">");
    hashContexts = {'contentBinding': depth0,'optionLabelPath': depth0,'optionValuePath': depth0,'selectionBinding': depth0,'prompt': depth0};
    hashTypes = {'contentBinding': "STRING",'optionLabelPath': "STRING",'optionValuePath': "STRING",'selectionBinding': "STRING",'prompt': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.Select", {hash:{
      'contentBinding': ("controllers.phoneTypes"),
      'optionLabelPath': ("content.label"),
      'optionValuePath': ("content.id"),
      'selectionBinding': ("controllers.phoneTypes.selected"),
      'prompt': ("Type ...")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'contentBinding': depth0,'optionLabelPath': depth0,'optionValuePath': depth0,'selectionBinding': depth0,'prompt': depth0};
    hashTypes = {'contentBinding': "STRING",'optionLabelPath': "STRING",'optionValuePath': "STRING",'selectionBinding': "STRING",'prompt': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.Select", {hash:{
      'contentBinding': ("controllers.countries"),
      'optionLabelPath': ("content.label"),
      'optionValuePath': ("content.id"),
      'selectionBinding': ("controllers.countries.selected"),
      'prompt': ("Country ...")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("phone"),
      'placeholder': ("Phone")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("extension"),
      'placeholder': ("Extension")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("score"),
      'placeholder': ("Score")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'contentBinding': depth0,'optionLabelPath': depth0,'optionValuePath': depth0,'selectionBinding': depth0,'prompt': depth0};
    hashTypes = {'contentBinding': "STRING",'optionLabelPath': "STRING",'optionValuePath': "STRING",'selectionBinding': "STRING",'prompt': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.Select", {hash:{
      'contentBinding': ("controllers.phoneStatuses"),
      'optionLabelPath': ("content.label"),
      'optionValuePath': ("content.id"),
      'selectionBinding': ("controllers.phoneStatuses.selected"),
      'prompt': ("Status ...")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'contentBinding': depth0,'optionLabelPath': depth0,'optionValuePath': depth0,'selectionBinding': depth0,'prompt': depth0};
    hashTypes = {'contentBinding': "STRING",'optionLabelPath': "STRING",'optionValuePath': "STRING",'selectionBinding': "STRING",'prompt': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.Select", {hash:{
      'contentBinding': ("controllers.phoneSources"),
      'optionLabelPath': ("content.label"),
      'optionValuePath': ("content.id"),
      'selectionBinding': ("controllers.phoneSources.selected"),
      'prompt': ("Source ...")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'contentBinding': depth0,'optionLabelPath': depth0,'optionValuePath': depth0,'selectionBinding': depth0,'prompt': depth0};
    hashTypes = {'contentBinding': "STRING",'optionLabelPath': "STRING",'optionValuePath': "STRING",'selectionBinding': "STRING",'prompt': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.Select", {hash:{
      'contentBinding': ("controllers.yesNo"),
      'optionLabelPath': ("content.label"),
      'optionValuePath': ("content.id"),
      'selectionBinding': ("controllers.yesNo.selected"),
      'prompt': ("Consent ...")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("<div class=\"btn btn-success\" ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "doneEditing", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">Done</div><div class=\"btn\" ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "cancelEditing", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">Cancel</div></div></div></div></div>");
    return buffer;
    
  });module.exports = module.id;
});
window.require.register("templates/contacts", function(exports, require, module) {
  Ember.TEMPLATES["contacts"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
  helpers = helpers || Ember.Handlebars.helpers; data = data || {};
    var buffer = '', stack1, hashTypes, hashContexts, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

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
    data.buffer.push("<tr><td><div class=\"btn\" ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "delete", "", {hash:{},contexts:[depth0,depth0],types:["ID","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">-</div></td><td>");
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
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "typeLabel", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
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

    data.buffer.push("<div class=\"row-fluid\"><div class=\"span9\"><h4>Contact Phone Records</h4><table class=\"table\"><thead><tr><th><div class=\"btn btn-primary\" ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "create", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">+</div></th>");
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
    data.buffer.push("</tbody></table><hr /></div></div>");
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
    data.buffer.push("<div class=\"btn\" ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "edit", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">Edit</div>");
    return buffer;
    }

    data.buffer.push("<div class=\"container-fluid\"><div class=\"row-fluid\"><div class=\"span12\"><div class=\"span6\"><address><h2>");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "title", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(" ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "name", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(" ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "suffix", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("<div class=\"span3 pull-right\"><div class=\"btn btn-primary\" ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "back", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">Back</div>");
    hashTypes = {};
    hashContexts = {};
    stack1 = helpers['if'].call(depth0, "isEditing", {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</div></h2><h4>");
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
    data.buffer.push("</div><div class=\"span4 pull-right\"><div class=\"btn btn-danger\">Cancellation</div><div class=\"btn btn-warning\">Hold Account</div></div></address></div><div class=\"span6\">");
    hashTypes = {};
    hashContexts = {};
    options = {hash:{},contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
    data.buffer.push(escapeExpression(((stack1 = helpers.render),stack1 ? stack1.call(depth0, "contacts", "contacts", options) : helperMissing.call(depth0, "render", "contacts", "contacts", options))));
    data.buffer.push("</div></div></div><hr /><div class=\"row-fluid\"><div class=\"span12\"><div class=\"span6\">");
    hashTypes = {};
    hashContexts = {};
    options = {hash:{},contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
    data.buffer.push(escapeExpression(((stack1 = helpers.render),stack1 ? stack1.call(depth0, "persons", "persons", options) : helperMissing.call(depth0, "render", "persons", "persons", options))));
    data.buffer.push("</div><div class=\"span6\">");
    hashTypes = {};
    hashContexts = {};
    options = {hash:{},contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
    data.buffer.push(escapeExpression(((stack1 = helpers.render),stack1 ? stack1.call(depth0, "employments", "employments", options) : helperMissing.call(depth0, "render", "employments", "employments", options))));
    data.buffer.push("</div>");
    hashTypes = {};
    hashContexts = {};
    options = {hash:{},contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
    data.buffer.push(escapeExpression(((stack1 = helpers.render),stack1 ? stack1.call(depth0, "notes", "notes", options) : helperMissing.call(depth0, "render", "notes", "notes", options))));
    data.buffer.push("</div></div>");
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
    var buffer = '', hashContexts, hashTypes, escapeExpression=this.escapeExpression;


    data.buffer.push("<div class=\"modal\"><div class=\"container-fluid\"><div class=\"row-fluid\"><div class=\"span6\">");
    hashContexts = {'contentBinding': depth0,'optionLabelPath': depth0,'optionValuePath': depth0,'selectionBinding': depth0};
    hashTypes = {'contentBinding': "STRING",'optionLabelPath': "STRING",'optionValuePath': "STRING",'selectionBinding': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.Select", {hash:{
      'contentBinding': ("controllers.consumerFlags"),
      'optionLabelPath': ("content.label"),
      'optionValuePath': ("content.id"),
      'selectionBinding': ("controllers.consumerFlags.selected")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'contentBinding': depth0,'optionLabelPath': depth0,'optionValuePath': depth0,'selectionBinding': depth0,'prompt': depth0};
    hashTypes = {'contentBinding': "STRING",'optionLabelPath': "STRING",'optionValuePath': "STRING",'selectionBinding': "STRING",'prompt': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.Select", {hash:{
      'contentBinding': ("controllers.titles"),
      'optionLabelPath': ("content.id"),
      'optionValuePath': ("content.id"),
      'selectionBinding': ("controllers.titles.selected"),
      'prompt': ("Title ...")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("lastName"),
      'placeholder': ("Last Name")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("firstName"),
      'placeholder': ("First Name")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("middleName"),
      'placeholder': ("Middle Name")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'contentBinding': depth0,'optionLabelPath': depth0,'optionValuePath': depth0,'selectionBinding': depth0,'prompt': depth0};
    hashTypes = {'contentBinding': "STRING",'optionLabelPath': "STRING",'optionValuePath': "STRING",'selectionBinding': "STRING",'prompt': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.Select", {hash:{
      'contentBinding': ("controllers.suffixes"),
      'optionLabelPath': ("content.id"),
      'optionValuePath': ("content.id"),
      'selectionBinding': ("controllers.suffixes.selected"),
      'prompt': ("Suffix ...")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'dateBinding': depth0};
    hashTypes = {'dateBinding': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.DatePicker", {hash:{
      'dateBinding': ("dob")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("ssn"),
      'placeholder': ("SSN")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("maritalStatus"),
      'placeholder': ("Martial Status")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("email"),
      'placeholder': ("Email")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'contentBinding': depth0,'optionLabelPath': depth0,'optionValuePath': depth0,'selectionBinding': depth0,'prompt': depth0};
    hashTypes = {'contentBinding': "STRING",'optionLabelPath': "STRING",'optionValuePath': "STRING",'selectionBinding': "STRING",'prompt': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.Select", {hash:{
      'contentBinding': ("controllers.validInvalid"),
      'optionLabelPath': ("content.label"),
      'optionValuePath': ("content.id"),
      'selectionBinding': ("controllers.validInvalid.selected"),
      'prompt': ("Email Validity ...")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'contentBinding': depth0,'optionLabelPath': depth0,'optionValuePath': depth0,'selectionBinding': depth0,'prompt': depth0};
    hashTypes = {'contentBinding': "STRING",'optionLabelPath': "STRING",'optionValuePath': "STRING",'selectionBinding': "STRING",'prompt': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.Select", {hash:{
      'contentBinding': ("controllers.yesNo"),
      'optionLabelPath': ("content.label"),
      'optionValuePath': ("content.id"),
      'selectionBinding': ("controllers.yesNo.selected"),
      'prompt': ("Email Opt-in ...")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("contact"),
      'placeholder': ("Commerical Contact")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><div class=\"span6\">");
    hashContexts = {'contentBinding': depth0,'optionLabelPath': depth0,'optionValuePath': depth0,'selectionBinding': depth0,'prompt': depth0};
    hashTypes = {'contentBinding': "STRING",'optionLabelPath': "STRING",'optionValuePath': "STRING",'selectionBinding': "STRING",'prompt': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.Select", {hash:{
      'contentBinding': ("controllers.countries"),
      'optionLabelPath': ("content.label"),
      'optionValuePath': ("content.id"),
      'selectionBinding': ("controllers.countries.selected"),
      'prompt': ("Country ...")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("country"),
      'placeholder': ("Country")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("address1"),
      'placeholder': ("Address 1")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("address2"),
      'placeholder': ("Address 2")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("address3"),
      'placeholder': ("Address 3")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("city"),
      'placeholder': ("City")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("state"),
      'placeholder': ("State")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("zip"),
      'placeholder': ("Zip code")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("county"),
      'placeholder': ("County")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("dlIssuer"),
      'placeholder': ("Driver License Issuer")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("dlNumber"),
      'placeholder': ("Driver License Number")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("passport"),
      'placeholder': ("Passport Number")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("pin"),
      'placeholder': ("PIN")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><div class=\"btn btn-success\" ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "doneEditing", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">Done</div><div class=\"btn\" ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "cancelEditing", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">Cancel</div></div></div></div>");
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

    data.buffer.push("<div class=\"container-fluid\"><div class=\"row-fluid\"><div class=\"pull-right\">");
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("controller.search"),
      'placeholder': ("filter by Id ...")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><table class=\"table table-striped\"><thead><tr>");
    hashContexts = {'itemController': depth0};
    hashTypes = {'itemController': "STRING"};
    stack1 = helpers.each.call(depth0, "columns", {hash:{
      'itemController': ("columnItem")
    },inverse:self.program(4, program4, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</tr></thead><tbody>");
    hashTypes = {};
    hashContexts = {};
    stack1 = helpers.each.call(depth0, "filtered", {hash:{},inverse:self.program(4, program4, data),fn:self.program(8, program8, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</tbody></table></div></div>");
    return buffer;
    
  });module.exports = module.id;
});
window.require.register("templates/employment", function(exports, require, module) {
  Ember.TEMPLATES["employment"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
  helpers = helpers || Ember.Handlebars.helpers; data = data || {};
    var buffer = '', stack1, hashTypes, hashContexts, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


    data.buffer.push("<div class=\"row-fluid\">");
    hashTypes = {};
    hashContexts = {};
    options = {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
    data.buffer.push(escapeExpression(((stack1 = helpers.partial),stack1 ? stack1.call(depth0, "employment/edit", options) : helperMissing.call(depth0, "partial", "employment/edit", options))));
    data.buffer.push("</div>");
    return buffer;
    
  });module.exports = module.id;
});
window.require.register("templates/employment/_edit", function(exports, require, module) {
  Ember.TEMPLATES["employment/_edit"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
  helpers = helpers || Ember.Handlebars.helpers; data = data || {};
    var buffer = '', hashContexts, hashTypes, escapeExpression=this.escapeExpression;


    data.buffer.push("<div class=\"modal\"><div class=\"container-fluid\"><div class=\"row-fluid\"><div class=\"span6\">");
    hashContexts = {'contentBinding': depth0,'optionLabelPath': depth0,'optionValuePath': depth0,'selectionBinding': depth0,'prompt': depth0};
    hashTypes = {'contentBinding': "STRING",'optionLabelPath': "STRING",'optionValuePath': "STRING",'selectionBinding': "STRING",'prompt': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.Select", {hash:{
      'contentBinding': ("controllers.associations"),
      'optionLabelPath': ("content.label"),
      'optionValuePath': ("content.id"),
      'selectionBinding': ("controllers.associations.selected"),
      'prompt': ("Relationship ...")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("name"),
      'placeholder': ("Name")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("position"),
      'placeholder': ("Position")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("hireDate"),
      'placeholder': ("Hire Date")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("terminationDate"),
      'placeholder': ("Termination Date")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("phone"),
      'placeholder': ("Phone")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("website"),
      'placeholder': ("Website")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'contentBinding': depth0,'optionLabelPath': depth0,'optionValuePath': depth0,'selectionBinding': depth0,'prompt': depth0};
    hashTypes = {'contentBinding': "STRING",'optionLabelPath': "STRING",'optionValuePath': "STRING",'selectionBinding': "STRING",'prompt': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.Select", {hash:{
      'contentBinding': ("controllers.employmentStatuses"),
      'optionLabelPath': ("content.label"),
      'optionValuePath': ("content.id"),
      'selectionBinding': ("controllers.employmentStatuses.selected"),
      'prompt': ("Employment Status ...")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("source"),
      'placeholder': ("Source")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("jobTitle"),
      'placeholder': ("Job Title")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("yearlyIncome"),
      'placeholder': ("Yearly Income")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("monthlyGrossIncome"),
      'placeholder': ("Monthly Gross Income")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("monthlyNetIncome"),
      'placeholder': ("Monthly Net Income")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><div class=\"span6\">");
    hashContexts = {'contentBinding': depth0,'optionLabelPath': depth0,'optionValuePath': depth0,'selectionBinding': depth0,'prompt': depth0};
    hashTypes = {'contentBinding': "STRING",'optionLabelPath': "STRING",'optionValuePath': "STRING",'selectionBinding': "STRING",'prompt': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.Select", {hash:{
      'contentBinding': ("controllers.countries"),
      'optionLabelPath': ("content.label"),
      'optionValuePath': ("content.id"),
      'selectionBinding': ("controllers.countries.selected"),
      'prompt': ("Country ...")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("address1"),
      'placeholder': ("Address 1")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("address2"),
      'placeholder': ("Address 2")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("address3"),
      'placeholder': ("Address 3")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("city"),
      'placeholder': ("City")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("state"),
      'placeholder': ("State")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("zip"),
      'placeholder': ("Zip")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("county"),
      'placeholder': ("County")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><div class=\"btn btn-success\" ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "doneEditing", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">Done</div><div class=\"btn\" ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "cancelEditing", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">Cancel</div></div></div></div>");
    return buffer;
    
  });module.exports = module.id;
});
window.require.register("templates/employments", function(exports, require, module) {
  Ember.TEMPLATES["employments"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
  helpers = helpers || Ember.Handlebars.helpers; data = data || {};
    var buffer = '', stack1, hashTypes, hashContexts, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

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
    data.buffer.push("<tr><td><div class=\"btn\" ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "delete", "", {hash:{},contexts:[depth0,depth0],types:["ID","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">-</div></td><td>");
    hashTypes = {};
    hashContexts = {};
    options = {hash:{},inverse:self.program(4, program4, data),fn:self.program(9, program9, data),contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
    stack2 = ((stack1 = helpers.linkTo),stack1 ? stack1.call(depth0, "employment", "", options) : helperMissing.call(depth0, "linkTo", "employment", "", options));
    if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
    data.buffer.push("</td><td>");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "status", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</td><td>");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "source", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</td><td>");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "phone", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</td><td>");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "title", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</td><td>");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "hireDate", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</td></tr>");
    return buffer;
    }
  function program9(depth0,data) {
    
    var hashTypes, hashContexts;
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "name", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    }

    data.buffer.push("<div class=\"row-fluid\"><div class=\"span9\"><h4>Employment Records</h4><table class=\"table\"><thead><tr><th><div class=\"btn btn-primary\" ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "create", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">+</div></th>");
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
    data.buffer.push("</tbody></table><hr /></div></div>");
    return buffer;
    
  });module.exports = module.id;
});
window.require.register("templates/index", function(exports, require, module) {
  Ember.TEMPLATES["index"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
  helpers = helpers || Ember.Handlebars.helpers; data = data || {};
    var hashTypes, hashContexts, escapeExpression=this.escapeExpression;


    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "outlet", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    
  });module.exports = module.id;
});
window.require.register("templates/note", function(exports, require, module) {
  Ember.TEMPLATES["note"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
  helpers = helpers || Ember.Handlebars.helpers; data = data || {};
    var buffer = '', stack1, hashTypes, hashContexts, options, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


    data.buffer.push("<div class=\"modal\"><div class=\"container-fluid\"><div class=\"row-fluid\"><div class=\"span9\"><div class=\"span3\"><h2>");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "user", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</h2></div><div class=\"span3\"><h4>");
    hashTypes = {};
    hashContexts = {};
    options = {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
    data.buffer.push(escapeExpression(((stack1 = helpers.date),stack1 ? stack1.call(depth0, "time", options) : helperMissing.call(depth0, "date", "time", options))));
    data.buffer.push("</h4></div><div class=\"intro\"><div class=\"span3\"><h5>Action Code ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "actionCode", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</h5></div><div class=\"span3\"><h5>Result Code ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "resultCode", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</h5></div></div></div></div><hr /><dl class=\"dl-horizontal\"><dt>Message</dt><dd>");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "message", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</dd></dl><button ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "close", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">Close</button></div></div>");
    return buffer;
    
  });module.exports = module.id;
});
window.require.register("templates/notes", function(exports, require, module) {
  Ember.TEMPLATES["notes"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
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
    stack2 = ((stack1 = helpers.linkTo),stack1 ? stack1.call(depth0, "note", "", options) : helperMissing.call(depth0, "linkTo", "note", "", options));
    if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
    data.buffer.push("</td><td>");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "actionCode", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</td><td>");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "resultCode", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</td><td>");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "user", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</td><td>");
    hashTypes = {};
    hashContexts = {};
    options = {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
    data.buffer.push(escapeExpression(((stack1 = helpers.summarize),stack1 ? stack1.call(depth0, "message", options) : helperMissing.call(depth0, "summarize", "message", options))));
    data.buffer.push("</td></tr>");
    return buffer;
    }
  function program9(depth0,data) {
    
    var stack1, hashTypes, hashContexts, options;
    hashTypes = {};
    hashContexts = {};
    options = {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
    data.buffer.push(escapeExpression(((stack1 = helpers.date),stack1 ? stack1.call(depth0, "time", options) : helperMissing.call(depth0, "date", "time", options))));
    }

    data.buffer.push("<div class=\"row-fluid\"><div class=\"span9\"><h4>Historical Events</h4><table class=\"table\"><thead><tr>");
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
    data.buffer.push("</tbody></table><hr /></div></div>");
    return buffer;
    
  });module.exports = module.id;
});
window.require.register("templates/person", function(exports, require, module) {
  Ember.TEMPLATES["person"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
  helpers = helpers || Ember.Handlebars.helpers; data = data || {};
    var buffer = '', stack1, hashTypes, hashContexts, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


    data.buffer.push("<div class=\"row-fluid\">");
    hashTypes = {};
    hashContexts = {};
    options = {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
    data.buffer.push(escapeExpression(((stack1 = helpers.partial),stack1 ? stack1.call(depth0, "person/edit", options) : helperMissing.call(depth0, "partial", "person/edit", options))));
    data.buffer.push("</div>");
    return buffer;
    
  });module.exports = module.id;
});
window.require.register("templates/person/_edit", function(exports, require, module) {
  Ember.TEMPLATES["person/_edit"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
  helpers = helpers || Ember.Handlebars.helpers; data = data || {};
    var buffer = '', hashContexts, hashTypes, escapeExpression=this.escapeExpression;


    data.buffer.push("<div class=\"modal\"><div class=\"container-fluid\"><div class=\"row-fluid\"><div class=\"span6\">");
    hashContexts = {'contentBinding': depth0,'optionLabelPath': depth0,'optionValuePath': depth0,'selectionBinding': depth0,'prompt': depth0};
    hashTypes = {'contentBinding': "STRING",'optionLabelPath': "STRING",'optionValuePath': "STRING",'selectionBinding': "STRING",'prompt': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.Select", {hash:{
      'contentBinding': ("controllers.relationships"),
      'optionLabelPath': ("content.label"),
      'optionValuePath': ("content.id"),
      'selectionBinding': ("controllers.relationships.selected"),
      'prompt': ("Relationship ...")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'contentBinding': depth0,'optionLabelPath': depth0,'optionValuePath': depth0,'selectionBinding': depth0,'prompt': depth0};
    hashTypes = {'contentBinding': "STRING",'optionLabelPath': "STRING",'optionValuePath': "STRING",'selectionBinding': "STRING",'prompt': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.Select", {hash:{
      'contentBinding': ("controllers.titles"),
      'optionLabelPath': ("content.id"),
      'optionValuePath': ("content.id"),
      'selectionBinding': ("controllers.titles.selected"),
      'prompt': ("Title ...")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("lastName"),
      'placeholder': ("Last Name")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("firstName"),
      'placeholder': ("First Name")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("middleName"),
      'placeholder': ("Middle Name")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'contentBinding': depth0,'optionLabelPath': depth0,'optionValuePath': depth0,'selectionBinding': depth0,'prompt': depth0};
    hashTypes = {'contentBinding': "STRING",'optionLabelPath': "STRING",'optionValuePath': "STRING",'selectionBinding': "STRING",'prompt': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.Select", {hash:{
      'contentBinding': ("controllers.suffixes"),
      'optionLabelPath': ("content.id"),
      'optionValuePath': ("content.id"),
      'selectionBinding': ("controllers.suffixes.selected"),
      'prompt': ("Suffix ...")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'dateBinding': depth0};
    hashTypes = {'dateBinding': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.DatePicker", {hash:{
      'dateBinding': ("dob")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("ssn"),
      'placeholder': ("SSN")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'dateBinding': depth0};
    hashTypes = {'dateBinding': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.DatePicker", {hash:{
      'dateBinding': ("startDate")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'dateBinding': depth0};
    hashTypes = {'dateBinding': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.DatePicker", {hash:{
      'dateBinding': ("endDate")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("claimNumber"),
      'placeholder': ("Claim Number")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("phone"),
      'placeholder': ("Phone")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><div class=\"span6\">");
    hashContexts = {'contentBinding': depth0,'optionLabelPath': depth0,'optionValuePath': depth0,'selectionBinding': depth0,'prompt': depth0};
    hashTypes = {'contentBinding': "STRING",'optionLabelPath': "STRING",'optionValuePath': "STRING",'selectionBinding': "STRING",'prompt': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.Select", {hash:{
      'contentBinding': ("controllers.countries"),
      'optionLabelPath': ("content.label"),
      'optionValuePath': ("content.id"),
      'selectionBinding': ("controllers.countries.selected"),
      'prompt': ("Country ...")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("address1"),
      'placeholder': ("Address 1")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("address2"),
      'placeholder': ("Address 2")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("address3"),
      'placeholder': ("Address 3")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("city"),
      'placeholder': ("City")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("state"),
      'placeholder': ("State")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("zip"),
      'placeholder': ("Zip code")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("county"),
      'placeholder': ("County")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><div class=\"btn btn-success\" ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "doneEditing", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">Done</div><div class=\"btn\" ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "cancelEditing", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">Cancel</div></div></div></div>");
    return buffer;
    
  });module.exports = module.id;
});
window.require.register("templates/persons", function(exports, require, module) {
  Ember.TEMPLATES["persons"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
  helpers = helpers || Ember.Handlebars.helpers; data = data || {};
    var buffer = '', stack1, hashTypes, hashContexts, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

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
    data.buffer.push("<tr><td><div class=\"btn\" ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "delete", "", {hash:{},contexts:[depth0,depth0],types:["ID","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">-</div></td><td>");
    hashTypes = {};
    hashContexts = {};
    options = {hash:{},inverse:self.program(4, program4, data),fn:self.program(9, program9, data),contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
    stack2 = ((stack1 = helpers.linkTo),stack1 ? stack1.call(depth0, "person", "", options) : helperMissing.call(depth0, "linkTo", "person", "", options));
    if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
    data.buffer.push("</td><td>");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "relationship", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</td><td>");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "phone", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
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
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "comment", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</td></tr>");
    return buffer;
    }
  function program9(depth0,data) {
    
    var hashTypes, hashContexts;
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "firstName", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    }

    data.buffer.push("<div class=\"row-fluid\"><div class=\"span9\"><h4>Related Persons</h4><table class=\"table\"><thead><tr><th><div class=\"btn btn-primary\" ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "create", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">+</div></th>");
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
    data.buffer.push("</tbody></table><hr /></div></div>");
    return buffer;
    
  });module.exports = module.id;
});
