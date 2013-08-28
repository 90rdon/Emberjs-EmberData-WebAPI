App.Cancellation = DS.Model.extend
  debtorId:       DS.attr 'number'
  actionCode:     DS.attr 'string'
  resultCode:     DS.attr 'string'