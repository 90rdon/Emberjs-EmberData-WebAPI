App.PersonController = Em.ObjectController.extend
  doneEditing: ->
    @get('store').commit()
    @transitionToRoute 'debtor'