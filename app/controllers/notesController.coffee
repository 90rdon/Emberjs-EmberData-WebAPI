App.NotesController = App.ColumnSorterController.extend
  needs: [
    'actionCodes'
    'debtor'
  ]

  columns: (-> [
    Em.Object.create(column: 'time')
    Em.Object.create(column: 'actionCode')
    Em.Object.create(column: 'resultCode')
    Em.Object.create(column: 'message')
  ]).property()

  loaded: (->
    @set('sortProperties', ['time'])
    @set('sortAscending', false)
  ).observes('content.@each')

  actions:
    create: ->
      transaction = @get('store').transaction()
      @transitionToRoute 'note', transaction.createRecord(App.Note, 'debtor': @get('controllers.debtor').content, 'debtorId': @get('controllers.debtor').content.id)