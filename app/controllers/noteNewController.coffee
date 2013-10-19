App.NoteNewController = Em.ObjectController.extend
  needs: [
    'note'
    'application'
    'debtor'
  ]

  actions:
    saveNewNote: ->
      @get('controllers.note').send('saveNote')

    cancelNewNote: ->
      @get('controllers.note').send('cancelNote')