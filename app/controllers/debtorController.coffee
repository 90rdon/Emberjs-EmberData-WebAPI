App.DebtorController = Em.ObjectController.extend
  needs: [
    'countries'
    'consumerFlags'
    'titles'
    'suffixes'
    'validInvalid'
    'yesNo'
  ]

  name: (->
    first   = @get('firstName') || ''
    middle  = @get('middleName') || ''
    last    = @get('lastName') || ''

    # return first + ' ' + last   unless middle
    return first + ' ' + middle + ' ' + last
  ).property('firstName', 'lastName', 'middleName')

  isEditing: false

  edit: ->
    @set('isEditing', true)
    @get('controllers.consumerFlags').setSelectedById(@get('type'))
    @get('controllers.titles').setSelectedById(@get('title'))
    @get('controllers.suffixes').setSelectedById(@get('suffix'))
    @get('controllers.validInvalid').setSelectedById(@get('emailValidity'))
    @get('controllers.yesNo').setSelectedById(@get('optIn'))
    @get('controllers.countries').setSelectedById(@get('country'))

  doneEditing: ->
    @set('isEditing', false)
    @set('type', @get('controllers.consumerFlags').getSelectedId())
    @set('title', @get('controllers.titles').getSelectedId())
    @set('suffix', @get('controllers.suffixes').getSelectedId())
    @set('emailValidity', @get('controllers.validInvalid').getSelectedId())
    @set('optIn', @get('controllers.yesNo').getSelectedId())
    @set('country', @get('controllers.countries').getSelectedId())
    @get('store').commit()


  back: ->
    @set('isEditing', false)
    @transitionToRoute 'index'