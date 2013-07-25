App.DebtorsController = Em.ArrayController.extend
  sortedColumn: (->
    properties = @get('sortProperties')
    return 'undefined'  unless properties
    properties.get 'firstObject'
  ).property('sortProperties.[]')

  columns: (-> [
    Em.Object.create(name: 'name')
    Em.Object.create(name: 'address')
    Em.Object.create(name: 'city')
    Em.Object.create(name: 'state')
    Em.Object.create(name: 'zip')
  ]).property()

  toggleSort: (column) ->
    console.log 'toggle ' + column
    console.log @get('sortedColumn')
    if @get('sortedColumn') is column
      @toggleProperty 'sortAscending'
    else
      @set 'sortProperties', [column]
      @set 'sortAscending', true