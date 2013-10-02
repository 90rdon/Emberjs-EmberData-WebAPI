App.IndexRoute = Em.Route.extend
  observesParameters: [ 'userId', 'canEditDebtor', 'feePercentage' ]

  model: (params) ->
    App.Client.find(params.client_id)

  setupController: (controller, model, queryParams) ->
    controller.set 'model', model.get('debtors')

    @controllerFor('application').set 'params', Em.Object.create
      clientId: model.get('clientId')
      userId: @get('queryParameters.userId')
      canEditDebtor: @get('queryParameters.canEditDebtor')
      feePercentage: @get('queryParameters.feePercentage')
