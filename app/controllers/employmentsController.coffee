App.EmploymentsController = Em.ArrayController.extend
  columns: (-> [
    Em.Object.create(column: 'name')
    Em.Object.create(column: 'status')
    Em.Object.create(column: 'source')
    Em.Object.create(column: 'phone')
    Em.Object.create(column: 'title')
    Em.Object.create(column: 'hireDate')
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