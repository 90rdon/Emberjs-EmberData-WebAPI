App.ContactController = Em.ObjectController.extend()
  # needs: 'contact'

  # fullPhone: (->
  #   phone = @get('phone') || ''
  #   extension = @get('extension') || ''

  #   return phone + ' ' + extension
  # ).property('phone', 'extension')

  # isEditing: false

  # doneEditing: ->
  #   @set('isEditing', false)
  #   @get('store').commit()

  # edit: ->
  #   @set('isEditing', true)

  # back: ->
  #   @set('isEditing', false)
  #   @transitionToRoute 'debtors'