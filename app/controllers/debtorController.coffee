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
    'actionCodes'
    'resultCodes'
    'debtorAccount'
  ]

  toCancel: false
  toHold: false
  loading: true
  processing: false
  cancellationSuccess: false
  holdSuccess: false
  confirmationNumber: null

  accountId: (->
    @get('controllers.debtorAccount.id')
  ).property('controllers.debtorAccount.id')

  params: (->
    @get('controllers.application.params')
  ).property('controllers.application.params')

  disableEdit: (->
    return false if @get('params.canEditDebtor') is 'true'
    true
  ).property()
  
  loaded:(->
    @set('loading', false)
    # setInterval (=> @poll()), 30000
  ).observes('content.isLoaded')

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

  actions:
    close: ->
      @set('isEditing', false)
      window.close()

    makePayment: ->
      window.open App.paymentPostingUrl

    sendCancellation: ->
      self = @
      @set('toCancel', false)
      @set('processing', true)
      $.ajax
        url: App.serverUrl + '/' + App.serverNamespace + '/cancellation'
        dataType: 'json'
        type: 'POST'
        data:
          accountId:        @get('accountId')
          agencyId:         @get('controllers.debtorAccount.agencyId')
          userId:           @get('params.userId')
          shortCode:        @get('controllers.cancellationCodes').getSelectedId()
          debtorId:         @get('id')
          clientId:         @get('params.clientId')
          creditorId:       @get('creditorId')
        success: (response) ->
          self.get('content').refresh()
          Em.run.later (->
            self.set('processing', false)
            self.set('cancellationSuccess', true)), 5000

    sendHold: ->
      self = @
      @set('toHold', false)
      @set('processing', true)
      $.ajax
        url: App.serverUrl + '/' + App.serverNamespace + '/holdAccount'
        dataType: 'json'
        type: 'POST'
        data:
          accountId:        @get('accountId')
          agencyId:         @get('controllers.debtorAccount.agencyId')
          userId:           @get('params.userId')
          debtorId:         @get('id')
          clientId:         @get('params.clientId')
          creditorId:       @get('creditorId')
        success: (response) ->
          self.get('content').refresh()
          Em.run.later (->
            self.set('processing', false)
            self.set('holdSuccess', true)), 5000

    cancellation: ->
      @toggleProperty('toCancel')
      false

    holdAccount: ->
      @toggleProperty('toHold')
      false

    hideLoading: ->
      @toggleProperty('loading')
      false

    showProcessing: ->
      @toggleProperty('processing')
      false

    closeCancelSuccess: ->
      @toggleProperty('cancellationSuccess')
      false

    closeHoldSuccess: ->
      @toggleProperty('holdSuccess')
      false
