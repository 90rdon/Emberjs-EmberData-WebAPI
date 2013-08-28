App.Country = DS.Model.extend
  label: DS.attr 'string'

  idStr: (->
    @get('id') + ''
  ).property('id')