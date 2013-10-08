App.NoteController = Em.ObjectController.extend
  needs: [
    'debtorAccount'
    'actionCodes'
    'resultCodes'
  ]
  close: ->
    @transitionToRoute 'debtor'

  labelActionCode: (->
    actionCode = @get('controllers.actionCodes').findProperty('id', @get('actionCode'))
    return @get('actionCode')   if actionCode == null || actionCode == undefined
    actionCode.value
  ).property('actionCode')