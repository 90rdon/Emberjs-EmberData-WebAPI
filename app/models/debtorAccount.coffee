App.DebtorAccount = DS.Model.extend
  debtorId:           DS.attr 'number'
  agencyId:           DS.attr 'number'
  creditorId:         DS.attr 'number'

  client:             DS.belongsTo 'App.Client'
  debtor:             DS.belongsTo 'App.Debtor'