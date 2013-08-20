App.Contact = DS.Model.extend
  type:        		DS.attr 'number'
  country:       	DS.attr 'string'
  phone:					DS.attr 'string'
  extension:		  DS.attr 'string'
  score:					DS.attr 'number'
  status:         DS.attr 'number'
  source:         DS.attr 'number'
  consent:	      DS.attr 'string'
  debtorId:       DS.attr 'number'
  
  debtor: 				DS.belongsTo 'App.Debtor'