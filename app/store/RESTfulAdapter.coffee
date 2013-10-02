App.Store = DS.Store.extend
  adapter:                    DS.WebAPIAdapter.extend
    url:                      App.serverUrl
    namespace:                App.serverNamespace
    bulkCommit:               false,
    antiForgeryTokenSelector: '#antiForgeryToken'

    plurals:
      'country': 'countries'
      'cancellation': 'cancellation'

    pluralize: (name) ->
      plurals = @get('plurals')
      (plurals && plurals[name]) || name + 's'

DS.WebAPIAdapter.map 'App.Client',
  clientDebtors: embedded: 'load'

DS.WebAPIAdapter.map 'App.Debtor',
  contacts:     embedded: 'load'
  persons:      embedded: 'load'
  employments:  embedded: 'load'
  notes:        embedded: 'load'

DS.WebAPIAdapter.map 'App.Contact',
  countries:    embedded: 'load'

DS.WebAPIAdapter.configure 'App.Client',
    sideloadAs: 'client',
    primaryKey: 'id'

DS.WebAPIAdapter.configure 'App.ClientDebtor',
    sideloadAs: 'clientDebtor',
    primaryKey: 'id'

DS.WebAPIAdapter.configure 'App.Debtor',
    sideloadAs: 'debtor',
    primaryKey: 'id'

DS.WebAPIAdapter.configure 'App.Contact',
    sideloadAs: 'contact',
    primaryKey: 'id'

DS.WebAPIAdapter.configure 'App.Person',
    sideloadAs: 'person',
    primaryKey: 'id'

DS.WebAPIAdapter.configure 'App.Employment',
    sideloadAs: 'employment',
    primaryKey: 'id'

DS.WebAPIAdapter.configure 'App.Note',
    sideloadAs: 'note',
    primaryKey: 'id'

DS.WebAPIAdapter.configure 'App.Country',
    sideloadAs: 'country',
    primaryKey: 'id'

DS.WebAPIAdapter.configure 'App.Relationship',
    sideloadAs: 'relationship',
    primaryKey: 'id'