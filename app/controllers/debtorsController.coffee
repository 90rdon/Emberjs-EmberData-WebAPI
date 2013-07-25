App.DebtorsController = Em.ArrayController.extend
  sortedColumn: (->
    properties = @get('sortProperties')
    return 'undefined'  unless properties
    properties.get 'firstObject'
  ).property('sortProperties.[]')

  columns: (-> [
    Em.Object.create(columnName: 'name')
    Em.Object.create(columnName: 'address')
    Em.Object.create(columnName: 'city')
    Em.Object.create(columnName: 'state')
    Em.Object.create(columnName: 'zip')
  ]).property()

  toggleSort: (column) ->
    if @get('sortedColumn') is column
      @toggleProperty 'sortAscending'
    else
      @set 'sortProperties', [column]
      @set 'sortAscending', true