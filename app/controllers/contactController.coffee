App.ContactController = Em.ObjectController.extend
  needs: [
    'debtor'
    'countries'
    'phoneTypes'
    'phoneStatuses'
    'phoneSources'
    'yesNo'
  ]

  # transaction: null

  loaded: (->
    @get('controllers.countries').setSelectedById(@get('country'))
    @get('controllers.phoneTypes').setSelectedById(@get('type'))
    @get('controllers.phoneStatuses').setSelectedById(@get('status'))
    @get('controllers.phoneSources').setSelectedById(@get('source'))
    @get('controllers.yesNo').setSelectedById(@get('consent'))
  ).observes('@content.isLoaded')

  dirtied: (->
    if @get('transaction') == null && @get('isDirty') == true
      @set('transaction', @get('store').transaction())
  ).observes('isDirty')

  doneEditing: ->
    @set('country', @get('controllers.countries').getSelectedId())
    @set('type', @get('controllers.phoneTypes').getSelectedId())
    @set('status', @get('controllers.phoneStatuses').getSelectedId())
    @set('source', @get('controllers.phoneSources').getSelectedId())
    @set('consent', @get('controllers.yesNo').getSelectedId())

    if (@get('transaction') != null)
      @get('transaction').commit()
      @get('store').commit()
    @transitionToRoute 'debtor'

  cancelEditing: ->
    if (@get('transaction') != null)
      @get('transaction').rollback()
    @transitionToRoute 'debtor'