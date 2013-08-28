App.Relationship = DS.Model.extend
  label: DS.attr 'string'

  idNum: (->
    parseInt(@get('id'))
  ).property('id')