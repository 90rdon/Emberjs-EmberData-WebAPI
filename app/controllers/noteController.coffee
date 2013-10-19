App.NoteController = App.EditObjectController.extend
  needs: [
    'debtorAccount'
    'actionCodes'
    'resultCodes'
    'application'
    'debtor'
  ]

  labelActionCode: (->
    actionCode = @get('controllers.actionCodes').findProperty('id', @get('actionCode'))
    return @get('actionCode')   if actionCode == null || actionCode == undefined
    actionCode.value
  ).property('actionCode')

  setSelections: ->
    false

  getSelections: ->
    false

  actions:
    saveNote: ->
      @set('content.actionCode', 211)
      @set('content.resultCode', 266)
      @set('userId', @get('controllers.application.params.userId'))
      @set('debtorId', @get('controllers.debtor.id'))
      @set('debtor', @get('controllers.debtor.content'))
      @send('doneEditing')

    closeNote: ->
      @transitionToRoute 'debtor'

    cancelNote: ->
      @send('cancelEditing')