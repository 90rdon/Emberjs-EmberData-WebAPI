App.Note = DS.Model.extend
  time:           DS.attr 'date'
  actionCode:     DS.attr 'number'
  resultCode:     DS.attr 'number'
  message:        DS.attr 'string'
  userid:         DS.attr 'number'
  clientId:       DS.attr 'number'
  debtorId:       DS.attr 'number'

  debtor:         DS.belongsTo 'App.Debtor'