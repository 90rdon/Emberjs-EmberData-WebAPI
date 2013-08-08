App.Contact = Em.ObjectController.extend
  isEditing: false

  doneEditing: ->
    @set('isEditing', false)
    @get('store').commit()

  edit: ->
    @set('isEditing', true)