App.DebtorAccount = DS.Model.extend
  debtorId:           DS.attr 'number'
  agencyId:           DS.attr 'number'
  creditorId:         DS.attr 'number'
  placementDate:      DS.attr 'date'
  status:             DS.attr 'string'
  currentBalance:     DS.attr 'number'
  totalPayment:       DS.attr 'number'
  totalOriginalBalance: DS.attr 'number'

  client:             DS.belongsTo 'App.Client'
  debtor:             DS.belongsTo 'App.Debtor'

  computedStatus: (->
    return 'N/A'   if not @get('status')
    @get('status')
  ).property('status')

  originalBalance: (->
    balance = @get('totalOriginalBalance')
    formatted = parseFloat(balance, 10).toFixed(2)

    '$' + formatted
  ).property('totalOriginalBalance')

  currBalance: (->
    balance = @get('currentBalance')
    formatted = parseFloat(balance, 10).toFixed(2)

    '$' + formatted
  ).property('currentBalance')

  payment: (->
    payment = @get('totalPayment')
    formatted = parseFloat(payment, 10).toFixed(2)

    '$' + formatted
  ).property('totalPayment')