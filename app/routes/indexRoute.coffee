App.IndexRoute = Em.Route.extend
  observesParameters: [ 'userId', 'canEditDebtor', 'feePercentage' ]

  clientId: null

  model: (params) ->
    @set('clientId', params.client_id)
    App.IndexClient.find(params.client_id)

  setupController: (controller, model, queryParams) ->
    controller.set 'model', model.get('indexDebtors')

    controller.set 'totalCount', model.get('data').totalDebtors

    @controllerFor('application').set 'params', Em.Object.create
      clientId:       model.get('clientId')
      userId:         @get('queryParameters.userId')
      canEditDebtor:  @get('queryParameters.canEditDebtor')
      feePercentage:  @get('queryParameters.feePercentage')

  actions:
    getMore: ->
      controller = @get('controller')
      page = controller.get('page')
      previousPage = page - 1
      # if previousPage == 0
      #   controller.set('loadingMore', false)
      nextPage = page + 1
      perPage = controller.get('perPage')
      totalCount = controller.get('totalCount')
      if page * perPage > totalCount
        controller.set('loadingMore', false)

      $.ajax
        url: App.serverUrl + '/' + App.serverNamespace + '/clientDebtors/' + @get('clientId') + '/?page=' + nextPage + '&limit=' + perPage
        success: (response) ->
          debtors = Em.A([])
          response.forEach (item) ->
            debtor = App.IndexDebtor.createRecord(item)
            debtors.pushObject(debtor)
          controller.send('gotMore',
            debtors
            nextPage
          )