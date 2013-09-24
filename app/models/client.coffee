App.Client = DS.Model.extend
  legacyId:           DS.attr 'string'
  description:        DS.attr 'string'

  debtors:            DS.hasMany   'App.Debtor'