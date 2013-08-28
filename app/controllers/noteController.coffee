App.NoteController = Em.ObjectController.extend
  needs: [
    'actionCodes'
    'resultCodes'
  ]
  close: ->
    @transitionToRoute 'debtor'

  labelActionCode: (->
    actionCode = @get('controllers.actionCodes').findProperty('id', @get('actionCode'))
    return null   if actionCode == null || actionCode == undefined
    actionCode.value
  ).property('actionCode')