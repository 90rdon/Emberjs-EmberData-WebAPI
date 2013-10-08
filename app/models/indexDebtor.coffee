App.IndexDebtor = DS.Model.extend
  debtorId:            DS.attr 'number'
  title:                DS.attr 'string'
  lastName:             DS.attr 'string'
  firstName:            DS.attr 'string'
  middleName:           DS.attr 'string'
  suffix:               DS.attr 'string'
  totalOriginalBalance: DS.attr 'number'
  currentBalance:       DS.attr 'number'
  totalPayment:         DS.attr 'number'
  clientId:             DS.attr 'number'
  status:               DS.attr 'string'

  indexClient:          DS.belongsTo 'App.IndexClient'


  fullName: (->
    first   = @get('firstName') || ''
    middle  = @get('middleName') || ''
    last    = @get('lastName') || ''

    return first + ' ' + middle + ' ' + last
  ).property('firstName', 'lastName', 'middleName')

  fullNameWithTitle: (->
    title   = @get('title') || ''
    first   = @get('firstName') || ''
    middle  = @get('middleName') || ''
    last    = @get('lastName') || ''
    suffix  = @get('suffix') || ''

    return title + ' ' + first + ' ' + middle + ' ' + last + ' ' + suffix
  ).property('title', 'firstName', 'lastName', 'middleName', 'suffix')

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