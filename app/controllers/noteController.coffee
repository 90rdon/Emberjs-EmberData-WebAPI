App.NoteController = Em.ObjectController.extend
  close: ->
    @transitionToRoute 'debtor'