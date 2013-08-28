App.ContactController = App.EditObjectController.extend
  needs: [
    'debtor'
    'countries'
    'phoneTypes'
    'phoneStatuses'
    'sources'
    'yesNo'
  ]

  setSelections: ->
    @get('controllers.countries').setSelectedByIdStr(@get('country'))
    @get('controllers.phoneTypes').setSelectedById(@get('type'))
    @get('controllers.phoneStatuses').setSelectedById(@get('status'))
    @get('controllers.sources').setSelectedById(@get('source'))
    @get('controllers.yesNo').setSelectedById(@get('consent'))

  getSelections: ->
    @set('country', @get('controllers.countries').getSelectedId())
    @set('type', @get('controllers.phoneTypes').getSelectedId())
    @set('status', @get('controllers.phoneStatuses').getSelectedId())
    @set('source', @get('controllers.sources').getSelectedId())
    @set('consent', @get('controllers.yesNo').getSelectedId())

  labelPhoneType: (->
    type = @get('controllers.phoneTypes').findProperty('id', @get('type'))
    return null   if type == null || type == undefined
    type.label
  ).property('type')

  labelPhoneStatus: (->
    status = @get('controllers.phoneStatuses').findProperty('id', @get('status'))
    return null   if status == null || status == null
    status.label
  ).property('status')