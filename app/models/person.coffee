App.Person = DS.Model.extend
  relationship:   DS.attr 'number'
  title:          DS.attr 'string'
  lastName:       DS.attr 'string'
  firstName:      DS.attr 'string'
  middleName:     DS.attr 'string'
  suffix:         DS.attr 'string'
  dob:            DS.attr 'date'
  SSN:            DS.attr 'string'
  startDate:      DS.attr 'date'
  endDate:        DS.attr 'date'
  claimNumber:    DS.attr 'string'
  phone:          DS.attr 'string'

  country:        DS.attr 'number'
  address1:       DS.attr 'string'
  address2:       DS.attr 'string'
  address3:       DS.attr 'string'
  city:           DS.attr 'string'
  state:          DS.attr 'string'
  zip:            DS.attr 'string'
  county:         DS.attr 'string'
  debtorId:       DS.attr 'number'

  debtor:         DS.belongsTo 'App.Debtor'

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