App.DebtorController = Em.ObjectController.extend
  isEditing: false

  doneEditing: () ->
    this.set('isEditing', false)
    this.get('store').commit()

  edit: () ->
    this.set('isEditing', true)