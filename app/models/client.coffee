App.Client = DS.Model.extend
  clientId:           DS.attr 'number'
  legacyId:           DS.attr 'string'
  description:        DS.attr 'string'

  debtorAccounts:     DS.hasMany   'App.DebtorAccount'