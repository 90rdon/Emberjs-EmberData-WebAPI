App.ColumnItemController = Em.ObjectController.extend
  sortColumn:
    Em.computed.alias('parentController.sortedColumn')
  
  sortAscending:
    Em.computed.alias('parentController.sortAscending')
  
  sortDescending:
    Em.computed.not('sortAscending')
  
  isSorted: (->
    @get('sortColumn') is @get('columnName')
  ).property('sortColumn', 'columnName')
  
  sortedAsc:
    Em.computed.and('sortAscending', 'isSorted')
  
  sortedDesc:
    Em.computed.and('sortDescending', 'isSorted')



