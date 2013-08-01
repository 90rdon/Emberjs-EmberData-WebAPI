App.DebtorsController = Em.ArrayController.extend
  sortedColumn: (->
    properties = @get('sortProperties')
    return 'undefined'  unless properties
    return properties.get 'firstObject'
  ).property('sortProperties.[]')

  columns: (-> [
    Em.Object.create(column: 'id')
    Em.Object.create(column: 'firstName')
    Em.Object.create(column: 'middleName')
    Em.Object.create(column: 'lastName')
    Em.Object.create(column: 'address1')
    Em.Object.create(column: 'address2')
    Em.Object.create(column: 'city')
    Em.Object.create(column: 'state')
    Em.Object.create(column: 'zip')
  ]).property()

  toggleSort: (column) ->
    if @get('sortedColumn') is column
      @toggleProperty 'sortAscending'
    else
      @set('sortProperties', [column])
      @set('sortAscending', true)