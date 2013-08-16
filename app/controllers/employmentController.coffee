App.EmploymentController = Em.ObjectController.extend
  needs: [
    'associations'
    'employmentStatuses'
    'countries'
  ]

  doneEditing: ->
    @get('store').commit()
    @transitionToRoute 'debtor'