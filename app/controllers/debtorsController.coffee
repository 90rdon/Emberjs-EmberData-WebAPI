App.DebtorsController = Em.ArrayController.extend
  sortedColumn: (->
    properties = @get('sortProperties')
    return 'undefined'  unless properties
    properties.get 'firstObject'
  ).property('sortProperties.[]')

  columns: (-> [
    Em.Object.create(columnName: 'Debtor Number')
    Em.Object.create(columnName: 'First Name')
    Em.Object.create(columnName: 'Last Name')
    Em.Object.create(columnName: 'Address')
    Em.Object.create(columnName: 'City')
    Em.Object.create(columnName: 'State')
    Em.Object.create(columnName: 'Zip')
  ]).property()

  toggleSort: (column) ->
    if @get('sortedColumn') is column
      @toggleProperty 'sortAscending'
    else
      @set 'sortProperties', [column]
      @set 'sortAscending', true