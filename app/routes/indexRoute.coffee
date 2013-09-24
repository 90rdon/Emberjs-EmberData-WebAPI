App.IndexRoute = Em.Route.extend
  observesParameters: [ 'userId', 'canEditDebtor', 'feePercentage' ]

  model: (params) ->
    App.Client.find(params.client_id)

  setupController: (controller, model, queryParams) ->
    controller.set 'model', model.get('debtors')
    @controllerFor('application').set 'params', @get('queryParameters')
    @controllerFor('countries').set 'content', App.Country.find()
    @controllerFor('relationships').set 'content', App.Relationship.find()