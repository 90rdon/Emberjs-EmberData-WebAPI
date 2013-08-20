App.Store = DS.Store.extend
  adapter:                    DS.WebAPIAdapter.extend
    url:                      'http://10.211.55.4'
    namespace:                'hunter-warfield/api'
    bulkCommit:               false,
    antiForgeryTokenSelector: '#antiForgeryToken'

    # pluralize: (string) ->
    #   string + 's'

    plurals:
      'country': 'countries'

    pluralize: (name) ->
      plurals = @get('plurals')
      (plurals && plurals[name]) || name + 's'

# DS.WebAPIAdapter.map 'App.Client',
#   debtors:      embedded: 'load'

DS.WebAPIAdapter.map 'App.Debtor',
  contacts:     embedded: 'load'
  persons:      embedded: 'load'
  employments:  embedded: 'load'
  historicals:  embedded: 'load'

DS.WebAPIAdapter.map 'App.Contact',
  countries:    embedded: 'always'

# DS.WebAPIAdapter.configure 'App.Client',
#     sideloadAs: 'client',
#     primaryKey: 'id'

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

DS.WebAPIAdapter.configure 'App.Historical',
    sideloadAs: 'historical',
    primaryKey: 'id'

DS.WebAPIAdapter.configure 'App.Country',
    sideloadAs: 'country',
    primaryKey: 'id'

DS.WebAPIAdapter.configure 'App.Relationship',
    sideloadAs: 'relationship',
    primaryKey: 'id'