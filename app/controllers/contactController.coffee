App.ContactController = Em.ObjectController.extend
  needs: [
    'countries'
  ]

  # Em.run.next @, ->
  #   App.PhoneTypeController.setSelectedById(@get('type'))
  #   App.PhoneStatusController.setSelectedById(@get('status'))
  #   controllers.countries.setSelectedById(@get('country'))
    
  # init: ->
  #   @_super()
  #   # App.PhoneTypeController.setSelectedById(@get('type'))
  #   # App.PhoneStatusController.setSelectedById(@get('status'))
  #   App.PhoneSourceController.setSelectedById(@get('source'))
  #   App.YesNoController.setSelectedById(@get('consent'))

  doneEditing: ->
    @set('type', App.PhoneTypeController.getSelectedId())
    @set('status', App.PhoneStatusController.getSelectedId())
    @set('source', App.PhoneSourceController.getSelectedId())
    @set('consent', App.YesNoController.getSelectedId())

    @get('store').commit()
    @transitionToRoute 'debtor'