App.EmploymentController = Em.ObjectController.extend
  doneEditing: ->
    @get('store').commit()
    @transitionToRoute 'debtor'