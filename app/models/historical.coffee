App.Historical = DS.Model.extend
  time:       DS.attr 'date'
  actionCode: DS.attr 'number'
  resultCode: DS.attr 'number'
  user:       DS.attr 'number'
  message:    DS.attr 'string'

  debtor:     DS.belongsTo 'App.Debtor'