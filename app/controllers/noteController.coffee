App.NoteController = Em.ObjectController.extend
  needs: [
    'debtorAccount'
    'actionCodes'
    'resultCodes'
  ]

  labelActionCode: (->
    actionCode = @get('controllers.actionCodes').findProperty('id', @get('actionCode'))
    return @get('actionCode')   if actionCode == null || actionCode == undefined
    actionCode.value
  ).property('actionCode')

  actions:
    closeNote: ->
      @transitionToRoute 'debtor'