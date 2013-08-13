App.PersonsController = Em.ArrayController.extend
  columns: (-> [
    Em.Object.create(column: 'name')
    Em.Object.create(column: 'relationship')
    Em.Object.create(column: 'phone')
    Em.Object.create(column: 'city')
    Em.Object.create(column: 'state')
    Em.Object.create(column: 'comment')
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