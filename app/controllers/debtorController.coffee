App.DebtorController = Em.ObjectController.extend
  name: (->
    first   = @get('firstName') || ''
    middle  = @get('middleName') || ''
    last    = @get('lastName') || ''

    # return first + ' ' + last   unless middle
    return first + ' ' + middle + ' ' + last
  ).property('firstName', 'lastName', 'middleName', 'type')

  isEditing: false

  emailv: false

  doneEditing: ->
    @set('isEditing', false)
    @set('type', @get('selectedType.id'))
    @get('store').commit()

  edit: ->
    @set('isEditing', true)
    @set('selectedType', App.ConsumerFlagsController.findProperty('id', @get('type')))

  back: ->
    @set('isEditing', false)
    @transitionToRoute 'debtors'

  selectedType: null