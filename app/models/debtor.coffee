App.Debtor = DS.Model.extend
  type:        				DS.attr 'string'
  title:       				DS.attr 'string'
  lastName:        	  DS.attr 'string'
  firstName:     			DS.attr 'string'
  middleName:         DS.attr 'string'
  suffix:  						DS.attr 'string'
  dob:								DS.attr 'isodate'
  ssn:								DS.attr 'string'
  ein:                DS.attr 'string'
  martialStatus:			DS.attr 'string'
  email:							DS.attr 'string'
  emailValidity:			DS.attr 'number'
  optIn:							DS.attr 'string'
  contact:	          DS.attr 'string'

  country:            DS.attr 'number'
  address1:           DS.attr 'string'
  address2:           DS.attr 'string'
  address3:           DS.attr 'string'
  city:               DS.attr 'string'
  state:              DS.attr 'string'
  zip:                DS.attr 'string'
  county:             DS.attr 'string'
  
  dlIssuer:						DS.attr	'string'
  dlNumber:						DS.attr	'string'
  passport:						DS.attr	'string'
  pin:								DS.attr	'string'

  contacts: 					DS.hasMany 'App.Contact'
  persons:            DS.hasMany 'App.Person'
  employments:        DS.hasMany 'App.Employment'
  notes:              DS.hasMany 'App.Note'

  clientId:           DS.attr 'number'


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

  fullAddress: (->
    address1   = @get('address1') || ''
    address2   = @get('address2') || ''
    address3   = @get('address3') || ''
    city       = @get('city') || ''
    state      = @get('state') || ''
    zip        = @get('zip') || ''

    return address1 + ' ' + address2 + ' ' + address3 +
      city + ' ' + state + ' ' + zip
  ).property(
    'address1',
    'address2',
    'address3',
    'city',
    'state',
    'zip' )