App.HistoricalEvent = DS.Model.extend
  time:       DS.attr 'date'
  actionCode: DS.attr 'string'
  resultCode: DS.attr 'string'
  user:       DS.attr 'string'
  message:    DS.attr 'string'