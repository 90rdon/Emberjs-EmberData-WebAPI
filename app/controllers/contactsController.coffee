App.ContactsController = Em.ArrayController.extend
  parentControllerBinding: 'App.Debtor'
  
  sortedColumn: (->
    properties = @get('sortProperties')
    return 'undefined'  unless properties
    return properties.get 'firstObject'
  ).property('sortProperties.[]')

  columns: (-> [
    Em.Object.create(column: 'number')
    Em.Object.create(column: 'extension')
    Em.Object.create(column: 'type')
    Em.Object.create(column: 'score')
    Em.Object.create(column: 'source')
    Em.Object.create(column: 'status')
  ]).property()

  toggleSort: (column) ->
    if @get('sortedColumn') is column
      @toggleProperty 'sortAscending'
    else
      @set('sortProperties', [column])
      @set('sortAscending', true)