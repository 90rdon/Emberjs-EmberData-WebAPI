App.DebtorController = App.EditObjectController.extend
  needs: [
    'contacts'
    'employments'
    'persons'
    'notes'
    'countries'
    'consumerFlags'
    'titles'
    'suffixes'
    'validInvalid'
    'yesNo'
    'actionCodes'
    'resultCodes'
  ]
    
  setSelections: ->
    @get('controllers.consumerFlags').setSelectedById(@get('type'))
    @get('controllers.titles').setSelectedById(@get('title'))
    @get('controllers.suffixes').setSelectedById(@get('suffix'))
    @get('controllers.validInvalid').setSelectedById(@get('emailValidity'))
    @get('controllers.yesNo').setSelectedById(@get('optIn'))
    @get('controllers.countries').setSelectedById(@get('country'))

  getSelections: ->
    @set('type', @get('controllers.consumerFlags').getSelectedId())
    @set('title', @get('controllers.titles').getSelectedId())
    @set('suffix', @get('controllers.suffixes').getSelectedId())
    @set('emailValidity', @get('controllers.validInvalid').getSelectedId())
    @set('optIn', @get('controllers.yesNo').getSelectedId())
    @set('country', @get('controllers.countries').getSelectedId())

  back: ->
    @set('isEditing', false)
    @transitionToRoute 'index'

  makePayment: ->
    window.open App.paymentPostingUrl

  toCancel: false
  confirmationNumber: null

  sendCancellation: ->
    @set('toCancel', false)
    $.ajax
      url: '/api/cancellation'
      dataType: 'json'
      type: 'POST'
      data:
        actionCode: 13
        resultCode: 21
      success: (response) ->
        @set('confirmationNumber', response)

  cancellation: ->
    @toggleProperty('toCancel')

  
  # showConfirmation: (item) ->
  #   @set('isConfirmationShown', true)

  # hideConfirmation: ->
  #   @set('isConfirmationShown', false)

  # isConfirmationShown: false