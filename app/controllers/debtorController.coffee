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
    'application'
    'cancellationCodes'
    'resultCodes'
  ]

  params: (->
    @get('controllers.application.params')
  ).property('controllers.application.params')
  
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

  close: ->
    @set('isEditing', false)
    # @transitionToRoute 'index'
    window.close()

  makePayment: ->
    window.open App.paymentPostingUrl

  toCancel: false
  toHold: false
  processing: false
  cancellationSuccess: false
  holdSuccess: false
  confirmationNumber: null

  sendCancellation: ->
    @set('toCancel', false)
    @set('processing', true)
    $.ajax
      url: App.serverUrl + '/' + App.serverNamespace + '/cancellation'
      dataType: 'json'
      type: 'POST'
      data:
        accountId:        @get('accountId')
        agencyId:         @get('agencyId')
        userId:           @get('params.userId')
        shortCode:        @get('controllers.cancellationCodes').getSelectedId()
        debtorId:         @get('id')
        clientId:         @get('params.clientId')
        creditorId:       @get('creditorId')
      success: (response) ->
        App.__container__.lookup('controller:debtor').set('processing', false)
        App.__container__.lookup('controller:debtor').set('cancellationSuccess', true)

  sendHold: ->
    @set('toHold', false)
    @set('processing', true)
    $.ajax
      url: App.serverUrl + '/' + App.serverNamespace + '/holdAccount'
      dataType: 'json'
      type: 'POST'
      data:
        accountId:        @get('accountId')
        agencyId:         @get('agencyId')
        userId:           @get('params.userId')
        debtorId:         @get('id')
        clientId:         @get('params.clientId')
        creditorId:       @get('creditorId')
      success: (response) ->
        App.__container__.lookup('controller:debtor').set('processing', false)
        App.__container__.lookup('controller:debtor').set('cancellationSuccess', true)

  showProcessing: ->
    @toggleProperty('processing')
        
  holdAccount: ->
    @toggleProperty('toHold')

  cancellation: ->
    @toggleProperty('toCancel')

  closeCancelSuccess: ->
    @toggleProperty('cancellationSuccess')

  closeHoldSuccess: ->
    @toggleProperty('holdSuccess')