App.NoteIndexController = Em.ObjectController.extend
  needs: [
    'note'
  ]

  actions:
    closeNote: ->
      @transitionToRoute 'debtor'