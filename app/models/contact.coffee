App.Contact = DS.Model.extend
  type:        		DS.attr 'number'
  country:       	DS.attr 'number'
  phone:					DS.attr 'string'
  extension:		  DS.attr 'string'
  score:					DS.attr 'number'
  status:         DS.attr 'number'
  source:         DS.attr 'number'
  consent:	      DS.attr 'string'
  
  debtor: 				DS.belongsTo 'App.Debtor'