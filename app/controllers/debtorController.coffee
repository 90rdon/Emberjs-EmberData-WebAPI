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

  back: ->
    @set('isEditing', false)
    @transitionToRoute 'index'

  makePayment: ->
    window.open App.paymentPostingUrl

  toCancel: false
  confirmationNumber: null

  sendCancellation: ->
    # console.log 'userid = ' + @get('params.userId')
    # @set('toCancel', false)
    # console.log 'account id = ' + @get('agencyId')
    # console.log 'cancellation code = ' + @get('controllers.cancellationCodes').getSelectedId()
    # console.log 'result code = ' + @get('controllers.resultCodes').getSelectedId()
    # console.log 'url = ' + App.serverUrl + '/' + App.serverNamespace
    $.ajax
      url: App.serverUrl + '/' + App.serverNamespace + '/cancellation'
      dataType: 'json'
      type: 'POST'
      data:
        accountId:        @get('accountId')
        agencyId:         @get('agencyId')
        userId:           @get('params.userId')
        cancellationCode: @get('controllers.cancellationCodes').getSelectedId()
        debtorId:         @get('id')
        clientId:         @get('controllers.application').clientId
        creditorId:       @get('creditorId')
      success: (response) ->
        # @set('confirmationNumber', response)
        @set('toCancel', false)


  cancellation: ->
    @toggleProperty('toCancel')

  
  # showConfirmation: (item) ->
  #   @set('isConfirmationShown', true)

  # hideConfirmation: ->
  #   @set('isConfirmationShown', false)

  # isConfirmationShown: false