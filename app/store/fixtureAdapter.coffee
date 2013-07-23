App.Store = DS.Store.extend
  adapter: DS.FixtureAdapter.create()

DS.RESTAdapter.map 'App.Debtor',
  address: { embedded: 'always' }