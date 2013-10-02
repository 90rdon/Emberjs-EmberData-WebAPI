App.Client = DS.Model.extend
  clientId:           DS.attr 'number'
  legacyId:           DS.attr 'string'
  description:        DS.attr 'string'

  clientDebtors:      DS.hasMany   'App.ClientDebtor'