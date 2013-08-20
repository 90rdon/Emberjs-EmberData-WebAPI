App.PersonsController = App.ColumnSorterController.extend
  needs: [
    'debtor'
    'person'
  ]

  columns: (-> [
    Em.Object.create(column: 'name')
    Em.Object.create(column: 'relationship')
    Em.Object.create(column: 'phone')
    Em.Object.create(column: 'city')
    Em.Object.create(column: 'state')
    Em.Object.create(column: 'comment')
  ]).property()

  create: ->
    transaction = @get('store').transaction()
    @transitionToRoute 'person', transaction.createRecord(App.Person, 'debtor': @get('controllers.debtor').content, 'debtorId': @get('controllers.debtor').content.id)