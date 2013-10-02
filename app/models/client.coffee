App.Client = DS.Model.extend
  clientId:           DS.attr 'number'
  legacyId:           DS.attr 'string'
  description:        DS.attr 'string'

  debtors:            DS.hasMany   'App.Debtor'