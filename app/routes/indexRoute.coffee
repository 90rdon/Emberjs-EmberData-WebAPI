App.IndexRoute = Em.Route.extend
  observesParameters: [ 'userId', 'canEditDebtor', 'feePercentage' ]

  clientId: null

  model: (params) ->
    @set('clientId', params.client_id)
    App.IndexClient.find(params.client_id)
    # @set('clientId', params.client_id)
    # @get('store').findQuery('indexClient',
    #   id: params.client_id
    #   limit: 25
    #   offset: 0
    # )

  # afterModel: (params) ->
  #   @get('store').findQuery('indexClient',
  #     id: @get('clientId')
  #     limit: 25
  #     offset: 25
  #   )

  setupController: (controller, model, queryParams) ->
    controller.set 'model', model.get('indexDebtors')

    @controllerFor('application').set 'params', Em.Object.create
      clientId:       model.get('clientId')
      userId:         @get('queryParameters.userId')
      canEditDebtor:  @get('queryParameters.canEditDebtor')
      feePercentage:  @get('queryParameters.feePercentage')