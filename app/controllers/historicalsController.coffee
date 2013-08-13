App.HistoricalsController = Em.ArrayController.extend
  columns: (-> [
    Em.Object.create(column: 'time')
    Em.Object.create(column: 'actionCode')
    Em.Object.create(column: 'resultCode')
    Em.Object.create(column: 'user')
    Em.Object.create(column: 'message')
  ]).property()

  sortedColumn: (->
    properties = @get('sortProperties')
    return 'undefined'  unless properties
    return properties.get 'firstObject'
  ).property('sortProperties.[]')

  toggleSort: (column) ->
    if @get('sortedColumn') is column
      @toggleProperty 'sortAscending'
    else
      @set('sortProperties', [column])
      @set('sortAscending', true)