App.Contact = DS.Model.extend
  type:        		DS.attr 'string'
  country:       	DS.attr 'string'
  phone:					DS.attr 'string'
  phoneExt:				DS.attr 'string'
  score:					DS.attr 'number'
  consentToCall:	DS.attr 'boolean'
  
  debtor: 				DS.belongsTo 'App.Debtor'