App.NotesController = App.ColumnSorterController.extend
  columns: (-> [
    Em.Object.create(column: 'time')
    Em.Object.create(column: 'actionCode')
    Em.Object.create(column: 'resultCode')
    Em.Object.create(column: 'message')
    Em.Object.create(column: 'user')
  ]).property()

  loaded: (->
    @set('sortProperties', ['time'])
    @set('sortAscending', false)
  ).observes('content.@each')