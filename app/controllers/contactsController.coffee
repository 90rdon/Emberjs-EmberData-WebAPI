App.ContactsController = App.ColumnSorterController.extend
  needs: [
    'debtor'
    'contact'
    'phoneTypes'
  ]

  itemController: 'contact'

  columns: (-> [
    Em.Object.create(column: 'phone')
    Em.Object.create(column: 'extension')
    Em.Object.create(column: 'type')
    # Em.Object.create(column: 'score')
    # Em.Object.create(column: 'source')
    Em.Object.create(column: 'status')
  ]).property()

  actions:
    create: ->
      transaction = @get('store').transaction()
      @transitionToRoute 'contact', transaction.createRecord(App.Contact, 'debtor': @get('controllers.debtor').content, 'debtorId': @get('controllers.debtor').content.id)

    delete: (item) ->
      item.deleteRecord()
      @get('store').commit()