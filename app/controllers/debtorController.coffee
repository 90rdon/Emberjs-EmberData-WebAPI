App.DebtorController = Em.ObjectController.extend
  fullname: (->
    first   = @get('firstname')
    middle  = @get('middlename')
    last    = @get('lastname')

    return first + ' ' + last   unless middle
    return first + ' ' + middle + ' ' + last
  ).property('firstname', 'lastname', 'middlename')

  isEditing: false

  emailv: false

  doneEditing: ->
    @set('isEditing', false)
    @get('store').commit()

  edit: ->
    @set('isEditing', true)