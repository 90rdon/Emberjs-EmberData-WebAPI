App.IndexClient = DS.Model.extend
  clientId:           DS.attr 'number'
  legacyId:           DS.attr 'string'
  description:        DS.attr 'string'
  totalDebtors:       DS.attr 'number'

  indexDebtors:       DS.hasMany 'App.IndexDebtor'