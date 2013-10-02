App.DebtorRoute = Em.Route.extend
  observesParameters: [ 'clientId', 'userId', 'canEditDebtor' ]
  
  model: (params) ->
    App.Debtor.find(params.debtor_id)

  setupController: (controller, model, queryParams) ->
    controller.set 'model', model
    @controllerFor('application').set 'params', @get('queryParameters')
    @controllerFor('countries').set 'content', App.Country.find()
    @controllerFor('relationships').set 'content', App.Relationship.find()
    @controllerFor('actionCodes').set 'content', App.ActionCode.find()
    @controllerFor('resultCodes').set 'content', App.ResultCode.find()