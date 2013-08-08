App.DebtorController = Em.ObjectController.extend
  fullName: (->
    first   = @get('firstName') || ''
    middle  = @get('middleName') || ''
    last    = @get('lastName') || ''

    # return first + ' ' + last   unless middle
    return first + ' ' + middle + ' ' + last
  ).property('firstName', 'lastName', 'middleName')

  isEditing: false

  emailv: false

  doneEditing: ->
    @set('isEditing', false)
    @get('store').commit()

  edit: ->
    @set('isEditing', true)

  back: ->
    @set('isEditing', false)
    @transitionToRoute 'debtors'