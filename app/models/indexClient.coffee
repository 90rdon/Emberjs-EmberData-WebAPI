App.IndexClient = DS.Model.extend
  clientId:           DS.attr 'number'
  legacyId:           DS.attr 'string'
  description:        DS.attr 'string'

  indexDebtors:       DS.hasMany 'App.IndexDebtor'