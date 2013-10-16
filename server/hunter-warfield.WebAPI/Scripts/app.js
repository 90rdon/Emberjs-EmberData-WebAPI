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
    LOG_TRANSITIONS: true,
    serverUrl: 'http://10.211.55.4',
    serverNamespace: 'hunter-warfield/api',
    paymentPostingUrl: 'http://paymentposting.hunterwarfield.com'
  });
  
});
window.require.register("controllers/applicationController", function(exports, require, module) {
  App.ApplicationController = Em.Controller.extend({
    params: []
  });
  
});
window.require.register("controllers/contactController", function(exports, require, module) {
  App.ContactController = App.EditObjectController.extend({
    needs: ['debtor', 'countries', 'phoneTypes', 'phoneStatuses', 'sources', 'yesNo'],
    isConfirming: false,
    labelPhoneType: (function() {
      var type;
      type = this.get('controllers.phoneTypes').findProperty('id', this.get('type'));
      if (type === null || type === void 0) {
        return null;
      }
      return type.label;
    }).property('type'),
    labelPhoneStatus: (function() {
      var status;
      status = this.get('controllers.phoneStatuses').findProperty('id', this.get('status'));
      if (status === null || status === void 0) {
        return null;
      }
      return status.label;
    }).property('status'),
    setSelections: function() {
      this.get('controllers.countries').setSelectedByIdStr(this.get('country'));
      this.get('controllers.phoneTypes').setSelectedById(this.get('type'));
      this.get('controllers.phoneStatuses').setSelectedById(this.get('status'));
      this.get('controllers.sources').setSelectedById(this.get('source'));
      return this.get('controllers.yesNo').setSelectedById(this.get('consent'));
    },
    getSelections: function() {
      this.set('country', this.get('controllers.countries').getSelectedId());
      this.set('type', this.get('controllers.phoneTypes').getSelectedId());
      this.set('status', this.get('controllers.phoneStatuses').getSelectedId());
      this.set('source', this.get('controllers.sources').getSelectedId());
      return this.set('consent', this.get('controllers.yesNo').getSelectedId());
    }
  });
  
});
window.require.register("controllers/contactsController", function(exports, require, module) {
  App.ContactsController = App.ColumnSorterController.extend({
    needs: ['debtor', 'contact', 'phoneTypes'],
    itemController: 'contact',
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
    actions: {
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
    }
  });
  
});
window.require.register("controllers/debtorController", function(exports, require, module) {
  App.DebtorController = App.EditObjectController.extend({
    needs: ['contacts', 'employments', 'persons', 'notes', 'countries', 'consumerFlags', 'titles', 'suffixes', 'validInvalid', 'yesNo', 'application', 'cancellationCodes', 'actionCodes', 'resultCodes', 'debtorAccount'],
    toCancel: false,
    toHold: false,
    loading: true,
    processing: false,
    cancellationSuccess: false,
    holdSuccess: false,
    confirmationNumber: null,
    accountId: (function() {
      return this.get('controllers.debtorAccount.id');
    }).property('controllers.debtorAccount.id'),
    params: (function() {
      return this.get('controllers.application.params');
    }).property('controllers.application.params'),
    disableEdit: (function() {
      if (this.get('params.canEditDebtor') === 'true') {
        return false;
      }
      return true;
    }).property(),
    loaded: (function() {
      return this.set('loading', false);
    }).observes('content.isLoaded'),
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
    actions: {
      close: function() {
        this.set('isEditing', false);
        return window.close();
      },
      makePayment: function() {
        return window.open(App.paymentPostingUrl);
      },
      sendCancellation: function() {
        var self;
        self = this;
        this.set('toCancel', false);
        this.set('processing', true);
        return $.ajax({
          url: App.serverUrl + '/' + App.serverNamespace + '/cancellation',
          dataType: 'json',
          type: 'POST',
          data: {
            accountId: this.get('accountId'),
            agencyId: this.get('controllers.debtorAccount.agencyId'),
            userId: this.get('params.userId'),
            shortCode: this.get('controllers.cancellationCodes').getSelectedId(),
            debtorId: this.get('id'),
            clientId: this.get('params.clientId'),
            creditorId: this.get('creditorId')
          },
          success: function(response) {
            self.get('content').refresh();
            return Em.run.later((function() {
              self.set('processing', false);
              return self.set('cancellationSuccess', true);
            }), 5000);
          }
        });
      },
      sendHold: function() {
        var self;
        self = this;
        this.set('toHold', false);
        this.set('processing', true);
        return $.ajax({
          url: App.serverUrl + '/' + App.serverNamespace + '/holdAccount',
          dataType: 'json',
          type: 'POST',
          data: {
            accountId: this.get('accountId'),
            agencyId: this.get('controllers.debtorAccount.agencyId'),
            userId: this.get('params.userId'),
            debtorId: this.get('id'),
            clientId: this.get('params.clientId'),
            creditorId: this.get('creditorId')
          },
          success: function(response) {
            self.get('content').refresh();
            return Em.run.later((function() {
              self.set('processing', false);
              return self.set('holdSuccess', true);
            }), 5000);
          }
        });
      },
      cancellation: function() {
        this.toggleProperty('toCancel');
        return false;
      },
      holdAccount: function() {
        this.toggleProperty('toHold');
        return false;
      },
      hideLoading: function() {
        this.toggleProperty('loading');
        return false;
      },
      showProcessing: function() {
        this.toggleProperty('processing');
        return false;
      },
      closeCancelSuccess: function() {
        this.toggleProperty('cancellationSuccess');
        return false;
      },
      closeHoldSuccess: function() {
        this.toggleProperty('holdSuccess');
        return false;
      }
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
    needs: ['debtor', 'associations', 'employmentStatuses', 'countries', 'sources'],
    labelEmploymentStatus: (function() {
      var status;
      status = this.get('controllers.employmentStatuses').findProperty('id', this.get('status'));
      if (status === null || status === void 0) {
        return null;
      }
      return status.label;
    }).property('status'),
    labelSource: (function() {
      var source;
      source = this.get('controllers.sources').findProperty('id', this.get('source'));
      if (source === null || source === void 0) {
        return null;
      }
      return source.label;
    }).property('source'),
    actions: {
      setSelections: function() {
        this.get('controllers.associations').setSelectedById(this.get('association'));
        this.get('controllers.countries').setSelectedByIdStr(this.get('country'));
        this.get('controllers.employmentStatuses').setSelectedById(this.get('status'));
        return this.get('controllers.sources').setSelectedById(this.get('source'));
      },
      getSelections: function() {
        this.set('country', this.get('controllers.countries').getSelectedId());
        this.set('status', this.get('controllers.employmentStatuses').getSelectedId());
        this.set('association', this.get('controllers.associations').getSelectedId());
        return this.set('source', this.get('controllers.sources').getSelectedId());
      }
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
    actions: {
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
    actions: {
      toggleSort: function(column) {
        if (this.get('sortedColumn') === column) {
          return this.toggleProperty('sortAscending');
        } else {
          this.set('sortProperties', [column]);
          return this.set('sortAscending', true);
        }
      }
    }
  });
  
});
window.require.register("controllers/helpers/editObjectController", function(exports, require, module) {
  App.EditObjectController = Em.ObjectController.extend({
    isEditing: false,
    confirmationId: (function() {
      return 'content-' + this.get('id');
    }).property('id'),
    loaded: (function() {
      return this.setSelections();
    }).observes('@content.isLoaded'),
    dirtied: (function() {
      if ((this.get('transaction') === null || this.get('transaction') === void 0) && this.get('isDirty') === true) {
        return this.set('transaction', this.get('store').transaction());
      }
    }).observes('isDirty'),
    actions: {
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
      },
      deleteRecord: function(item) {
        item.deleteRecord();
        return this.get('store').commit();
      }
    }
  });
  
});
window.require.register("controllers/indexController", function(exports, require, module) {
  App.IndexController = App.ColumnSorterController.extend({
    needs: ['application', 'dataFilter'],
    filterCriteria: ['Active', 'Open', 'All'],
    params: (function() {
      return this.get('controllers.application.params');
    }).property('controllers.application.params'),
    columns: (function() {
      return [
        Em.Object.create({
          column: 'id',
          label: 'accountNumber',
          width: 'width:15%;',
          align: 'text-align:left;'
        }), Em.Object.create({
          column: 'fullName',
          label: 'name',
          width: 'width:30%;',
          align: 'text-align:left;'
        }), Em.Object.create({
          column: 'totalOriginalBalance',
          label: 'originalBalance',
          width: 'width:15%;',
          align: 'text-align:right;'
        }), Em.Object.create({
          column: 'currentBalance',
          label: 'currentBalance',
          width: 'width:15%;',
          align: 'text-align:right;'
        }), Em.Object.create({
          column: 'totalPayment',
          label: 'totalPayment',
          width: 'width:15%;',
          align: 'text-align:right;'
        }), Em.Object.create({
          column: 'status',
          label: 'status',
          width: 'width:10%;',
          align: 'text-align:center;'
        })
      ];
    }).property(),
    currentContent: Em.A([]),
    filterStatus: null,
    filterDebtors: (function() {
      return this.get('filtered');
    }).observes('search'),
    filterByStatus: (function() {
      return console.log('filtering status ' + this.get('filterStatus'));
    }).observes('filterStatus'),
    sorted: (function() {
      var result;
      result = Em.ArrayProxy.createWithMixins(Em.SortableMixin, {
        content: this.get('filteredContent'),
        sortProperties: this.get('sortProperties'),
        sortAscending: this.get('sortAscending')
      });
      return this.set('currentContent', result);
    }).observes('arrangedContent', 'sortAscending'),
    changed: (function() {
      return this.get('filtered');
    }).observes('content.@each'),
    filteredContent: (function() {
      var regexp, result;
      regexp = new RegExp(this.get('search'));
      return result = this.get('content').filter(function(item) {
        return regexp.test(item.get('id'));
      });
    }).property('search', 'content.@each.id'),
    filtered: (function() {
      var result;
      result = Em.ArrayProxy.createWithMixins(Em.SortableMixin, {
        content: this.get('filteredContent'),
        sortProperties: this.get('sortProperties'),
        sortAscending: this.get('sortAscending')
      });
      return this.set('currentContent', result);
    }).observes('filteredContent')
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

  App.SourcesController = App.LookupDataController.extend({
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
    getObjectByIdStr: function(id) {
      return this.get('content').filterProperty('idStr', id).get('firstObject');
    },
    setSelectedByIdStr: function(id) {
      return this.set('selected', this.getObjectByIdStr(id));
    },
    loaded: (function() {
      return this.set('sortAscending', true);
    }).observes('@content.isloaded')
  });

  App.RelationshipsController = App.LookupDataController.extend({
    getObjectByIdNum: function(id) {
      return this.get('content').filterProperty('idNum', id).get('firstObject');
    },
    setSelectedByIdNum: function(id) {
      return this.set('selected', this.getObjectByIdNum(id));
    }
  });

  App.ActionCodesController = App.LookupDataController.extend({
    loaded: (function() {
      return this.set('sortAscending', true);
    }).observes('@content.isloaded')
  });

  App.ResultCodesController = App.LookupDataController.extend({
    loaded: (function() {
      return this.set('sortAscending', true);
    }).observes('@content.isloaded')
  });

  App.CancellationCodesController = App.LookupDataController.extend({
    content: [
      Em.Object.create({
        id: 'A-CBC',
        label: 'Cancelled by Client'
      }), Em.Object.create({
        id: 'A-CBK',
        label: 'Cancelled - Bankruptcy'
      }), Em.Object.create({
        id: 'A-CBA',
        label: 'Cancelled by Agency'
      }), Em.Object.create({
        id: 'A-CDA',
        label: 'Cancelled Duplicate Account'
      }), Em.Object.create({
        id: 'A-CDE',
        label: 'Cancelled Data Load Error'
      }), Em.Object.create({
        id: 'A-CII',
        label: 'Cancelled due to incomplete information'
      }), Em.Object.create({
        id: 'A-COB',
        label: 'Cancelled Out of Business'
      }), Em.Object.create({
        id: 'A-CPF',
        label: 'Cancelled Possible Fraud'
      }), Em.Object.create({
        id: 'A-CPP',
        label: 'Cancelled Paid Prior to Placement'
      })
    ]
  });

  App.DataFilterController = App.LookupDataController.extend({
    content: [
      Em.Object.create({
        name: 'Active',
        value: 'active'
      }), Em.Object.create({
        name: 'Open',
        value: 'open'
      }), Em.Object.create({
        name: 'All',
        value: 'all'
      })
    ]
  });
  
});
window.require.register("controllers/noteController", function(exports, require, module) {
  App.NoteController = Em.ObjectController.extend({
    needs: ['debtorAccount', 'actionCodes', 'resultCodes'],
    labelActionCode: (function() {
      var actionCode;
      actionCode = this.get('controllers.actionCodes').findProperty('id', this.get('actionCode'));
      if (actionCode === null || actionCode === void 0) {
        return this.get('actionCode');
      }
      return actionCode.value;
    }).property('actionCode'),
    actions: {
      close: function() {
        return this.transitionToRoute('debtorAccount');
      }
    }
  });
  
});
window.require.register("controllers/notesController", function(exports, require, module) {
  App.NotesController = App.ColumnSorterController.extend({
    needs: ['actionCodes', 'debtor'],
    columns: (function() {
      return [
        Em.Object.create({
          column: 'time'
        }), Em.Object.create({
          column: 'actionCode'
        }), Em.Object.create({
          column: 'resultCode'
        }), Em.Object.create({
          column: 'message'
        })
      ];
    }).property(),
    loaded: (function() {
      this.set('sortProperties', ['time']);
      return this.set('sortAscending', false);
    }).observes('content.@each'),
    addNote: function(note) {
      var id;
      id = note.id;
      if (typeof this._idCache[id] === 'undefined') {
        this.pushObject(note);
        return this._idCache[id] = note.id;
      }
    }
  });
  
});
window.require.register("controllers/personController", function(exports, require, module) {
  App.PersonController = App.EditObjectController.extend({
    needs: ['countries', 'relationships', 'titles', 'suffixes'],
    relationshipLoaded: (function() {
      return this.get('labelRelationship');
    }).observes('@controllers.relationships.isLoaded'),
    labelRelationship: (function() {
      var relationship;
      relationship = this.get('controllers.relationships.content').findProperty('idNum', this.get('relationship'));
      if (relationship === null || relationship === void 0) {
        return null;
      }
      return relationship.label;
    }).property('relationship'),
    actions: {
      setSelections: function() {
        this.get('controllers.countries').setSelectedByIdStr(this.get('country'));
        this.get('controllers.relationships').setSelectedByIdNum(this.get('relationship'));
        this.get('controllers.titles').setSelectedById(this.get('title'));
        return this.get('controllers.suffixes').setSelectedById(this.get('suffix'));
      },
      getSelections: function() {
        this.set('country', this.get('controllers.countries').getSelectedId());
        this.set('relationship', this.get('controllers.relationships').getSelectedId());
        this.set('title', this.get('controllers.titles').getSelectedId());
        return this.set('suffix', this.get('controllers.suffixes').getSelectedId());
      }
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
    actions: {
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

  Em.Handlebars.helper('toFixed', function(number, digits) {
    return number.toFixed(digits);
  });
  
});
window.require.register("helpers/pollster", function(exports, require, module) {
  App.Pollster = {
    start: function() {
      return this.timer = setInterval(this.onPoll.bind(this), 5000);
    },
    stop: function() {
      return clearInterval(this.timer);
    },
    onPoll: function() {
      return App.NotesController.refresh();
    }
  };
  
});
window.require.register("initialize", function(exports, require, module) {
  window.App = require('app');

  require('helpers/handlebarsHelpers');

  require('controllers/applicationController');

  require('controllers/helpers/columnItemController');

  require('controllers/helpers/columnSorterController');

  require('controllers/helpers/editObjectController');

  require('controllers/contactController');

  require('controllers/contactsController');

  require('controllers/debtorController');

  require('controllers/debtorsController');

  require('controllers/indexController');

  require('controllers/personsController');

  require('controllers/personController');

  require('controllers/employmentController');

  require('controllers/employmentsController');

  require('controllers/noteController');

  require('controllers/notesController');

  require('controllers/lookupDataController');

  require('models/client');

  require('models/contact');

  require('models/debtor');

  require('models/employment');

  require('models/note');

  require('models/person');

  require('models/relationship');

  require('models/country');

  require('models/phoneTypes');

  require('models/actionCode');

  require('models/resultCode');

  require('models/debtorAccount');

  require('models/indexClient');

  require('models/indexDebtor');

  require('models/debtorNote');

  require('routes/indexRoute');

  require('routes/debtorAccountRoute');

  require('routes/loadingRoute');

  require('templates/_well');

  require('templates/about');

  require('templates/application');

  require('templates/contact/_edit');

  require('templates/contact');

  require('templates/contacts');

  require('templates/contactDetail');

  require('templates/debtor/_edit');

  require('templates/debtor');

  require('templates/debtorDetail');

  require('templates/debtorAccount');

  require('templates/index');

  require('templates/person/_edit');

  require('templates/person');

  require('templates/persons');

  require('templates/employment/_edit');

  require('templates/employment');

  require('templates/employments');

  require('templates/note');

  require('templates/notes');

  require('templates/_cancellation');

  require('templates/modal_layout');

  require('templates/empty');

  require('templates/_confirmation');

  require('templates/_hold');

  require('templates/_cancellationSuccess');

  require('templates/_holdSuccess');

  require('templates/_processing');

  require('templates/loading');

  require('views/scrollView');

  require('views/datePickerField');

  require('views/modalView');

  require('views/confirmationView');

  require('views/radioButtonView');

  require('store/webapi/serializer');

  require('store/webapi/adapter');

  require('store/RESTfulAdapter');

  App.AJAX_LOADER_IMG = "/images/ajax_loader.gif";

  App.DEFAULT_CSS_TRANSITION_DURATION_MS = 250;

  App.Router.map(function() {
    this.resource('index', {
      path: '/:client_id'
    });
    return this.resource('debtorAccount', {
      path: 'account/:debtor_account_id'
    }, function() {
      return this.resource('debtor', {
        path: 'debtor/:debtor_id'
      }, function() {
        return this.resource('contact', {
          path: 'contact/:contact_id'
        }, this.resource('person', {
          path: 'person/:person_id'
        }, this.resource('employment', {
          path: 'employment/:employment_id'
        }, this.resource('note', {
          path: 'note/:note_id'
        }))));
      });
    });
  });
  
});
window.require.register("models/actionCode", function(exports, require, module) {
  App.ActionCode = DS.Model.extend({
    value: DS.attr('string'),
    description: DS.attr('string')
  });
  
});
window.require.register("models/cancellation", function(exports, require, module) {
  App.Cancellation = DS.Model.extend({
    debtorId: DS.attr('number'),
    actionCode: DS.attr('string'),
    resultCode: DS.attr('string')
  });
  
});
window.require.register("models/client", function(exports, require, module) {
  App.Client = DS.Model.extend({
    clientId: DS.attr('number'),
    legacyId: DS.attr('string'),
    description: DS.attr('string'),
    debtorAccounts: DS.hasMany('App.DebtorAccount')
  });
  
});
window.require.register("models/contact", function(exports, require, module) {
  App.Contact = DS.Model.extend({
    type: DS.attr('number'),
    typeLabel: DS.attr('string'),
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
    label: DS.attr('string'),
    idStr: (function() {
      return this.get('id') + '';
    }).property('id')
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
    dob: DS.attr('isodate'),
    ssn: DS.attr('string'),
    ein: DS.attr('string'),
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
    debtorAccount: DS.belongsTo('App.DebtorAccount'),
    contacts: DS.hasMany('App.Contact'),
    persons: DS.hasMany('App.Person'),
    employments: DS.hasMany('App.Employment'),
    notes: DS.hasMany('App.Note'),
    fullName: (function() {
      var first, last, middle;
      first = this.get('firstName') || '';
      middle = this.get('middleName') || '';
      last = this.get('lastName') || '';
      return first + ' ' + middle + ' ' + last;
    }).property('firstName', 'lastName', 'middleName'),
    fullNameWithTitle: (function() {
      var first, last, middle, suffix, title;
      title = this.get('title') || '';
      first = this.get('firstName') || '';
      middle = this.get('middleName') || '';
      last = this.get('lastName') || '';
      suffix = this.get('suffix') || '';
      return title + ' ' + first + ' ' + middle + ' ' + last + ' ' + suffix;
    }).property('title', 'firstName', 'lastName', 'middleName', 'suffix'),
    fullAddress: (function() {
      var address1, address2, address3, city, state, zip;
      address1 = this.get('address1') || '';
      address2 = this.get('address2') || '';
      address3 = this.get('address3') || '';
      city = this.get('city') || '';
      state = this.get('state') || '';
      zip = this.get('zip') || '';
      return address1 + ' ' + address2 + ' ' + address3 + city + ' ' + state + ' ' + zip;
    }).property('address1', 'address2', 'address3', 'city', 'state', 'zip'),
    refresh: function() {
      var self;
      self = this;
      return self.reload();
    }
  });
  
});
window.require.register("models/debtorAccount", function(exports, require, module) {
  App.DebtorAccount = DS.Model.extend({
    debtorId: DS.attr('number'),
    agencyId: DS.attr('number'),
    creditorId: DS.attr('number'),
    client: DS.belongsTo('App.Client'),
    debtor: DS.belongsTo('App.Debtor')
  });
  
});
window.require.register("models/debtorNote", function(exports, require, module) {
  App.DebtorNote = DS.Model.extend({
    time: DS.attr('date'),
    actionCode: DS.attr('number'),
    resultCode: DS.attr('number'),
    message: DS.attr('string'),
    userid: DS.attr('number'),
    clientId: DS.attr('number'),
    debtorId: DS.attr('number')
  });
  
});
window.require.register("models/employment", function(exports, require, module) {
  App.Employment = DS.Model.extend({
    association: DS.attr('number'),
    name: DS.attr('string'),
    monthlyNetIncome: DS.attr('number'),
    position: DS.attr('string'),
    hireDate: DS.attr('isodate'),
    phone: DS.attr('string'),
    website: DS.attr('string'),
    status: DS.attr('number'),
    source: DS.attr('number'),
    jobTitle: DS.attr('string'),
    terminationDate: DS.attr('isodate'),
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
window.require.register("models/indexClient", function(exports, require, module) {
  App.IndexClient = DS.Model.extend({
    clientId: DS.attr('number'),
    legacyId: DS.attr('string'),
    description: DS.attr('string'),
    indexDebtors: DS.hasMany('App.IndexDebtor')
  });
  
});
window.require.register("models/indexDebtor", function(exports, require, module) {
  App.IndexDebtor = DS.Model.extend({
    debtorId: DS.attr('number'),
    title: DS.attr('string'),
    lastName: DS.attr('string'),
    firstName: DS.attr('string'),
    middleName: DS.attr('string'),
    suffix: DS.attr('string'),
    totalOriginalBalance: DS.attr('number'),
    currentBalance: DS.attr('number'),
    totalPayment: DS.attr('number'),
    clientId: DS.attr('number'),
    status: DS.attr('string'),
    indexClient: DS.belongsTo('App.IndexClient'),
    fullName: (function() {
      var first, last, middle;
      first = this.get('firstName') || '';
      middle = this.get('middleName') || '';
      last = this.get('lastName') || '';
      return first + ' ' + middle + ' ' + last;
    }).property('firstName', 'lastName', 'middleName'),
    fullNameWithTitle: (function() {
      var first, last, middle, suffix, title;
      title = this.get('title') || '';
      first = this.get('firstName') || '';
      middle = this.get('middleName') || '';
      last = this.get('lastName') || '';
      suffix = this.get('suffix') || '';
      return title + ' ' + first + ' ' + middle + ' ' + last + ' ' + suffix;
    }).property('title', 'firstName', 'lastName', 'middleName', 'suffix'),
    originalBalance: (function() {
      var balance, formatted;
      balance = this.get('totalOriginalBalance');
      formatted = parseFloat(balance, 10).toFixed(2);
      return '$' + formatted;
    }).property('totalOriginalBalance'),
    currBalance: (function() {
      var balance, formatted;
      balance = this.get('currentBalance');
      formatted = parseFloat(balance, 10).toFixed(2);
      return '$' + formatted;
    }).property('currentBalance'),
    payment: (function() {
      var formatted, payment;
      payment = this.get('totalPayment');
      formatted = parseFloat(payment, 10).toFixed(2);
      return '$' + formatted;
    }).property('totalPayment')
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
    debtor: DS.belongsTo('App.Debtor'),
    fullName: (function() {
      var first, last, middle;
      first = this.get('firstName') || '';
      middle = this.get('middleName') || '';
      last = this.get('lastName') || '';
      return first + ' ' + middle + ' ' + last;
    }).property('firstName', 'lastName', 'middleName'),
    fullNameWithTitle: (function() {
      var first, last, middle, suffix, title;
      title = this.get('title') || '';
      first = this.get('firstName') || '';
      middle = this.get('middleName') || '';
      last = this.get('lastName') || '';
      suffix = this.get('suffix') || '';
      return title + ' ' + first + ' ' + middle + ' ' + last + ' ' + suffix;
    }).property('title', 'firstName', 'lastName', 'middleName', 'suffix')
  });
  
});
window.require.register("models/phoneTypes", function(exports, require, module) {
  App.PhoneTypes = DS.Model.extend({
    label: DS.attr('string')
  });
  
});
window.require.register("models/relationship", function(exports, require, module) {
  App.Relationship = DS.Model.extend({
    label: DS.attr('string'),
    idNum: (function() {
      return parseInt(this.get('id'));
    }).property('id')
  });
  
});
window.require.register("models/resultCode", function(exports, require, module) {
  App.ResultCode = DS.Model.extend({
    value: DS.attr('string'),
    description: DS.attr('string')
  });
  
});
window.require.register("routes/clientRoute", function(exports, require, module) {
  App.ClientRoute = Em.Route.extend({
    model: function(params) {
      return App.Client.find(params.client_id);
    },
    setupController: function(controller, model) {
      return controller.set('model', model);
    }
  });
  
});
window.require.register("routes/debtorAccountRoute", function(exports, require, module) {
  App.DebtorAccountRoute = Em.Route.extend({
    observesParameters: ['clientId', 'userId', 'canEditDebtor', 'feePercentage'],
    model: function(params) {
      return App.DebtorAccount.find(params.debtor_account_id);
    },
    setupController: function(controller, model, queryParams) {
      controller.set('model', model);
      this.controllerFor('application').set('params', this.get('queryParameters'));
      this.controllerFor('countries').set('content', App.Country.find());
      this.controllerFor('relationships').set('content', App.Relationship.find());
      this.controllerFor('actionCodes').set('content', App.ActionCode.find());
      return this.controllerFor('resultCodes').set('content', App.ResultCode.find());
    }
  });
  
});
window.require.register("routes/indexRoute", function(exports, require, module) {
  App.IndexRoute = Em.Route.extend({
    observesParameters: ['userId', 'canEditDebtor', 'feePercentage'],
    model: function(params) {
      return App.IndexClient.find(params.client_id);
    },
    setupController: function(controller, model, queryParams) {
      controller.set('model', model.get('indexDebtors'));
      return this.controllerFor('application').set('params', Em.Object.create({
        clientId: model.get('clientId'),
        userId: this.get('queryParameters.userId'),
        canEditDebtor: this.get('queryParameters.canEditDebtor'),
        feePercentage: this.get('queryParameters.feePercentage')
      }));
    }
  });
  
});
window.require.register("routes/loadingRoute", function(exports, require, module) {
  App.LoadingRoute = Em.Route.extend();
  
});
window.require.register("store/RESTfulAdapter", function(exports, require, module) {
  App.Store = DS.Store.extend({
    adapter: DS.WebAPIAdapter.extend({
      url: App.serverUrl,
      namespace: App.serverNamespace,
      bulkCommit: false,
      antiForgeryTokenSelector: '#antiForgeryToken',
      plurals: {
        'country': 'countries',
        'cancellation': 'cancellation'
      },
      pluralize: function(name) {
        var plurals;
        plurals = this.get('plurals');
        return (plurals && plurals[name]) || name + 's';
      }
    })
  });

  DS.WebAPIAdapter.map('App.IndexClient', {
    indexDebtors: {
      embedded: 'load'
    }
  });

  DS.WebAPIAdapter.map('App.Client', {
    debtorAccounts: {
      embedded: 'load'
    }
  });

  DS.WebAPIAdapter.map('App.DebtorAccount', {
    debtor: {
      embedded: 'load'
    }
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
      embedded: 'load'
    }
  });

  DS.WebAPIAdapter.configure('App.IndexClient', {
    sideloadAs: 'indexClient',
    primaryKey: 'id'
  });

  DS.WebAPIAdapter.configure('App.IndexDebtor', {
    sideloadAs: 'indexDebtor',
    primaryKey: 'id'
  });

  DS.WebAPIAdapter.configure('App.Client', {
    sideloadAs: 'client',
    primaryKey: 'id'
  });

  DS.WebAPIAdapter.configure('App.DebtorAccount', {
    sideloadAs: 'debtorAccount',
    primaryKey: 'id'
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

  DS.WebAPIAdapter.registerTransform("isodate", {
    deserialize: function(serialized) {
      return serialized;
    },
    serialize: function(deserialized) {
      return deserialized;
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
window.require.register("templates/_cancellation", function(exports, require, module) {
  Ember.TEMPLATES["_cancellation"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
    var buffer = '', hashTypes, hashContexts, escapeExpression=this.escapeExpression;


    data.buffer.push("<div class=\"modal\"><div class=\"modal-header\"><button class=\"close\" ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "cancellation", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">&times;</button><h5>Account Cancellation</h5></div><div class=\"model-body\"><div class=\"form form-horizontal\"><div class=\"control-group\"><label class=\"control-label\">Cancellation Code</label><div class=\"controls\">");
    hashContexts = {'contentBinding': depth0,'optionLabelPath': depth0,'optionValuePath': depth0,'selectionBinding': depth0};
    hashTypes = {'contentBinding': "STRING",'optionLabelPath': "STRING",'optionValuePath': "STRING",'selectionBinding': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.Select", {hash:{
      'contentBinding': ("controllers.cancellationCodes"),
      'optionLabelPath': ("content.label"),
      'optionValuePath': ("content.id"),
      'selectionBinding': ("controllers.cancellationCodes.selected")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div></div></div></div><div class=\"modal-footer\"><button class=\"btn btn-danger\" ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "sendCancellation", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">Send Cancellation</button><button class=\"btn\" ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "cancellation", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">Abort</button></div></div>");
    return buffer;
    
  });module.exports = module.id;
});
window.require.register("templates/_cancellationSuccess", function(exports, require, module) {
  Ember.TEMPLATES["_cancellationSuccess"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
    var buffer = '', hashTypes, hashContexts, escapeExpression=this.escapeExpression;


    data.buffer.push("<div class=\"modal\"><div class=\"modal-header\"><h5>Cancellation</h5></div><div class=\"modal-body\"><h6>Account Cancelled Successfully</h6></div><div class=\"modal-footer\"><button class=\"btn\" ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "closeCancelSuccess", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">Close</button></div></div>");
    return buffer;
    
  });module.exports = module.id;
});
window.require.register("templates/_confirmation", function(exports, require, module) {
  Ember.TEMPLATES["_confirmation"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
    var buffer = '', hashContexts, hashTypes, escapeExpression=this.escapeExpression;


    data.buffer.push("<div class=\"modal-dialog\" ");
    hashContexts = {'id': depth0};
    hashTypes = {'id': "STRING"};
    data.buffer.push(escapeExpression(helpers.bindAttr.call(depth0, {hash:{
      'id': ("controller.confirmationId")
    },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(" style=\"display:none;z-index:1050;\"><div class=\"modal-body\"><p>Do you want to delete this record?</p><span class=\"pull-right\"><button class=\"btn btn-small\" ");
    hashContexts = {'target': depth0};
    hashTypes = {'target': "STRING"};
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "deleteRecord", "", {hash:{
      'target': ("controller")
    },contexts:[depth0,depth0],types:["ID","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">Yes</button><button class=\"btn btn-primary btn-small\" ");
    hashContexts = {'target': depth0};
    hashTypes = {'target': "STRING"};
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "close", {hash:{
      'target': ("view")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">No</button></span></div></div>");
    return buffer;
    
  });module.exports = module.id;
});
window.require.register("templates/_hold", function(exports, require, module) {
  Ember.TEMPLATES["_hold"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
    var buffer = '', hashTypes, hashContexts, escapeExpression=this.escapeExpression;


    data.buffer.push("<div class=\"modal\"><div class=\"modal-header\"><button class=\"close\" ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "holdAccount", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">&times;</button><h5>Hold Account</h5></div><div class=\"modal-body\"><h6>Do you want to put a hold on this account?</h6></div><div class=\"modal-footer\"><button class=\"btn btn-warning\" ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "sendHold", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">Hold Account</button><button class=\"btn\" ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "holdAccount", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">Abort</button></div></div>");
    return buffer;
    
  });module.exports = module.id;
});
window.require.register("templates/_holdSuccess", function(exports, require, module) {
  Ember.TEMPLATES["_holdSuccess"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
    var buffer = '', hashTypes, hashContexts, escapeExpression=this.escapeExpression;


    data.buffer.push("<div class=\"modal\"><div class=\"modal-header\"><h5>Hold Account</h5></div><div class=\"modal-body\"><h6>Account Hold Successfully</h6></div><div class=\"modal-footer\"><button class=\"btn\" ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "closeCancelSuccess", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">Close</button></div></div>");
    return buffer;
    
  });module.exports = module.id;
});
window.require.register("templates/_processing", function(exports, require, module) {
  Ember.TEMPLATES["_processing"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
    var buffer = '', hashTypes, hashContexts, escapeExpression=this.escapeExpression;


    data.buffer.push("<div class=\"modal\"><div class=\"modal-body\"><div class=\"pagination-centered\"><img src=\"");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.unbound.call(depth0, "App.AJAX_LOADER_IMG", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("\" alt=\"loading\" /></div><div class=\"pagination-centered\"><h4>Processing...</h4></div></div></div>");
    return buffer;
    
  });module.exports = module.id;
});
window.require.register("templates/_well", function(exports, require, module) {
  Ember.TEMPLATES["_well"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
    


    data.buffer.push("<div class=\"well\"><h3>Welcome to the 'Debtor to CRM Project'</h3><p>This is a partial.</p><p>Find me in <code>app/templates/_well.emblem</code></p></div>");
    
  });module.exports = module.id;
});
window.require.register("templates/about", function(exports, require, module) {
  Ember.TEMPLATES["about"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
    var buffer = '', stack1, hashTypes, hashContexts, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


    data.buffer.push("<h2>About</h2><p>Find me in <code>templates/about.emblem</code></p>");
    hashTypes = {};
    hashContexts = {};
    options = {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
    data.buffer.push(escapeExpression(((stack1 = helpers.partial || depth0.partial),stack1 ? stack1.call(depth0, "well", options) : helperMissing.call(depth0, "partial", "well", options))));
    return buffer;
    
  });module.exports = module.id;
});
window.require.register("templates/application", function(exports, require, module) {
  Ember.TEMPLATES["application"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
    var buffer = '', hashTypes, hashContexts, escapeExpression=this.escapeExpression;


    data.buffer.push("<div class=\"container-fluid\"><div id=\"page\">");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "outlet", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div></div>");
    return buffer;
    
  });module.exports = module.id;
});
window.require.register("templates/contact", function(exports, require, module) {
  Ember.TEMPLATES["contact"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
    var buffer = '', stack1, hashTypes, hashContexts, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


    data.buffer.push("<div class=\"row-fluid\">");
    hashTypes = {};
    hashContexts = {};
    options = {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
    data.buffer.push(escapeExpression(((stack1 = helpers.partial || depth0.partial),stack1 ? stack1.call(depth0, "contact/edit", options) : helperMissing.call(depth0, "partial", "contact/edit", options))));
    data.buffer.push("</div>");
    return buffer;
    
  });module.exports = module.id;
});
window.require.register("templates/contact/_edit", function(exports, require, module) {
  Ember.TEMPLATES["contact/_edit"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
    var buffer = '', hashTypes, hashContexts, escapeExpression=this.escapeExpression;


    data.buffer.push("<div class=\"modal\"><div class=\"modal-header\"><button class=\"close\" ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "cancelEditing", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">&times;</button><h5>Contact Phone Record</h5></div><div class=\"modal-body\"><div class=\"form form-horizontal\"><div class=\"control-group\"><label class=\"control-label\">Type </label><div class=\"controls\">");
    hashContexts = {'id': depth0,'contentBinding': depth0,'optionLabelPath': depth0,'optionValuePath': depth0,'selectionBinding': depth0,'prompt': depth0};
    hashTypes = {'id': "STRING",'contentBinding': "STRING",'optionLabelPath': "STRING",'optionValuePath': "STRING",'selectionBinding': "STRING",'prompt': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.Select", {hash:{
      'id': ("phoneTypes"),
      'contentBinding': ("controllers.phoneTypes"),
      'optionLabelPath': ("content.label"),
      'optionValuePath': ("content.id"),
      'selectionBinding': ("controllers.phoneTypes.selected"),
      'prompt': ("Type ...")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label\">Country</label><div class=\"controls\">");
    hashContexts = {'contentBinding': depth0,'optionLabelPath': depth0,'optionValuePath': depth0,'selectionBinding': depth0,'prompt': depth0};
    hashTypes = {'contentBinding': "STRING",'optionLabelPath': "STRING",'optionValuePath': "STRING",'selectionBinding': "STRING",'prompt': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.Select", {hash:{
      'contentBinding': ("controllers.countries"),
      'optionLabelPath': ("content.label"),
      'optionValuePath': ("content.id"),
      'selectionBinding': ("controllers.countries.selected"),
      'prompt': ("Country ...")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label\">Phone</label><div class=\"controls\">");
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("phone"),
      'placeholder': ("Phone")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label\">Extension</label><div class=\"controls\">");
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("extension"),
      'placeholder': ("Extension")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label\">Score</label><div class=\"controls\">");
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("score"),
      'placeholder': ("Score")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label\">Status</label><div class=\"controls\">");
    hashContexts = {'contentBinding': depth0,'optionLabelPath': depth0,'optionValuePath': depth0,'selectionBinding': depth0,'prompt': depth0};
    hashTypes = {'contentBinding': "STRING",'optionLabelPath': "STRING",'optionValuePath': "STRING",'selectionBinding': "STRING",'prompt': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.Select", {hash:{
      'contentBinding': ("controllers.phoneStatuses"),
      'optionLabelPath': ("content.label"),
      'optionValuePath': ("content.id"),
      'selectionBinding': ("controllers.phoneStatuses.selected"),
      'prompt': ("Status ...")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label\">Source</label><div class=\"controls\">");
    hashContexts = {'contentBinding': depth0,'optionLabelPath': depth0,'optionValuePath': depth0,'selectionBinding': depth0,'prompt': depth0};
    hashTypes = {'contentBinding': "STRING",'optionLabelPath': "STRING",'optionValuePath': "STRING",'selectionBinding': "STRING",'prompt': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.Select", {hash:{
      'contentBinding': ("controllers.sources"),
      'optionLabelPath': ("content.label"),
      'optionValuePath': ("content.id"),
      'selectionBinding': ("controllers.sources.selected"),
      'prompt': ("Source ...")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label\">Consent</label><div class=\"controls\">");
    hashContexts = {'contentBinding': depth0,'optionLabelPath': depth0,'optionValuePath': depth0,'selectionBinding': depth0,'prompt': depth0};
    hashTypes = {'contentBinding': "STRING",'optionLabelPath': "STRING",'optionValuePath': "STRING",'selectionBinding': "STRING",'prompt': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.Select", {hash:{
      'contentBinding': ("controllers.yesNo"),
      'optionLabelPath': ("content.label"),
      'optionValuePath': ("content.id"),
      'selectionBinding': ("controllers.yesNo.selected"),
      'prompt': ("Consent ...")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div></div></div></div><div class=\"modal-footer\"><button class=\"btn btn-success\" ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "doneEditing", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">Done</button><button class=\"btn\" ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "cancelEditing", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">Cancel</button></div></div>");
    return buffer;
    
  });module.exports = module.id;
});
window.require.register("templates/contactDetail", function(exports, require, module) {
  Ember.TEMPLATES["contactDetail"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
    var buffer = '', hashTypes, hashContexts, escapeExpression=this.escapeExpression;


    data.buffer.push("<button class=\"btn\" ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "delete", "", {hash:{},contexts:[depth0,depth0],types:["ID","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">-</button><div class=\"span2\"><a ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "openModal", "", {hash:{},contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(" href=\"#\">");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "phone", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</a></div><div class=\"span5\">");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "type", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(" ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "status", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><div class=\"span5\">");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "extension", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><hr />");
    return buffer;
    
  });module.exports = module.id;
});
window.require.register("templates/contacts", function(exports, require, module) {
  Ember.TEMPLATES["contacts"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
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
    data.buffer.push(escapeExpression(((stack1 = helpers.humanize || depth0.humanize),stack1 ? stack1.call(depth0, "column", options) : helperMissing.call(depth0, "humanize", "column", options))));
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
    
    var buffer = '', stack1, stack2, hashContexts, hashTypes, options;
    data.buffer.push("<tr><td><button class=\"btn btn-mini\" ");
    hashContexts = {'id': depth0};
    hashTypes = {'id': "STRING"};
    data.buffer.push(escapeExpression(helpers.bindAttr.call(depth0, {hash:{
      'id': ("id")
    },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">-</button>");
    hashContexts = {'contentBinding': depth0};
    hashTypes = {'contentBinding': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.ConfirmationView", {hash:{
      'contentBinding': ("this")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</td><td>");
    hashTypes = {};
    hashContexts = {};
    options = {hash:{},inverse:self.program(4, program4, data),fn:self.program(9, program9, data),contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
    stack2 = ((stack1 = helpers.linkTo || depth0.linkTo),stack1 ? stack1.call(depth0, "contact", "", options) : helperMissing.call(depth0, "linkTo", "contact", "", options));
    if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
    data.buffer.push("</td><td>");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "extension", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</td><td>");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "labelPhoneType", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</td><td>");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "labelPhoneStatus", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</td></tr>");
    return buffer;
    }
  function program9(depth0,data) {
    
    var hashTypes, hashContexts;
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "phone", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    }

    data.buffer.push("<div class=\"row-fluid\"><table class=\"table table-striped row-border\"><thead><tr><th><button class=\"btn btn-primary btn-mini\" ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "create", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">+</button></th>");
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
    data.buffer.push("</tbody></table></div>");
    return buffer;
    
  });module.exports = module.id;
});
window.require.register("templates/datepicker", function(exports, require, module) {
  Ember.TEMPLATES["datepicker"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
    var buffer = '';


    return buffer;
    
  });module.exports = module.id;
});
window.require.register("templates/debtor", function(exports, require, module) {
  Ember.TEMPLATES["debtor"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
    var buffer = '', stack1, stack2, hashTypes, hashContexts, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    var stack1, hashTypes, hashContexts, options;
    hashTypes = {};
    hashContexts = {};
    options = {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
    data.buffer.push(escapeExpression(((stack1 = helpers.partial || depth0.partial),stack1 ? stack1.call(depth0, "debtor/edit", options) : helperMissing.call(depth0, "partial", "debtor/edit", options))));
    }

  function program3(depth0,data) {
    
    var buffer = '', hashTypes, hashContexts;
    data.buffer.push("<button class=\"btn btn-small\" ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "edit", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(" ");
    hashContexts = {'disabled': depth0};
    hashTypes = {'disabled': "STRING"};
    data.buffer.push(escapeExpression(helpers.bindAttr.call(depth0, {hash:{
      'disabled': ("disableEdit")
    },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">Edit</button>");
    return buffer;
    }

  function program5(depth0,data) {
    
    var stack1, hashTypes, hashContexts, options;
    hashTypes = {};
    hashContexts = {};
    options = {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
    data.buffer.push(escapeExpression(((stack1 = helpers.partial || depth0.partial),stack1 ? stack1.call(depth0, "processing", options) : helperMissing.call(depth0, "partial", "processing", options))));
    }

  function program7(depth0,data) {
    
    var buffer = '';
    return buffer;
    }

  function program9(depth0,data) {
    
    var stack1, hashTypes, hashContexts, options;
    hashTypes = {};
    hashContexts = {};
    options = {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
    data.buffer.push(escapeExpression(((stack1 = helpers.partial || depth0.partial),stack1 ? stack1.call(depth0, "cancellation", options) : helperMissing.call(depth0, "partial", "cancellation", options))));
    }

  function program11(depth0,data) {
    
    var stack1, hashTypes, hashContexts, options;
    hashTypes = {};
    hashContexts = {};
    options = {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
    data.buffer.push(escapeExpression(((stack1 = helpers.partial || depth0.partial),stack1 ? stack1.call(depth0, "hold", options) : helperMissing.call(depth0, "partial", "hold", options))));
    }

  function program13(depth0,data) {
    
    var stack1, hashTypes, hashContexts, options;
    hashTypes = {};
    hashContexts = {};
    options = {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
    data.buffer.push(escapeExpression(((stack1 = helpers.partial || depth0.partial),stack1 ? stack1.call(depth0, "cancellationSuccess", options) : helperMissing.call(depth0, "partial", "cancellationSuccess", options))));
    }

  function program15(depth0,data) {
    
    var stack1, hashTypes, hashContexts, options;
    hashTypes = {};
    hashContexts = {};
    options = {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
    data.buffer.push(escapeExpression(((stack1 = helpers.partial || depth0.partial),stack1 ? stack1.call(depth0, "holdSuccess", options) : helperMissing.call(depth0, "partial", "holdSuccess", options))));
    }

    data.buffer.push("<div class=\"container-fluid\"><div class=\"row-fluid\"><div class=\"span12\"><address><h3>");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "title", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(" ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "fullName", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(" ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "suffix", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("<div class=\"span4 pull-right\"><button class=\"btn btn-primary btn-small\" ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "close", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">Close</button>");
    hashTypes = {};
    hashContexts = {};
    stack1 = helpers['if'].call(depth0, "isEditing", {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</div></h3><h4 ");
    hashContexts = {'': depth0};
    hashTypes = {'': "STRING"};
    data.buffer.push(escapeExpression(helpers.bindAttr.call(depth0, {hash:{
      '': ("ssn")
    },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("></h4><hr /><div class=\"intro\"><div class=\"span6\"><p>Address</p><h6>");
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
    data.buffer.push("</h6></div><div class=\"span6\"><p>Email</p><h5 ");
    hashContexts = {'': depth0};
    hashTypes = {'': "STRING"};
    data.buffer.push(escapeExpression(helpers.bindAttr.call(depth0, {hash:{
      '': ("email")
    },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("></h5></div></div><div class=\"span4 pull-right\"><button class=\"btn btn-danger btn-small\" ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "cancellation", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">Cancel Account</button><button class=\"btn btn-warning btn-small\" ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "holdAccount", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">Hold Account</button><button class=\"btn btn-success btn-small\" ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "makePayment", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">Make Payment</button></div></address></div></div><hr /><div id=\"contacts\" class=\"accordion\"><div class=\"accordion-group\"><div class=\"accordion-heading\"><a class=\"accordion-toggle\" data-toggle=\"collapse\" data-parent=\"#contacts\" href=\"#collapseContacts\"><h5>Contact Phone Records</h5></a></div><div id=\"collapseContacts\" class=\"accordion-body collapse in\"><div class=\"accordion-inner\"><div class=\"row-fluid\"><div class=\"span12\">");
    hashTypes = {};
    hashContexts = {};
    options = {hash:{},contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
    data.buffer.push(escapeExpression(((stack1 = helpers.render || depth0.render),stack1 ? stack1.call(depth0, "contacts", "contacts", options) : helperMissing.call(depth0, "render", "contacts", "contacts", options))));
    data.buffer.push("</div></div></div></div></div></div><div id=\"persons\" class=\"accordion\"><div class=\"accordion-group\"><div class=\"accordion-heading\"><a class=\"accordion-toggle\" data-toggle=\"collapse\" data-parent=\"#persons\" href=\"#collapsePersons\"><h5>Related Persons</h5></a></div><div id=\"collapsePersons\" class=\"accordion-body collapse in\"><div class=\"accordion-inner\"><div class=\"row-fluid\"><div class=\"span12\">");
    hashTypes = {};
    hashContexts = {};
    options = {hash:{},contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
    data.buffer.push(escapeExpression(((stack1 = helpers.render || depth0.render),stack1 ? stack1.call(depth0, "persons", "persons", options) : helperMissing.call(depth0, "render", "persons", "persons", options))));
    data.buffer.push("</div></div></div></div></div></div><div id=\"employments\" class=\"accordion\"><div class=\"accordion-group\"><div class=\"accordion-heading\"><a class=\"accordion-toggle\" data-toggle=\"collapse\" data-parent=\"#employments\" href=\"#collapseEmployments\"><h5>Employment Records</h5></a></div><div id=\"collapseEmployments\" class=\"accordion-body collapse in\"><div class=\"accordion-inner\"><div class=\"row-fluid\"><div class=\"span12\">");
    hashTypes = {};
    hashContexts = {};
    options = {hash:{},contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
    data.buffer.push(escapeExpression(((stack1 = helpers.render || depth0.render),stack1 ? stack1.call(depth0, "employments", "employments", options) : helperMissing.call(depth0, "render", "employments", "employments", options))));
    data.buffer.push("</div></div></div></div></div></div><div id=\"notes\" class=\"accordion\"><div class=\"accordion-group\"><div class=\"accordion-heading\"><a class=\"accordion-toggle\" data-toggle=\"collapse\" data-parent=\"#notes\" href=\"#collapseNotes\"><h5>Historical Events</h5></a></div><div id=\"collapseNotes\" class=\"accordion-body collapse in\"><div class=\"accordion-inner\"><div class=\"row-fluid\"><div class=\"span12\">");
    hashTypes = {};
    hashContexts = {};
    options = {hash:{},contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
    data.buffer.push(escapeExpression(((stack1 = helpers.render || depth0.render),stack1 ? stack1.call(depth0, "notes", "notes", options) : helperMissing.call(depth0, "render", "notes", "notes", options))));
    data.buffer.push("</div></div></div></div></div></div>");
    hashTypes = {};
    hashContexts = {};
    stack2 = helpers['if'].call(depth0, "processing", {hash:{},inverse:self.program(7, program7, data),fn:self.program(5, program5, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
    if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
    hashTypes = {};
    hashContexts = {};
    stack2 = helpers['if'].call(depth0, "toCancel", {hash:{},inverse:self.program(7, program7, data),fn:self.program(9, program9, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
    if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
    hashTypes = {};
    hashContexts = {};
    stack2 = helpers['if'].call(depth0, "toHold", {hash:{},inverse:self.program(7, program7, data),fn:self.program(11, program11, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
    if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
    hashTypes = {};
    hashContexts = {};
    stack2 = helpers['if'].call(depth0, "cancellationSuccess", {hash:{},inverse:self.program(7, program7, data),fn:self.program(13, program13, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
    if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
    hashTypes = {};
    hashContexts = {};
    stack2 = helpers['if'].call(depth0, "holdSuccess", {hash:{},inverse:self.program(7, program7, data),fn:self.program(15, program15, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
    if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "outlet", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div>");
    return buffer;
    
  });module.exports = module.id;
});
window.require.register("templates/debtor/_edit", function(exports, require, module) {
  Ember.TEMPLATES["debtor/_edit"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
    var buffer = '', hashTypes, hashContexts, escapeExpression=this.escapeExpression;


    data.buffer.push("<div class=\"modal\"><div class=\"modal-header\"><button class=\"close\" ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "cancelEditing", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">&times;</button><h5>Debtor Record</h5></div><div class=\"modal-body\"><div class=\"form form-horizontal\"><div class=\"control-group\"><label class=\"control-label\">Type </label><div class=\"controls\">");
    hashContexts = {'contentBinding': depth0,'optionLabelPath': depth0,'optionValuePath': depth0,'selectionBinding': depth0};
    hashTypes = {'contentBinding': "STRING",'optionLabelPath': "STRING",'optionValuePath': "STRING",'selectionBinding': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.Select", {hash:{
      'contentBinding': ("controllers.consumerFlags"),
      'optionLabelPath': ("content.label"),
      'optionValuePath': ("content.id"),
      'selectionBinding': ("controllers.consumerFlags.selected")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label\">Title</label><div class=\"controls\">");
    hashContexts = {'contentBinding': depth0,'optionLabelPath': depth0,'optionValuePath': depth0,'selectionBinding': depth0,'prompt': depth0};
    hashTypes = {'contentBinding': "STRING",'optionLabelPath': "STRING",'optionValuePath': "STRING",'selectionBinding': "STRING",'prompt': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.Select", {hash:{
      'contentBinding': ("controllers.titles"),
      'optionLabelPath': ("content.id"),
      'optionValuePath': ("content.id"),
      'selectionBinding': ("controllers.titles.selected"),
      'prompt': ("Title ...")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label\">Last Name</label><div class=\"controls\">");
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("lastName"),
      'placeholder': ("Last Name")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label\">First Name</label><div class=\"controls\">");
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("firstName"),
      'placeholder': ("First Name")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label\">Middle Name</label><div class=\"controls\">");
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("middleName"),
      'placeholder': ("Middle Name")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label\">Suffix</label><div class=\"controls\">");
    hashContexts = {'contentBinding': depth0,'optionLabelPath': depth0,'optionValuePath': depth0,'selectionBinding': depth0,'prompt': depth0};
    hashTypes = {'contentBinding': "STRING",'optionLabelPath': "STRING",'optionValuePath': "STRING",'selectionBinding': "STRING",'prompt': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.Select", {hash:{
      'contentBinding': ("controllers.suffixes"),
      'optionLabelPath': ("content.id"),
      'optionValuePath': ("content.id"),
      'selectionBinding': ("controllers.suffixes.selected"),
      'prompt': ("Suffix ...")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label\">Date of Birth</label><div class=\"controls\">");
    hashContexts = {'valueBinding': depth0};
    hashTypes = {'valueBinding': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.DatePickerField", {hash:{
      'valueBinding': ("dob")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label\">SSN</label><div class=\"controls\">");
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("ssn"),
      'placeholder': ("SSN")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label\">Martial Status</label><div class=\"controls\">");
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("maritalStatus"),
      'placeholder': ("Martial Status")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label\">Email</label><div class=\"controls\">");
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("email"),
      'placeholder': ("Email")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label\">Email Validity</label><div class=\"controls\">");
    hashContexts = {'contentBinding': depth0,'optionLabelPath': depth0,'optionValuePath': depth0,'selectionBinding': depth0,'prompt': depth0};
    hashTypes = {'contentBinding': "STRING",'optionLabelPath': "STRING",'optionValuePath': "STRING",'selectionBinding': "STRING",'prompt': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.Select", {hash:{
      'contentBinding': ("controllers.validInvalid"),
      'optionLabelPath': ("content.label"),
      'optionValuePath': ("content.id"),
      'selectionBinding': ("controllers.validInvalid.selected"),
      'prompt': ("Email Validity ...")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label\">Opt-In</label><div class=\"controls\">");
    hashContexts = {'contentBinding': depth0,'optionLabelPath': depth0,'optionValuePath': depth0,'selectionBinding': depth0,'prompt': depth0};
    hashTypes = {'contentBinding': "STRING",'optionLabelPath': "STRING",'optionValuePath': "STRING",'selectionBinding': "STRING",'prompt': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.Select", {hash:{
      'contentBinding': ("controllers.yesNo"),
      'optionLabelPath': ("content.label"),
      'optionValuePath': ("content.id"),
      'selectionBinding': ("controllers.yesNo.selected"),
      'prompt': ("Email Opt-in ...")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label\">Commerical Contact</label><div class=\"controls\">");
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("contact"),
      'placeholder': ("Commerical Contact")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label ms-crm-Field-Normal\">Country</label><div class=\"controls\">");
    hashContexts = {'contentBinding': depth0,'optionLabelPath': depth0,'optionValuePath': depth0,'selectionBinding': depth0,'prompt': depth0};
    hashTypes = {'contentBinding': "STRING",'optionLabelPath': "STRING",'optionValuePath': "STRING",'selectionBinding': "STRING",'prompt': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.Select", {hash:{
      'contentBinding': ("controllers.countries"),
      'optionLabelPath': ("content.label"),
      'optionValuePath': ("content.id"),
      'selectionBinding': ("controllers.countries.selected"),
      'prompt': ("Country ...")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label ms-crm-Field-Normal\">Address 1</label><div class=\"controls\">");
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("address1"),
      'placeholder': ("Address 1")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label ms-crm-Field-Normal\">Address 2</label><div class=\"controls\">");
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("address2"),
      'placeholder': ("Address 2")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label ms-crm-Field-Normal\">Address 3 </label><div class=\"controls\">");
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("address3"),
      'placeholder': ("Address 3")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label ms-crm-Field-Normal\">City </label><div class=\"controls\">");
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("city"),
      'placeholder': ("City")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label ms-crm-Field-Normal\">State </label><div class=\"controls\">");
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("state"),
      'placeholder': ("State")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label ms-crm-Field-Normal\">Zip Code </label><div class=\"controls\">");
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("zip"),
      'placeholder': ("Zip code")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label ms-crm-Field-Normal\">County </label><div class=\"controls\">");
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("county"),
      'placeholder': ("County")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label ms-crm-Field-Normal\">Driver License Issuer </label><div class=\"controls\">");
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("dlIssuer"),
      'placeholder': ("Driver License Issuer")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label ms-crm-Field-Normal\">Driver License Number</label><div class=\"controls\">");
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("dlNumber"),
      'placeholder': ("Driver License Number")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label ms-crm-Field-Normal\">Passport Number </label><div class=\"controls\">");
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("passport"),
      'placeholder': ("Passport Number")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label ms-crm-Field-Normal\">PIN </label><div class=\"controls\">");
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("pin"),
      'placeholder': ("PIN")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div></div></div></div><div class=\"modal-footer\"><button class=\"btn btn-success\" ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "doneEditing", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">Done</button><button class=\"btn\" ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "cancelEditing", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">Cancel</button></div></div>");
    return buffer;
    
  });module.exports = module.id;
});
window.require.register("templates/debtorAccount", function(exports, require, module) {
  Ember.TEMPLATES["debtorAccount"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
    var buffer = '', hashTypes, hashContexts, escapeExpression=this.escapeExpression;


    data.buffer.push("<h2><div class=\"lead\">Account Number - ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "id", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div></h2>");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "outlet", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    return buffer;
    
  });module.exports = module.id;
});
window.require.register("templates/debtorDetail", function(exports, require, module) {
  Ember.TEMPLATES["debtorDetail"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
    var buffer = '', stack1, stack2, hashTypes, hashContexts, options, escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

  function program1(depth0,data) {
    
    var hashTypes, hashContexts;
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "id", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    }

  function program3(depth0,data) {
    
    var buffer = '';
    return buffer;
    }

    data.buffer.push("<div class=\"row\"><div class=\"span2\">");
    hashTypes = {};
    hashContexts = {};
    options = {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
    stack2 = ((stack1 = helpers.linkTo || depth0.linkTo),stack1 ? stack1.call(depth0, "debtor", "", options) : helperMissing.call(depth0, "linkTo", "debtor", "", options));
    if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
    data.buffer.push("</div><div class=\"span4\">");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "title", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(" ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "fullName", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(" ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "suffix", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><div class=\"span6\">");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "zip", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div></div><hr />");
    return buffer;
    
  });module.exports = module.id;
});
window.require.register("templates/employment", function(exports, require, module) {
  Ember.TEMPLATES["employment"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
    var buffer = '', stack1, hashTypes, hashContexts, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


    data.buffer.push("<div class=\"row-fluid\">");
    hashTypes = {};
    hashContexts = {};
    options = {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
    data.buffer.push(escapeExpression(((stack1 = helpers.partial || depth0.partial),stack1 ? stack1.call(depth0, "employment/edit", options) : helperMissing.call(depth0, "partial", "employment/edit", options))));
    data.buffer.push("</div>");
    return buffer;
    
  });module.exports = module.id;
});
window.require.register("templates/employment/_edit", function(exports, require, module) {
  Ember.TEMPLATES["employment/_edit"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
    var buffer = '', hashTypes, hashContexts, escapeExpression=this.escapeExpression;


    data.buffer.push("<div class=\"modal\"><div class=\"modal-header\"><button class=\"close\" ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "cancelEditing", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">&times;</button><h5>Employment Record</h5></div><div class=\"modal-body\"><div class=\"form form-horizontal\"><div class=\"control-group\"><label class=\"control-label\">Relationship </label><div class=\"controls\">");
    hashContexts = {'contentBinding': depth0,'optionLabelPath': depth0,'optionValuePath': depth0,'selectionBinding': depth0,'prompt': depth0};
    hashTypes = {'contentBinding': "STRING",'optionLabelPath': "STRING",'optionValuePath': "STRING",'selectionBinding': "STRING",'prompt': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.Select", {hash:{
      'contentBinding': ("controllers.associations"),
      'optionLabelPath': ("content.label"),
      'optionValuePath': ("content.id"),
      'selectionBinding': ("controllers.associations.selected"),
      'prompt': ("Relationship ...")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label\">Employer Name </label><div class=\"controls\">");
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("name"),
      'placeholder': ("Name")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label\">Position </label><div class=\"controls\">");
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("position"),
      'placeholder': ("Position")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label\">Hire Date </label><div class=\"controls\">");
    hashContexts = {'valueBinding': depth0};
    hashTypes = {'valueBinding': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.DatePickerField", {hash:{
      'valueBinding': ("hireDate")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label\">Termination Date </label><div class=\"controls\">");
    hashContexts = {'valueBinding': depth0};
    hashTypes = {'valueBinding': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.DatePickerField", {hash:{
      'valueBinding': ("terminationDate")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label\">Phone </label><div class=\"controls\">");
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("phone"),
      'placeholder': ("Phone")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label\">Website </label><div class=\"controls\">");
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("website"),
      'placeholder': ("Website")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label\">Status </label><div class=\"controls\">");
    hashContexts = {'contentBinding': depth0,'optionLabelPath': depth0,'optionValuePath': depth0,'selectionBinding': depth0,'prompt': depth0};
    hashTypes = {'contentBinding': "STRING",'optionLabelPath': "STRING",'optionValuePath': "STRING",'selectionBinding': "STRING",'prompt': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.Select", {hash:{
      'contentBinding': ("controllers.employmentStatuses"),
      'optionLabelPath': ("content.label"),
      'optionValuePath': ("content.id"),
      'selectionBinding': ("controllers.employmentStatuses.selected"),
      'prompt': ("Employment Status ...")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label\">Source </label><div class=\"controls\">");
    hashContexts = {'contentBinding': depth0,'optionLabelPath': depth0,'optionValuePath': depth0,'selectionBinding': depth0,'prompt': depth0};
    hashTypes = {'contentBinding': "STRING",'optionLabelPath': "STRING",'optionValuePath': "STRING",'selectionBinding': "STRING",'prompt': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.Select", {hash:{
      'contentBinding': ("controllers.sources"),
      'optionLabelPath': ("content.label"),
      'optionValuePath': ("content.id"),
      'selectionBinding': ("controllers.sources.selected"),
      'prompt': ("Source ...")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label\">Job Title </label><div class=\"controls\">");
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("jobTitle"),
      'placeholder': ("Job Title")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label\">Yearly Income </label><div class=\"controls\">");
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("yearlyIncome"),
      'placeholder': ("Yearly Income")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label\">Monthly Gross Income </label><div class=\"controls\">");
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("monthlyGrossIncome"),
      'placeholder': ("Monthly Gross Income")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label\">Monthly Net Income </label><div class=\"controls\">");
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("monthlyNetIncome"),
      'placeholder': ("Monthly Net Income")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label\">Country </label><div class=\"controls\">");
    hashContexts = {'contentBinding': depth0,'optionLabelPath': depth0,'optionValuePath': depth0,'selectionBinding': depth0,'prompt': depth0};
    hashTypes = {'contentBinding': "STRING",'optionLabelPath': "STRING",'optionValuePath': "STRING",'selectionBinding': "STRING",'prompt': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.Select", {hash:{
      'contentBinding': ("controllers.countries"),
      'optionLabelPath': ("content.label"),
      'optionValuePath': ("content.id"),
      'selectionBinding': ("controllers.countries.selected"),
      'prompt': ("Country ...")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label\">Address 1 </label><div class=\"controls\">");
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("address1"),
      'placeholder': ("Address 1")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label\">Address 2 </label><div class=\"controls\">");
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("address2"),
      'placeholder': ("Address 2")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label\">Address 3 </label><div class=\"controls\">");
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("address3"),
      'placeholder': ("Address 3")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label\">City </label><div class=\"controls\">");
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("city"),
      'placeholder': ("City")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label\">State </label><div class=\"controls\">");
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("state"),
      'placeholder': ("State")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label\">Zip Code </label><div class=\"controls\">");
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("zip"),
      'placeholder': ("Zip")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label\">County </label><div class=\"controls\">");
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("county"),
      'placeholder': ("County")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div></div></div></div><div class=\"modal-footer\"><button class=\"btn btn-success\" ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "doneEditing", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">Done</button><button class=\"btn\" ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "cancelEditing", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">Cancel</button></div></div>");
    return buffer;
    
  });module.exports = module.id;
});
window.require.register("templates/employments", function(exports, require, module) {
  Ember.TEMPLATES["employments"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
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
    data.buffer.push(escapeExpression(((stack1 = helpers.humanize || depth0.humanize),stack1 ? stack1.call(depth0, "column", options) : helperMissing.call(depth0, "humanize", "column", options))));
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
    
    var buffer = '', stack1, stack2, hashContexts, hashTypes, options;
    data.buffer.push("<tr><td><button class=\"btn btn-mini\" ");
    hashContexts = {'id': depth0};
    hashTypes = {'id': "STRING"};
    data.buffer.push(escapeExpression(helpers.bindAttr.call(depth0, {hash:{
      'id': ("id")
    },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">-</button>");
    hashContexts = {'contentBinding': depth0};
    hashTypes = {'contentBinding': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.ConfirmationView", {hash:{
      'contentBinding': ("this")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</td><td>");
    hashTypes = {};
    hashContexts = {};
    options = {hash:{},inverse:self.program(4, program4, data),fn:self.program(9, program9, data),contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
    stack2 = ((stack1 = helpers.linkTo || depth0.linkTo),stack1 ? stack1.call(depth0, "employment", "", options) : helperMissing.call(depth0, "linkTo", "employment", "", options));
    if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
    data.buffer.push("</td><td>");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "labelEmploymentStatus", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</td><td>");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "labelSource", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</td><td>");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "phone", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</td><td>");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "jobTitle", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
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

    data.buffer.push("<div class=\"row-fluid\"><table class=\"table table-striped row-border\"><thead><tr><th><button class=\"btn btn-primary btn-mini\" ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "create", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">+</button></th>");
    hashContexts = {'itemController': depth0};
    hashTypes = {'itemController': "STRING"};
    stack1 = helpers.each.call(depth0, "columns", {hash:{
      'itemController': ("columnItem")
    },inverse:self.program(4, program4, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</tr></thead><tbody>");
    hashContexts = {'itemController': depth0};
    hashTypes = {'itemController': "STRING"};
    stack1 = helpers.each.call(depth0, "controller", {hash:{
      'itemController': ("employment")
    },inverse:self.program(4, program4, data),fn:self.program(8, program8, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</tbody></table></div>");
    return buffer;
    
  });module.exports = module.id;
});
window.require.register("templates/empty", function(exports, require, module) {
  Ember.TEMPLATES["empty"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
    var buffer = '';


    return buffer;
    
  });module.exports = module.id;
});
window.require.register("templates/index", function(exports, require, module) {
  Ember.TEMPLATES["index"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
    var buffer = '', stack1, hashContexts, hashTypes, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

  function program1(depth0,data) {
    
    var buffer = '', stack1, stack2, hashTypes, hashContexts, options;
    data.buffer.push("<th ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "toggleSort", "column", {hash:{},contexts:[depth0,depth0],types:["ID","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(" ");
    hashContexts = {'style': depth0};
    hashTypes = {'style': "STRING"};
    data.buffer.push(escapeExpression(helpers.bindAttr.call(depth0, {hash:{
      'style': ("width")
    },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("><p ");
    hashContexts = {'style': depth0};
    hashTypes = {'style': "STRING"};
    data.buffer.push(escapeExpression(helpers.bindAttr.call(depth0, {hash:{
      'style': ("align")
    },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">");
    hashTypes = {};
    hashContexts = {};
    options = {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
    data.buffer.push(escapeExpression(((stack1 = helpers.humanize || depth0.humanize),stack1 ? stack1.call(depth0, "label", options) : helperMissing.call(depth0, "humanize", "label", options))));
    hashTypes = {};
    hashContexts = {};
    stack2 = helpers['if'].call(depth0, "sortedAsc", {hash:{},inverse:self.program(4, program4, data),fn:self.program(2, program2, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
    if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
    hashTypes = {};
    hashContexts = {};
    stack2 = helpers['if'].call(depth0, "sortedDesc", {hash:{},inverse:self.program(4, program4, data),fn:self.program(6, program6, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
    if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
    data.buffer.push("</p></th>");
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
    
    var buffer = '', hashTypes, hashContexts;
    data.buffer.push("<tr><td style=\"width:15%\"><a href=\"#/account/");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.unbound.call(depth0, "id", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("/debtor/");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.unbound.call(depth0, "debtorId", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("?clientId=");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.unbound.call(depth0, "controller.params.clientId", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("&userId=");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.unbound.call(depth0, "controller.params.userId", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("&canEditDebtor=");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.unbound.call(depth0, "controller.params.canEditDebtor", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("&feePercentage=");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.unbound.call(depth0, "controller.params.feePercentage", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("\" target=\"_blank\">");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "id", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</a></td><td style=\"width:30%\">");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "fullNameWithTitle", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</td><td style=\"width:15%\"><div class=\"pull-right\">");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "originalBalance", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div></td><td style=\"width:15%\"><div class=\"pull-right\">");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "currBalance", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div></td><td style=\"width:15%\"><div class=\"pull-right\">");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "payment", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div></td><td style=\"width:10%\"><div class=\"pagination-centered\">");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "status", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div></td></tr>");
    return buffer;
    }

    data.buffer.push("<div class=\"container-fluid\"><div class=\"pull-right\"><div class=\"search-query form form-horizontal\"><div class=\"control-group\"><label class=\"control-label\">Search Debtors</label><div class=\"controls\">");
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("controller.search"),
      'placeholder': ("filter by Id")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div></div></div></div></div><div class=\"row-fluid row-border\"><table class=\"table\" style=\"margin-bottom: 0px;\"><thead><tr>");
    hashContexts = {'itemController': depth0};
    hashTypes = {'itemController': "STRING"};
    stack1 = helpers.each.call(depth0, "columns", {hash:{
      'itemController': ("columnItem")
    },inverse:self.program(4, program4, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</tr></thead></table><div class=\"scrollable-350\"><table class=\"table table-striped\"><tbody>");
    hashTypes = {};
    hashContexts = {};
    stack1 = helpers.each.call(depth0, "currentContent", {hash:{},inverse:self.program(4, program4, data),fn:self.program(8, program8, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</tbody></table></div></div>");
    return buffer;
    
  });module.exports = module.id;
});
window.require.register("templates/loading", function(exports, require, module) {
  Ember.TEMPLATES["loading"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
    var buffer = '', hashTypes, hashContexts, escapeExpression=this.escapeExpression;


    data.buffer.push("<div class=\"modal\"><div class=\"modal-body\"><div class=\"pagination-centered\"><img src=\"");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.unbound.call(depth0, "App.AJAX_LOADER_IMG", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("\" alt=\"loading\" /></div><div class=\"pagination-centered\"><h4>Loading...</h4></div></div></div>");
    return buffer;
    
  });module.exports = module.id;
});
window.require.register("templates/modal_layout", function(exports, require, module) {
  Ember.TEMPLATES["modal_layout"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
    var buffer = '', hashTypes, hashContexts, escapeExpression=this.escapeExpression;


    data.buffer.push("<div class=\"modal-backdrop fade\">&nbsp;</div><div class=\"model fade\">");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "yield", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div>");
    return buffer;
    
  });module.exports = module.id;
});
window.require.register("templates/note", function(exports, require, module) {
  Ember.TEMPLATES["note"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
    var buffer = '', hashTypes, hashContexts, escapeExpression=this.escapeExpression;


    data.buffer.push("<div class=\"modal\"><div class=\"modal-header\"><button class=\"close\" ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "cancelEditing", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">&times;</button><h5 ");
    hashContexts = {'': depth0};
    hashTypes = {'': "STRING"};
    data.buffer.push(escapeExpression(helpers.bindAttr.call(depth0, {hash:{
      '': ("date")
    },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">time</h5><div class=\"span2\"><p>Action Code: ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "actionCode", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</p></div><p>Result Code: ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "resultCode", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(" </p></div><div class=\"modal-body\"><p>");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "message", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</p></div><div class=\"modal-footer\"><button class=\"btn\" ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "close", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">Close</button></div></div>");
    return buffer;
    
  });module.exports = module.id;
});
window.require.register("templates/notes", function(exports, require, module) {
  Ember.TEMPLATES["notes"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
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
    data.buffer.push(escapeExpression(((stack1 = helpers.humanize || depth0.humanize),stack1 ? stack1.call(depth0, "column", options) : helperMissing.call(depth0, "humanize", "column", options))));
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
    stack2 = ((stack1 = helpers.linkTo || depth0.linkTo),stack1 ? stack1.call(depth0, "note", "", options) : helperMissing.call(depth0, "linkTo", "note", "", options));
    if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
    data.buffer.push("</td><td><div class=\"span2\">");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "labelActionCode", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div></td><td><div class=\"span2\">");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "resultCode", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div></td><td>");
    hashTypes = {};
    hashContexts = {};
    options = {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
    data.buffer.push(escapeExpression(((stack1 = helpers.summarize || depth0.summarize),stack1 ? stack1.call(depth0, "message", options) : helperMissing.call(depth0, "summarize", "message", options))));
    data.buffer.push("</td></tr>");
    return buffer;
    }
  function program9(depth0,data) {
    
    var stack1, hashTypes, hashContexts, options;
    hashTypes = {};
    hashContexts = {};
    options = {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
    data.buffer.push(escapeExpression(((stack1 = helpers.date || depth0.date),stack1 ? stack1.call(depth0, "time", options) : helperMissing.call(depth0, "date", "time", options))));
    }

    data.buffer.push("<div class=\"row-fluid\"><table class=\"table table-striped row-border\"><thead><tr>");
    hashContexts = {'itemController': depth0};
    hashTypes = {'itemController': "STRING"};
    stack1 = helpers.each.call(depth0, "columns", {hash:{
      'itemController': ("columnItem")
    },inverse:self.program(4, program4, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</tr></thead><tbody>");
    hashContexts = {'itemController': depth0};
    hashTypes = {'itemController': "STRING"};
    stack1 = helpers.each.call(depth0, "controller", {hash:{
      'itemController': ("note")
    },inverse:self.program(4, program4, data),fn:self.program(8, program8, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</tbody></table><hr /></div>");
    return buffer;
    
  });module.exports = module.id;
});
window.require.register("templates/person", function(exports, require, module) {
  Ember.TEMPLATES["person"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
    var buffer = '', stack1, hashTypes, hashContexts, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


    data.buffer.push("<div class=\"row-fluid\">");
    hashTypes = {};
    hashContexts = {};
    options = {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
    data.buffer.push(escapeExpression(((stack1 = helpers.partial || depth0.partial),stack1 ? stack1.call(depth0, "person/edit", options) : helperMissing.call(depth0, "partial", "person/edit", options))));
    data.buffer.push("</div>");
    return buffer;
    
  });module.exports = module.id;
});
window.require.register("templates/person/_edit", function(exports, require, module) {
  Ember.TEMPLATES["person/_edit"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
    var buffer = '', hashTypes, hashContexts, escapeExpression=this.escapeExpression;


    data.buffer.push("<div class=\"modal\"><div class=\"modal-header\"><button class=\"close\" ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "cancelEditing", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">&times;</button><h5>Related Person</h5></div><div class=\"modal-body\"><div class=\"form form-horizontal\"><div class=\"control-group\"><label class=\"control-label\">Relationship </label><div class=\"controls\">");
    hashContexts = {'contentBinding': depth0,'optionLabelPath': depth0,'optionValuePath': depth0,'selectionBinding': depth0,'prompt': depth0};
    hashTypes = {'contentBinding': "STRING",'optionLabelPath': "STRING",'optionValuePath': "STRING",'selectionBinding': "STRING",'prompt': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.Select", {hash:{
      'contentBinding': ("controllers.relationships"),
      'optionLabelPath': ("content.label"),
      'optionValuePath': ("content.id"),
      'selectionBinding': ("controllers.relationships.selected"),
      'prompt': ("Relationship ...")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label\">Title </label><div class=\"controls\">");
    hashContexts = {'contentBinding': depth0,'optionLabelPath': depth0,'optionValuePath': depth0,'selectionBinding': depth0,'prompt': depth0};
    hashTypes = {'contentBinding': "STRING",'optionLabelPath': "STRING",'optionValuePath': "STRING",'selectionBinding': "STRING",'prompt': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.Select", {hash:{
      'contentBinding': ("controllers.titles"),
      'optionLabelPath': ("content.id"),
      'optionValuePath': ("content.id"),
      'selectionBinding': ("controllers.titles.selected"),
      'prompt': ("Title ...")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label\">Last Name </label><div class=\"controls\">");
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("lastName"),
      'placeholder': ("Last Name")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label\">First Name </label><div class=\"controls\">");
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("firstName"),
      'placeholder': ("First Name")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label\">Middle Name </label><div class=\"controls\">");
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("middleName"),
      'placeholder': ("Middle Name")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label\">Suffix </label><div class=\"controls\">");
    hashContexts = {'contentBinding': depth0,'optionLabelPath': depth0,'optionValuePath': depth0,'selectionBinding': depth0,'prompt': depth0};
    hashTypes = {'contentBinding': "STRING",'optionLabelPath': "STRING",'optionValuePath': "STRING",'selectionBinding': "STRING",'prompt': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.Select", {hash:{
      'contentBinding': ("controllers.suffixes"),
      'optionLabelPath': ("content.id"),
      'optionValuePath': ("content.id"),
      'selectionBinding': ("controllers.suffixes.selected"),
      'prompt': ("Suffix ...")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label\">Date of Birth </label><div class=\"controls\">");
    hashContexts = {'valueBinding': depth0};
    hashTypes = {'valueBinding': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.DatePickerField", {hash:{
      'valueBinding': ("dob")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label\">SSN </label><div class=\"controls\">");
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("ssn"),
      'placeholder': ("SSN")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label\">Relationship Start Date </label><div class=\"controls\">");
    hashContexts = {'valueBinding': depth0};
    hashTypes = {'valueBinding': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.DatePickerField", {hash:{
      'valueBinding': ("startDate")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label\">Relationship End Date </label><div class=\"controls\">");
    hashContexts = {'valueBinding': depth0};
    hashTypes = {'valueBinding': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.DatePickerField", {hash:{
      'valueBinding': ("endDate")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label\">Claim Number </label><div class=\"controls\">");
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("claimNumber"),
      'placeholder': ("Claim Number")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label\">Phone </label><div class=\"controls\">");
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("phone"),
      'placeholder': ("Phone")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label\">Country </label><div class=\"controls\">");
    hashContexts = {'contentBinding': depth0,'optionLabelPath': depth0,'optionValuePath': depth0,'selectionBinding': depth0,'prompt': depth0};
    hashTypes = {'contentBinding': "STRING",'optionLabelPath': "STRING",'optionValuePath': "STRING",'selectionBinding': "STRING",'prompt': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.Select", {hash:{
      'contentBinding': ("controllers.countries"),
      'optionLabelPath': ("content.label"),
      'optionValuePath': ("content.id"),
      'selectionBinding': ("controllers.countries.selected"),
      'prompt': ("Country ...")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label\">Address 1 </label><div class=\"controls\">");
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("address1"),
      'placeholder': ("Address 1")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label\">Address 2 </label><div class=\"controls\">");
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("address2"),
      'placeholder': ("Address 2")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label\">Address 3 </label><div class=\"controls\">");
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("address3"),
      'placeholder': ("Address 3")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label\">City </label><div class=\"controls\">");
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("city"),
      'placeholder': ("City")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label\">State </label><div class=\"controls\">");
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("state"),
      'placeholder': ("State")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label\">Zip Code </label><div class=\"controls\">");
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("zip"),
      'placeholder': ("Zip code")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label\">County </label><div class=\"controls\">");
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextField", {hash:{
      'valueBinding': ("county"),
      'placeholder': ("County")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div><label class=\"control-label\">Comment </label><div class=\"controls\">");
    hashContexts = {'valueBinding': depth0,'placeholder': depth0};
    hashTypes = {'valueBinding': "STRING",'placeholder': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Em.TextArea", {hash:{
      'valueBinding': ("comment"),
      'placeholder': ("Comment")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</div></div></div></div><div class=\"modal-footer\"><button class=\"btn btn-success\" ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "doneEditing", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">Done</button><button class=\"btn\" ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "cancelEditing", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">Cancel</button></div></div>");
    return buffer;
    
  });module.exports = module.id;
});
window.require.register("templates/persons", function(exports, require, module) {
  Ember.TEMPLATES["persons"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
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
    data.buffer.push(escapeExpression(((stack1 = helpers.humanize || depth0.humanize),stack1 ? stack1.call(depth0, "column", options) : helperMissing.call(depth0, "humanize", "column", options))));
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
    
    var buffer = '', stack1, stack2, hashContexts, hashTypes, options;
    data.buffer.push("<tr><td><button class=\"btn btn-mini\" ");
    hashContexts = {'id': depth0};
    hashTypes = {'id': "STRING"};
    data.buffer.push(escapeExpression(helpers.bindAttr.call(depth0, {hash:{
      'id': ("id")
    },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">-</button>");
    hashContexts = {'contentBinding': depth0};
    hashTypes = {'contentBinding': "STRING"};
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.ConfirmationView", {hash:{
      'contentBinding': ("this")
    },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push("</td><td>");
    hashTypes = {};
    hashContexts = {};
    options = {hash:{},inverse:self.program(4, program4, data),fn:self.program(9, program9, data),contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
    stack2 = ((stack1 = helpers.linkTo || depth0.linkTo),stack1 ? stack1.call(depth0, "person", "", options) : helperMissing.call(depth0, "linkTo", "person", "", options));
    if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
    data.buffer.push("</td><td>");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "labelRelationship", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
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
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "fullName", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    }

    data.buffer.push("<div class=\"row-fluid\"><table class=\"table table-striped row-border\"><thead><tr><th><button class=\"btn btn-primary btn-mini\" ");
    hashTypes = {};
    hashContexts = {};
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "create", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
    data.buffer.push(">+</button></th>");
    hashContexts = {'itemController': depth0};
    hashTypes = {'itemController': "STRING"};
    stack1 = helpers.each.call(depth0, "columns", {hash:{
      'itemController': ("columnItem")
    },inverse:self.program(4, program4, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</tr></thead><tbody>");
    hashContexts = {'itemController': depth0};
    hashTypes = {'itemController': "STRING"};
    stack1 = helpers.each.call(depth0, "controller", {hash:{
      'itemController': ("person")
    },inverse:self.program(4, program4, data),fn:self.program(8, program8, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</tbody></table></div>");
    return buffer;
    
  });module.exports = module.id;
});
window.require.register("views/confirmationView", function(exports, require, module) {
  App.ConfirmationView = Em.View.extend({
    titlePrefix: '',
    parentSelector: '',
    contentSelector: '',
    templateName: '_confirmation',
    willInsertElement: function() {
      this.set('contentSelector', '#content-' + this.get('controller.id'));
      this.set('templateName', '_confirmation');
      this.set('id', 'popover' + this.get('controller.id'));
      return this.set('parentSelector', '#' + this.get('controller.id'));
    },
    didInsertElement: function() {
      var self;
      self = this;
      return $(self.parentSelector).popover({
        html: true,
        placement: 'right',
        container: 'body',
        title: 'Delete Confirmation',
        content: function() {
          var $content;
          return $content = $(self.contentSelector).html();
        }
      });
    },
    willDestroyElement: function() {
      return this.$().popover('destroy');
    },
    close: function() {
      var self;
      self = this;
      return $(self.parentSelector).popover('hide');
    }
  });
  
});
window.require.register("views/contactView", function(exports, require, module) {
  
  
});
window.require.register("views/contactsListView", function(exports, require, module) {
  
  
});
window.require.register("views/datePickerField", function(exports, require, module) {
  App.DatePickerField = Em.TextField.extend({
    classNames: ['date-picker'],
    textToDateTransform: (function(key, value) {
      var date, month, parts;
      if (arguments.length === 2) {
        if (value instanceof Date) {
          this.set('date', date);
          return this.close();
        } else if (value && /\d{2}\/\d{2}\/\d{4}/.test(value)) {
          parts = value.split('-');
          date = new Date();
          date.setDate(parts[0]);
          date.setMonth(parts[1] - 1);
          date.setYear(parts[2]);
          this.set('date', date);
          return this.close();
        } else {
          return this.set('date', null);
        }
      } else if (arguments.length === 1 && this.get('date')) {
        month = this.get('date').getMonth() + 1;
        date = this.get('date').getDate();
        if (month < 10) {
          month = "0" + month;
        }
        if (date < 10) {
          date = "0" + date;
        }
        return "%@-%@-%@".fmt(this.get('date').getFullYear(), month, date);
      }
    }).property('value'),
    format: "mm/dd/yyyy",
    placeholder: Em.computed.alias('format'),
    size: 8,
    valueBinding: "textToDateTransform",
    yesterday: (function() {
      var date;
      date = new Date();
      date.setDate(date.getDate() - 1);
      return date;
    }).property(),
    didInsertElement: function() {
      var _this = this;
      return this.$().datepicker({
        format: this.get('format'),
        autoclose: true,
        todayHighlight: true,
        keyboardNavigation: false
      }).on('changeDate', function(ev) {
        _this.set('date', ev.date);
        return _this.$().datepicker('setValue', ev.date);
      });
    },
    close: function() {
      return this.$().datepicker('hide');
    }
  });
  
});
window.require.register("views/debtorsListView", function(exports, require, module) {
  
  
});
window.require.register("views/fixedHeaderTableView", function(exports, require, module) {
  App.FixedHeaderTableView = Em.View.extend({
    classNames: ['table-fixed-header'],
    didInsertElement: function() {
      return this.$('.table-fixed-header').fixedHeader();
    }
  });
  
});
window.require.register("views/modalView", function(exports, require, module) {
  App.ModalView = Ember.View.extend({
    templateName: 'modal',
    title: '',
    content: '',
    classNames: ['modal', 'fade', 'hide'],
    didInsertElement: function() {
      this.$().modal('show');
      return this.$().one('hidden', this._viewDidHide);
    },
    _viewDidHide: function() {
      if (!this.isDestroyed) {
        return this.destroy();
      }
    },
    close: function() {
      return this.$('.close').click();
    }
  });
  
});
window.require.register("views/radioButtonView", function(exports, require, module) {
  App.RadioButton = Em.CollectionView.extend({
    classNames: ['btn-group'],
    itemViewClass: Em.View.extend({
      template: Em.Handlebars.compile('{{view.content.name}}'),
      tagName: 'button',
      classNames: ['btn']
    }),
    attributeBindings: ['data-toggle', 'name', 'type', 'value'],
    'data-toggle': 'buttons-radio',
    click: function() {
      return this.set('controller.filterStatus', this.$().val());
    }
  });
  
});
window.require.register("views/scrollView", function(exports, require, module) {
  
  
});
