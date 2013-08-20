App.ContactController = App.EditObjectController.extend
  needs: [
    'debtor'
    'countries'
    'phoneTypes'
    'phoneStatuses'
    'phoneSources'
    'yesNo'
  ]

  setSelections: ->
    @get('controllers.countries').setSelectedById(@get('country'))
    @get('controllers.phoneTypes').setSelectedById(@get('type'))
    @get('controllers.phoneStatuses').setSelectedById(@get('status'))
    @get('controllers.phoneSources').setSelectedById(@get('source'))
    @get('controllers.yesNo').setSelectedById(@get('consent'))

  getSelections: ->
    @set('country', @get('controllers.countries').getSelectedId())
    @set('type', @get('controllers.phoneTypes').getSelectedId())
    @set('status', @get('controllers.phoneStatuses').getSelectedId())
    @set('source', @get('controllers.phoneSources').getSelectedId())
    @set('consent', @get('controllers.yesNo').getSelectedId())